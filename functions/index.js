import { onRequest } from 'firebase-functions/v2/https';
import express from 'express';
import { handler as ssrHandler } from './dist/server/entry.mjs';

const app = express();

// Static assets are served by Firebase Hosting directly.
// This function only handles SSR requests.
app.use(ssrHandler);

export const munia = onRequest({ region: 'us-central1' }, app);
