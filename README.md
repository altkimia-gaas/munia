# MunIA — Landing Page

Landing page y diagnóstico de cumplimiento normativo para MunIA, plataforma de atención ciudadana con IA para municipalidades chilenas.

---

## Stack

- **Astro 4** — modo `hybrid` (páginas estáticas + endpoint serverless)
- **Tailwind CSS 3**
- **Vercel** — deploy + Serverless Functions
- **Google Apps Script Web App** — recibe los leads y los guarda en Google Sheets

## Estructura

```
src/
  pages/
    index.astro                    # Landing principal
    diagnostico-cumplimiento.astro # Diagnóstico de 12 preguntas (3 leyes) — todo client-side
    api/
      lead.ts                      # POST endpoint serverless — valida + guarda lead en Sheets
    legal/
      privacidad.astro
      sgsi.astro
  components/
    DiagnosticoLeadForm.astro      # Formulario + consentimiento + fetch a /api/lead
    Nav.astro
```

## Variables de entorno

Crear `.env` en la raíz para desarrollo local:

```env
# URL del Google Apps Script Web App que guarda leads en Google Sheets
# Cómo obtenerla: en el script → Implementar → Nueva implementación → Tipo: Aplicación web
# Ejecutar como: Tú | Quién tiene acceso: Cualquiera
APPS_SCRIPT_URL=
```

En producción, configurar `APPS_SCRIPT_URL` en Vercel Dashboard → Project → Settings → Environment Variables.

## Desarrollo local

```bash
npm install
npm run dev     # http://localhost:4321
npm run preview # Emula el entorno serverless de Vercel localmente
```

## Deploy

Vercel detecta Astro automáticamente. El proceso es:

1. Conectar este repo en [vercel.com](https://vercel.com)
2. Configurar `APPS_SCRIPT_URL` en las variables de entorno del proyecto
3. Cada push a la rama conectada dispara un deploy automático

No hay comandos de deploy manual.

## Flujo del diagnóstico

```
index.astro
  → /diagnostico-cumplimiento   (12 preguntas, score calculado en el navegador)
      → DiagnosticoLeadForm (nombre, email, cargo, municipio + consentimiento)
          → POST /api/lead
              → Valida payload (honeypot + campos + email)
              → Reenvía a Apps Script → Google Sheets
          → Muestra resultados (score por ley + brechas)
```

## Google Sheets — estructura esperada

Encabezados en la fila 1 (columnas A–V):

```
timestamp | nombre | email | cargo | municipio | consentimiento | scoreGlobal | score21180 | score21719 | score21663 | r1 | r2 | r3 | r4 | r5 | r6 | r7 | r8 | r9 | r10 | r11 | r12
```

---

## ⚠️ Warnings

### Apps Script devuelve 405 al seguir el redirect

**Estado:** conocido, no bloqueante.

Apps Script responde al POST con un redirect 302. `fetch` de Node.js sigue el redirect y convierte el POST en GET, recibiendo un 405. En la práctica no afecta: el script ejecuta `doPost` y guarda el dato **antes** de redirigir. El endpoint ignora la respuesta y devuelve `{ ok: true }`.

**Fix pendiente:** reemplazar Apps Script por la [Google Sheets API v4](https://developers.google.com/sheets/api) con cuenta de servicio. Elimina el redirect y permite detectar errores reales de escritura.
