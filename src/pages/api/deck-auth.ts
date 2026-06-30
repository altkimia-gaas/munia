import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  let body: { user?: string; pass?: string };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false }, 400);
  }

  const validUser = import.meta.env.DECK_USER;
  const validPass = import.meta.env.DECK_PASS;
  const secret    = import.meta.env.DECK_SESSION_SECRET;

  if (!validUser || !validPass || !secret) {
    return json({ ok: false }, 500);
  }

  if (
    body.user?.trim().toLowerCase() === validUser.toLowerCase() &&
    body.pass === validPass
  ) {
    cookies.set('deck_session', secret, {
      httpOnly: true,
      secure:   true,
      sameSite: 'strict',
      path:     '/',
      maxAge:   8 * 60 * 60,
    });
    return json({ ok: true }, 200);
  }

  return json({ ok: false }, 401);
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
