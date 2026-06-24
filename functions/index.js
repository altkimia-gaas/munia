import { onRequest } from 'firebase-functions/v2/https';

let app;

async function getApp() {
  if (app) return app;
  const [{ default: express }, { handler }] = await Promise.all([
    import('express'),
    import('./dist/server/entry.mjs'),
  ]);
  app = express();
  app.use(handler);
  return app;
}

export const munia = onRequest({ region: 'us-central1' }, async (req, res) => {
  const expressApp = await getApp();
  expressApp(req, res);
});
