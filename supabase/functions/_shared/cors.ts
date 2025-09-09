const ALLOWED = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export function corsHeaders(origin: string | null): Record<string, string> {
  const allowAll = ALLOWED.length === 0;
  const allowed = allowAll
    ? "*"
    : origin && ALLOWED.includes(origin)
      ? origin
      : ALLOWED[0];

  return {
    "access-control-allow-origin": allowed,
    "access-control-allow-headers":
      "authorization, x-client-info, apikey, content-type",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-max-age": "86400",
    vary: "origin",
  };
}

export function isOriginAllowed(origin: string | null): boolean {
  if (ALLOWED.length === 0) return true;
  if (!origin) return true;
  return ALLOWED.includes(origin);
}

export function json(
  body: unknown,
  origin: string | null,
  status = 200,
  extraHeaders: Record<string, string> = {}
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...corsHeaders(origin),
      ...extraHeaders,
    },
  });
}
