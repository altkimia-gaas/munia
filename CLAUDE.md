# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Landing page + diagnóstico de cumplimiento normativo para **MunIA**, plataforma de atención ciudadana con IA para municipalidades chilenas.

Sitio Astro en modo `hybrid`: las páginas se pre-renderizan estáticamente en build, y el único endpoint dinámico (`/api/lead`) corre como Vercel Serverless Function.

## Arquitectura

- **Astro 4** (`output: 'hybrid'`, adaptador `@astrojs/vercel/serverless`). Las páginas `.astro` son estáticas; solo `src/pages/api/lead.ts` es server-side.
- **`/api/lead` (POST)**: valida el payload (honeypot + campos + email), y reenvía a un Google Apps Script cuya URL es variable de entorno servidor (`APPS_SCRIPT_URL`), nunca en el navegador.
- El formulario (`DiagnosticoLeadForm.astro`) llama directamente a `/api/lead` con `fetch` — sin SDKs de terceros, sin App Check, sin Firebase.

## Rules

- **Nunca buildear** después de hacer cambios — solo editar código.
- Responder en el idioma del usuario.

## Deploy

**Solo Pablo puede hacer el deploy.** El proyecto está vinculado a su cuenta personal de Vercel (`zabrosos-projects`). No hay integración Git automática — el deploy se hace manualmente con la CLI.

```bash
# Dev local
npm run dev

# Preview local con función serverless emulada
npm run preview

# Deploy a producción (solo desde la cuenta zabrosos-projects)
vercel --prod
```

Para deploys posteriores basta con `vercel --prod`. Si hay que configurar variables de entorno: `vercel env add APPS_SCRIPT_URL`.

## Variables de entorno

| Variable | Dónde configurar | Descripción |
|---|---|---|
| `APPS_SCRIPT_URL` | Vercel Dashboard → Settings → Environment Variables | URL del Google Apps Script que guarda leads en Sheets |

En dev local: crear `.env` con `APPS_SCRIPT_URL=<url>`.

## Estructura

```
src/
  pages/
    index.astro                    # Landing principal (pre-renderizado)
    diagnostico-cumplimiento.astro # Diagnóstico de 12 preguntas (pre-renderizado)
    api/
      lead.ts                      # POST — valida + guarda lead (Serverless Function)
    legal/
      privacidad.astro
      sgsi.astro
  components/
    DiagnosticoLeadForm.astro      # Formulario + validación + fetch a /api/lead
    Nav.astro
```

## Gotchas

- **`output: 'hybrid'`**: las páginas `.astro` son estáticas por defecto. `lead.ts` tiene `export const prerender = false` explícito para que sea serverless.
- **Apps Script devuelve 405** al seguir el redirect 302 del POST. No es bloqueante: el script guarda el dato antes de redirigir. El endpoint ignora la respuesta y devuelve `{ ok: true }`.
- **`APPS_SCRIPT_URL` nunca va al navegador** — es server-side. Sin `PUBLIC_` prefix.
