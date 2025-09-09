# Chatbot comercial do portfólio

Pré-vendedor que conversa com o visitante, entende o projeto, classifica o
serviço, estima uma faixa de investimento e gera um briefing pronto para chegar
no seu WhatsApp.

---

## 1. Como funciona

```
Visitante ─► ChatWidget (Next, client)
               │  POST { sessionId, message }
               │  headers: apikey + authorization = ANON KEY (públicas)
               ▼
     Edge Function /chat (Deno, Supabase)
      1. valida payload e origem
      2. rate limit por IP (hash, janela deslizante no Postgres)
      3. carrega memória: state + summary + últimas 6 mensagens
      4. canned.ts: pill de contexto ou intenção óbvia responde por regra (0 token)
      5. Gemini — 1 chamada, saída JSON obrigatória, teto de turnos por conversa
      6. estimate.ts calcula complexidade e faixa (determinístico)
      7. proposal.ts monta resumo + mensagem do WhatsApp + link wa.me
      8. grava messages, conversation e lead (service role)
               │
               ▼ { message, state, proposalReady, proposal, whatsappUrl }
        Widget ─► resumo no chat ─► "Está correto" ─► botão WhatsApp
```

Três decisões explicam o resto do código:

**A IA nunca fala preço.** O Gemini só extrai fatos e sinais técnicos
(`has_auth`, `has_payments`, número de telas, complexidade de negócio). A faixa
sai de `lib/chatbot/config.ts` por cálculo em `estimate.ts`. É impossível o
modelo inventar um valor, porque ele não vê a tabela de preços.

**O navegador não fala com o banco.** RLS está ligado nas quatro tabelas e não
existe nenhuma policy — a chave anônima não lê nem escreve nada. Todo acesso
acontece dentro da função, com a service role key.

**A barra da proposta não é persistida.** Ela vive só na sessão em que foi
gerada: recarregar a página ou reiniciar a conversa faz o botão do WhatsApp
desaparecer. O resumo continua legível no fio (o transcript fica em
localStorage), mas a chamada para ação não volta com uma estimativa que pode
estar defasada — se o visitante seguir conversando, ela reaparece no próximo
turno em que o modelo marcar `proposal_ready`.

**A memória é comprimida, não o histórico.** O que viaja a cada turno é o
`state` (dados já coletados) mais um resumo de 1–2 frases que o próprio modelo
reescreve, e só as últimas 8 mensagens. Conversa longa não vira conta alta.

---

## 2. Arquivos

```
lib/chatbot/
  config.ts        ← ÚNICO arquivo que você edita no dia a dia
  types.ts         contratos compartilhados
  estimate.ts      complexidade e faixa de investimento
  proposal.ts      resumo em markdown, mensagem e link wa.me
  canned.ts        respostas padrão e quick replies sem chamar o modelo
  session.ts       sessão e histórico no navegador
  client.ts        chamada à Edge Function

components/chat/
  chat-widget.tsx    botão flutuante + janela
  use-chat.ts        estado da conversa
  chat-messages.tsx  fio de mensagens, loading, erro e retry
  chat-composer.tsx  campo de texto, sugestões, envio
  chat-proposal.tsx  barra de ação com o botão do WhatsApp
  markdown.tsx       markdown mínimo, sem innerHTML

supabase/
  migrations/0001_chatbot.sql   schema, rate limit e RLS
  functions/chat/index.ts       handler
  functions/_shared/
    prompt.ts    system prompt (montado a partir da config)
    gemini.ts    transporte e schema de saída
    state.ts     normalização, merge e defesa contra injeção
    db.ts        Postgres com service role
    cors.ts      CORS e helpers de resposta
    config.ts types.ts estimate.ts proposal.ts canned.ts   ← GERADOS, não edite

scripts/sync-edge-shared.mjs   espelha lib/chatbot → functions/_shared
```

### Por que existem cópias em `functions/_shared/`

O Deno exige extensão explícita nos imports (`./config.ts`), o webpack do Next
não aceita. A fonte de verdade é sempre `lib/chatbot/`; o script copia os quatro
módulos puros e ajusta os imports:

```bash
bun run edge:sync     # rode depois de mexer em lib/chatbot/
```

`bun run edge:deploy` já faz o sync antes de publicar.

---

## 3. Configuração

Tudo que você vai querer mudar está em [`lib/chatbot/config.ts`](../lib/chatbot/config.ts):

