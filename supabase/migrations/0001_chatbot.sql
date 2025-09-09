-- ============================================================================
--  Chatbot comercial do portfólio — schema
-- ============================================================================
--  Nenhuma tabela é acessível pelo cliente: RLS está ligado e não existe
--  policy alguma, então a chave anon não lê nem escreve nada. Todo acesso
--  acontece na Edge Function `chat`, com a service role key.
-- ============================================================================

-- ---------------------------------------------------------------------------
--  conversations
-- ---------------------------------------------------------------------------
create table if not exists public.conversations (
  id           uuid primary key default gen_random_uuid(),
  session_id   text not null unique,
  status       text not null default 'active'
               check (status in ('active', 'proposal_ready', 'completed')),
  -- Memória compacta da conversa: dados já coletados e sinais técnicos.
  state        jsonb not null default '{}'::jsonb,
  -- Resumo das mensagens antigas, para não reenviar o histórico inteiro.
  summary      text,
  -- Categorias detectadas, desnormalizadas para consulta rápida.
  project_type text[] not null default '{}',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists conversations_updated_at_idx
  on public.conversations (updated_at desc);

-- ---------------------------------------------------------------------------
--  messages
-- ---------------------------------------------------------------------------
create table if not exists public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  role            text not null check (role in ('user', 'assistant')),
  content         text not null,
  created_at      timestamptz not null default now()
);

create index if not exists messages_conversation_idx
  on public.messages (conversation_id, created_at);

-- ---------------------------------------------------------------------------
--  leads
-- ---------------------------------------------------------------------------
create table if not exists public.leads (
  id              uuid primary key default gen_random_uuid(),
  -- Um lead por conversa: a Edge Function faz upsert conforme os dados chegam.
  conversation_id uuid not null unique
                  references public.conversations (id) on delete cascade,
  name            text,
  company         text,
  email           text,
  whatsapp        text,
  project_type    text[] not null default '{}',
  description     text,
  objective       text,
  features        text[] not null default '{}',
  integrations    text[] not null default '{}',
  deadline        text,
  budget          text,
  complexity      text check (complexity in ('small', 'medium', 'large', 'custom')),
  estimated_min   integer,
  estimated_max   integer,
  -- Mensagem final gerada para o WhatsApp.
  proposal        text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- ---------------------------------------------------------------------------
--  chat_rate_limits — janela deslizante por IP
-- ---------------------------------------------------------------------------
create table if not exists public.chat_rate_limits (
  key          text primary key,
  window_start timestamptz not null default now(),
  count        integer not null default 0
);

-- ---------------------------------------------------------------------------
--  updated_at automático
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists conversations_touch on public.conversations;
create trigger conversations_touch
  before update on public.conversations
  for each row execute function public.touch_updated_at();

drop trigger if exists leads_touch on public.leads;
create trigger leads_touch
  before update on public.leads
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
--  Rate limit atômico
-- ---------------------------------------------------------------------------
--  Incrementa e decide em uma única ida ao banco. Reinicia a contagem quando
--  a janela expira. Retorna quantos segundos faltam para liberar.
create or replace function public.chat_rate_limit_hit(
  p_key            text,
  p_window_seconds integer,
  p_max            integer
)
returns table (allowed boolean, retry_after integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_window_start timestamptz;
  v_count        integer;
  v_expired      boolean;
begin
  insert into chat_rate_limits as rl (key, window_start, count)
  values (p_key, now(), 1)
  on conflict (key) do update
    set count = case
          when rl.window_start < now() - make_interval(secs => p_window_seconds)
          then 1
          else rl.count + 1
        end,
        window_start = case
          when rl.window_start < now() - make_interval(secs => p_window_seconds)
          then now()
          else rl.window_start
        end
  returning rl.window_start, rl.count into v_window_start, v_count;

  if v_count > p_max then
    return query
      select false,
             greatest(
               1,
               p_window_seconds - extract(epoch from now() - v_window_start)::integer
             );
    -- `return query` acumula linhas e segue executando: sem este `return` a
    -- funcao devolveria tambem a linha de liberacao logo abaixo.
    return;
  end if;

  return query select true, 0;
end;
$$;

-- Limpeza opcional: chame por cron (pg_cron) ou manualmente.
create or replace function public.chat_rate_limits_prune()
returns void
language sql
as $$
  delete from public.chat_rate_limits where window_start < now() - interval '1 day';
$$;

-- ---------------------------------------------------------------------------
--  RLS: fechado para o cliente, aberto apenas para a service role
-- ---------------------------------------------------------------------------
alter table public.conversations    enable row level security;
alter table public.messages         enable row level security;
alter table public.leads            enable row level security;
alter table public.chat_rate_limits enable row level security;

-- Sem policies de propósito. `anon` e `authenticated` não têm acesso; a
-- service role usada pela Edge Function ignora RLS.
revoke all on public.conversations    from anon, authenticated;
revoke all on public.messages         from anon, authenticated;
revoke all on public.leads            from anon, authenticated;
revoke all on public.chat_rate_limits from anon, authenticated;

-- Postgres concede EXECUTE a PUBLIC por padrao: revogar de anon/authenticated
-- nao basta, e preciso tirar de PUBLIC. Sem isso a chave anonima conseguiria
-- chamar estas funcoes via PostgREST e inflar a tabela de rate limit.
revoke all on function public.chat_rate_limit_hit(text, integer, integer)
  from public, anon, authenticated;
revoke all on function public.chat_rate_limits_prune()
  from public, anon, authenticated;
revoke all on function public.touch_updated_at()
  from public, anon, authenticated;
