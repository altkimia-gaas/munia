# MunIA — Landing Page

Landing page y diagnóstico de cumplimiento normativo para MunIA, plataforma de atención ciudadana con IA para municipalidades chilenas.

**Firebase project:** `civora-mvp` | **Hosting site:** `munia-page`

---

## Stack

- **Astro 4** — SSR con `@astrojs/node` (modo middleware)
- **Tailwind CSS 3** — usado en `DiagnosticoLeadForm.astro`
- **Firebase Hosting** — sirve los assets estáticos (`functions/dist/client/`)
- **Firebase Cloud Functions v2** — corre el servidor Astro SSR (función `munia`)
- **Google Apps Script Web App** — recibe los leads del diagnóstico y los guarda en Google Sheets

## Estructura

```
src/
  pages/
    index.astro                    # Landing principal
    diagnostico-cumplimiento.astro # Diagnóstico de 12 preguntas (3 leyes)
    api/
      lead.ts                      # POST endpoint — guarda lead en Sheets vía Apps Script
    legal/
      privacidad.astro
      sgsi.astro
  components/
    DiagnosticoLeadForm.astro      # Formulario de datos + consentimiento (paso 4 del diagnóstico)
    Nav.astro
functions/
  index.js                         # Cloud Function que envuelve el handler SSR de Astro
  package.json                     # Dependencias de la función (express, firebase-functions)
  dist/                            # Output del build (generado — no commitear)
```

## Variables de entorno

Crear `.env` en la raíz:

```env
# Google Apps Script Web App — recibe los leads del diagnóstico y los guarda en Sheets
# Cómo obtenerla: Script → Implementar → Nueva implementación → Tipo: Aplicación web
# Ejecutar como: Tú | Quién tiene acceso: Cualquiera
APPS_SCRIPT_URL=
```

## Desarrollo local

```bash
# Instalar dependencias del proyecto
npm install

# Levantar servidor de desarrollo SSR
npm run dev
```

El servidor corre en `http://localhost:4321`.

## Deploy

```bash
# 1. Instalar dependencias de la función (solo la primera vez o al agregar paquetes)
cd functions && npm install && cd ..

# 2. Build — genera functions/dist/
npm run build

# 3. Deploy completo
firebase deploy
```

O por separado:

```bash
firebase deploy --only hosting
firebase deploy --only functions
```

## Flujo del diagnóstico

```
index.astro
  → /diagnostico-cumplimiento
      → Ley 21.180 (4 preguntas)
      → Ley 21.719 (4 preguntas)
      → Ley 21.663 (4 preguntas)
      → DiagnosticoLeadForm (nombre, email, cargo, municipio + consentimiento)
          → POST /api/lead
              → Apps Script → Google Sheets
          → Resultados con score por ley y brechas detalladas
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

Apps Script responde al POST con un redirect 302. Clientes HTTP que siguen redirects automáticamente (curl con `-L`, `fetch` de Node.js) convierten el POST en GET al seguir la redirección, recibiendo un 405 Method Not Allowed.

En la práctica no afecta: el script ejecuta el `doPost` y guarda el dato en Sheets **antes** de redirigir. El servidor ignora la respuesta del redirect y devuelve `{ ok: true }` al cliente sin problema.

**Fix pendiente:** reemplazar Apps Script por integración directa con la [Google Sheets API v4](https://developers.google.com/sheets/api) usando una cuenta de servicio. Esto elimina el redirect, da respuesta limpia y permite detectar errores reales de escritura.