| Bloco | O que controla |
| --- | --- |
| `DEVELOPER` | nome, número do WhatsApp, e-mail, bio e stack usados no prompt |
| `GREETING` | primeira mensagem do chat |
| `SERVICES` | catálogo de serviços, com as palavras que ajudam a IA a classificar |
| `PRICING` | faixa de investimento por categoria |
| `COMPLEXITY_RULES` | régua de pontuação, faixas, acréscimos e arredondamento |
| `BUSINESS_RULES` | avisos obrigatórios e ordem das perguntas |
| `LIMITS` | tamanho de mensagem, janela de histórico, tetos de turno e rate limit |
| `CONTEXT_PILLS` | pills de contexto: categoria, pergunta seguinte, opções e sinais |
| `UI` | sugestões iniciais e rótulos dos botões |

Depois de editar: `bun run edge:sync` e redeploy da função.

### Ajustar preços

```ts
export const PRICING: Record<ProjectCategory, PriceRange | null> = {
  landing_page: { min: 900, max: 2200 },
  saas: { min: 5500, max: null },           // null = "a partir de"
  maintenance: { min: 800, max: 3000, monthly: true },
  other: null,                              // null = sob consulta
};
```

A complexidade posiciona o projeto dentro da faixa da categoria:

| Complexidade | Pontuação | Fatia da faixa |
| --- | --- | --- |
| `small` | 0–3 | 0% a 30% |
| `medium` | 4–8 | 10% a 50% |
| `large` | 9–13 | 40% a 85% |
| `custom` | 14+ | 70%+, sem teto |

Exemplo real, com a config atual — sistema de contratos com login, alertas,
dashboard e integração com WhatsApp: 7 pontos → `medium` → **R$ 4.000 –
R$ 7.500**. Pagamento e IA entram como acréscimo fixo (`addOns`), não como
multiplicador, para a conta continuar auditável.

O piso da faixa arredonda para baixo e o teto para cima (`roundTo`), para o
arredondamento nunca anunciar um mínimo acima do piso da categoria.

Quando a confiança do modelo cai abaixo de `minConfidenceForEstimate` (0.5) ou
a categoria não tem faixa, nenhum número aparece — o chat responde com
`BUSINESS_RULES.uncertaintyMessage`.

### Adicionar um serviço

1. Novo valor em `ProjectCategory` (`lib/chatbot/types.ts`).
2. Entrada em `SERVICES` com `keywords` — é o que o modelo usa para classificar.
3. Faixa em `PRICING`.
4. `bun run edge:sync` e redeploy.

Nada disso mexe no prompt: ele é montado a partir da config.

---

## 4. Variáveis de ambiente

| Variável | Onde vive | Pública? |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel / `.env.local` | sim |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel / `.env.local` | sim |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Vercel / `.env.local` | sim |
| `NEXT_PUBLIC_CHAT_ENDPOINT` | opcional, para dev local | sim |
| `GEMINI_API_KEY` | secrets da Edge Function | **NÃO** |
| `GEMINI_MODEL` | secrets da Edge Function (opcional) | — |
| `GEMINI_FALLBACK_MODELS` | secrets da Edge Function (opcional, lista por vírgula) | — |
| `WHATSAPP_NUMBER` | secrets da Edge Function | — |
| `ALLOWED_ORIGINS` | secrets da Edge Function | — |
| `RATE_LIMIT_SALT` | secrets da Edge Function | **NÃO** |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | injetadas pelo runtime | **NÃO** |

Modelos prontos: [`.env.example`](../.env.example) e
[`supabase/.env.local.example`](../supabase/.env.local.example).

O widget se esconde sozinho se `NEXT_PUBLIC_SUPABASE_URL` ou
`NEXT_PUBLIC_SUPABASE_ANON_KEY` faltarem — melhor não existir do que existir
quebrado.

---

## 5. Rodar localmente

Pré-requisitos: Bun (ou npm), Supabase CLI e Docker para o Supabase local.

```bash
# 1. Supabase local (cria .supabase/ e sobe Postgres, API e edge runtime)
npx supabase init          # só na primeira vez; não sobrescreve migrations
npx supabase start

# 2. Aplica o schema
npx supabase db reset      # roda supabase/migrations/0001_chatbot.sql

# 3. Segredos da função
cp supabase/.env.local.example supabase/.env.local
# edite e coloque sua GEMINI_API_KEY

# 4. Sobe a função
bun run edge:serve         # http://127.0.0.1:54321/functions/v1/chat

# 5. Front-end, em outro terminal
cp .env.example .env.local
# NEXT_PUBLIC_SUPABASE_URL e ANON_KEY: use os valores impressos por `supabase start`
# e aponte NEXT_PUBLIC_CHAT_ENDPOINT=http://127.0.0.1:54321/functions/v1/chat
bun dev
```

Testar a função sem abrir o navegador:

