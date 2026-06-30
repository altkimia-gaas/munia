import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async ({ url, cookies, redirect }, next) => {
  if (url.pathname.startsWith('/decks/')) {
    const session = cookies.get('deck_session');
    const secret  = import.meta.env.DECK_SESSION_SECRET;
    if (!session || !secret || session.value !== secret) {
      return redirect('/?deck_unauthorized=1', 302);
    }
  }
  return next();
});
