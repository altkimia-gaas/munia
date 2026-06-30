import type { APIRoute } from 'astro';

export const prerender = false;

const REQUIRED_FIELDS = ['nombre', 'email', 'cargo', 'municipio'] as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request }) => {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return json({ error: 'Payload inválido' }, 400);
  }

  if (data.website) return json({ ok: true }, 200);

  for (const field of REQUIRED_FIELDS) {
    if (typeof data[field] !== 'string' || !(data[field] as string).trim()) {
      return json({ error: `Campo requerido: ${field}` }, 400);
    }
  }
  if (!EMAIL_RE.test((data.email as string).trim())) {
    return json({ error: 'Email inválido' }, 400);
  }

  const scriptUrl = import.meta.env.APPS_SCRIPT_URL;
  if (scriptUrl) {
    try {
      await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(data),
      });
    } catch {
      // Best-effort: no bloqueamos al usuario si Sheets falla
    }
  }

  return json({ ok: true }, 200);
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