```bash
curl -i http://127.0.0.1:54321/functions/v1/chat \
  -H "content-type: application/json" \
  -H "authorization: Bearer <ANON_KEY>" \
  -H "apikey: <ANON_KEY>" \
  -d '{"sessionId":"teste12345678","message":"Preciso de um site para minha empresa"}'
```

### Sem Docker

Use um projeto Supabase de desenvolvimento na nuvem: aplique a migração pelo SQL
Editor, faça `supabase functions deploy chat`, e no `.env.local` aponte para a URL
real do projeto. O `bun dev` conversa com a função remota sem problema.

---

## 6. Deploy

**Banco** — cole `supabase/migrations/0001_chatbot.sql` no SQL Editor, ou:

```bash
npx supabase link --project-ref <ref>
npx supabase db push
```

**Segredos da função:**

```bash
npx supabase secrets set \
  GEMINI_API_KEY=AIza... \
  WHATSAPP_NUMBER=5585988661417 \
  ALLOWED_ORIGINS=https://jonfr-portfolio.netlify.app,https://seudominio.com \
  RATE_LIMIT_SALT=$(openssl rand -hex 16)
```

**Função:**

```bash
bun run edge:deploy        # sync + supabase functions deploy chat
```

**Front-end** — na Vercel (ou Netlify), defina `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY` e `NEXT_PUBLIC_WHATSAPP_NUMBER`, e faça o deploy
normal. Não defina `NEXT_PUBLIC_CHAT_ENDPOINT` em produção: o padrão já aponta
para `<SUPABASE_URL>/functions/v1/chat`.

Depois do deploy, confirme que `ALLOWED_ORIGINS` tem exatamente o domínio de
produção — vazio libera qualquer site a consumir sua cota do Gemini.

---

## 6b. Modelos e cota do Gemini

A cota do free tier é **por modelo, por dia** — quando um esgota, o próximo da
cadeia ainda tem chamadas. `GEMINI_MODEL` define o primeiro, e
`GEMINI_FALLBACK_MODELS` os seguintes:

```bash
npx supabase secrets set \
  GEMINI_MODEL=gemini-3.5-flash \
  GEMINI_FALLBACK_MODELS=gemini-3.5-flash-lite,gemini-2.5-flash
```

Como a cadeia é percorrida, em `functions/_shared/gemini.ts`:

| Resposta do modelo | O que acontece |
| --- | --- |
| 429 (cota) | pula direto para o próximo modelo, sem retentar o mesmo |
| 404 (modelo retirado) | próximo modelo |
| 400 (forma do pedido) | tenta outra forma de desligar o *thinking*, depois o próximo modelo |
| 401 / 403 (chave) | falha na hora — trocar de modelo não resolve |
| 5xx / rede / JSON inválido | uma retentativa, depois o próximo modelo |
| todos com 429 | HTTP 429 com `BUSINESS_RULES.quotaMessage` e `retry-after` |

O `retry-after` usa o número sugerido pelo próprio Gemini ("Please retry in
10.03s") quando ele vem na resposta; senão cai em
`LIMITS.geminiQuotaRetrySeconds`.

Gemini 2.x desliga o raciocínio com `thinkingConfig.thinkingBudget = 0`; Gemini
3.x com `thinkingLevel`. `buildBody()` escolhe pela família do modelo e, se
levar 400, tenta a variante seguinte — é o que permite misturar as duas
gerações na mesma cadeia.

Sinal de que a cota estourou, sem abrir log nenhum: o chat responde 429 com a
mensagem de limite. Os limites reais da sua chave ficam em
https://ai.dev/rate-limit — a Google não publica mais a tabela por modelo.

---

## 7. Segurança

- `GEMINI_API_KEY` e a service role key existem só no ambiente da função. O
  bundle do navegador carrega apenas URL e chave anônima.
- RLS ligado sem policies + `revoke` explícito: a chave anônima não alcança
  `conversations`, `messages`, `leads` nem `chat_rate_limits`.
- Rate limit de 25 mensagens por 10 minutos por IP, decidido em uma única ida ao
  banco (`chat_rate_limit_hit`). O IP é guardado como hash com sal, nunca em
  claro. Resposta 429 com `retry-after`, tratada pelo widget.
- Entrada validada antes de qualquer gasto: formato do `sessionId`, tipo e
  tamanho da mensagem (800 caracteres), remoção de caracteres de controle.
- Prompt injection: a mensagem do visitante viaja dentro de um bloco delimitado,
  marcada como conteúdo, e o system prompt manda ignorar qualquer instrução
  vinda dela. O `state` devolvido pelo modelo é normalizado — categoria fora do
  catálogo é descartada, listas e strings têm limite de tamanho.
- O que a IA devolve nunca chega ao DOM como HTML: `markdown.tsx` monta nós do
  React e só aceita links `http(s)` e `mailto`.
- Teto de 4 chamadas ao modelo (`LIMITS.maxLlmTurns`) e 30 mensagens gravadas
  por conversa, para o custo não crescer sem limite.
- `ALLOWED_ORIGINS` restringe quem pode chamar a função.

---

## 8. Custo por conversa

Nem toda mensagem vira chamada ao Gemini. `lib/chatbot/canned.ts` responde por
regra as intenções óbvias — saudação, "quanto custa", "qual o prazo", "é um
robô?", contato, agradecimento — e essas trocas custam zero token. Só mensagem
com contexto de projeto (ou acima de 90 caracteres) chega ao modelo.

Quando chega, entra:

- system prompt (~1.8k tokens, idêntico a cada turno — o cache implícito do
  Gemini cobre boa parte dele);
- estado coletado + resumo (~150 tokens);
- até 6 mensagens recentes, cada uma cortada em 500 caracteres;
- a mensagem atual (máx. 800 caracteres).

O que sai fica em ~200–350 tokens (`maxOutputTokens: 700`, thinking mínimo).

Três tetos seguram o custo por conversa:

| Limite | Valor | Efeito |
| --- | --- | --- |
| `forceProposalAfterTurns` | 3 | o sistema fecha o resumo por conta própria, sem esperar o modelo decidir |
| `maxLlmTurns` | 4 | acima disso a conversa devolve o resumo e manda para o WhatsApp |
| `maxMessagesPerConversation` | 30 | backstop absoluto, respostas padrão incluídas |

O prompt mira 2 perguntas (teto 3) e não pergunta nome, contato, prazo nem
público-alvo — isso o Jonathan coleta no WhatsApp e não muda a estimativa.
Cada resposta devolve `quickReplies` para o campo faltante, então o visitante
clica em vez de escrever texto longo.

A conversa alvo fecha em até 5 mensagens do visitante:

| # | Visitante | Custo |
| --- | --- | --- |
| 1 | clica no pill de contexto (Site / Aplicativo / Sistema de gestão / E-commerce) | 0 token |
| 2 | responde a pergunta do contexto | turno 1 |
| 3 | responde funcionalidades | turno 2 |
| 4 | responde integrações → **resumo + faixa + botão do WhatsApp** | turno 3 (`forceProposalAfterTurns`) |
| 5 | "Quero alterar algo" (opcional) | turno 4 (`maxLlmTurns`) |

Daí em diante a função devolve o resumo pronto e manda para o WhatsApp, sem
chamar o modelo. O resumo já sai com `BUSINESS_RULES.handoffMessage`, dizendo
que o resto se resolve por lá.

Para apertar mais: reduza `LIMITS.maxLlmTurns` ou `historyWindow`, encurte
`SERVICES[].summary`, ou troque `GEMINI_MODEL` por um modelo menor.

---

## 9. Consultar os leads

```sql
-- Leads mais recentes com a mensagem que foi para o WhatsApp
select created_at, name, company, whatsapp, project_type,
       complexity, estimated_min, estimated_max
from leads
order by created_at desc
limit 20;

-- Conversa inteira de um lead
select m.role, m.content, m.created_at
from messages m
join leads l on l.conversation_id = m.conversation_id
where l.id = '<uuid>'
order by m.created_at;

-- Onde as conversas param
select status, count(*) from conversations group by status;
```

O lead é gravado assim que existe tipo de projeto e descrição — conversa
abandonada no meio ainda deixa contato aproveitável.

---

## 10. Problemas comuns

| Sintoma | Causa provável |
| --- | --- |
| Botão não aparece | falta `NEXT_PUBLIC_SUPABASE_URL` ou `ANON_KEY` (veja o console) |
| "Chat não configurado" | mesmas variáveis, mas o build não foi refeito depois de definir |
| 401 na função | `apikey`/`authorization` ausentes, ou anon key de outro projeto |
| 403 "Origem não autorizada" | domínio fora de `ALLOWED_ORIGINS` |
| 500 sempre | `GEMINI_API_KEY` não setada nos secrets |
| 429 com mensagem de limite | cota diária do Gemini esgotada em todos os modelos da cadeia |
| Resumo nunca chega | conversa vaga demais; o modelo só marca `proposal_ready` com tipo e descrição definidos |
| Faixa não aparece | confiança baixa ou categoria sem preço em `PRICING` |
| Mudei a config e nada mudou | faltou `bun run edge:sync` + redeploy |
