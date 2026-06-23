# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Static landing page for **MunIA** — a municipal AI platform for Chilean municipalities. No build step, no bundler, no npm. Files in `public/` are deployed directly to Firebase Hosting.

**Firebase project:** `civora-mvp` | **Hosting site:** `munia-page`

## Structure

```
public/
  index.html          # Main landing page (self-contained HTML + inline CSS + inline JS)
  legal/
    privacidad.html   # Privacy policy
    sgsi.html         # SGSI (Information Security Management System policy)
```

All CSS and JS live inline inside each HTML file. No external local assets — only Google Fonts and inline SVGs.

## Deploy

```bash
firebase deploy --only hosting:munia-page
```

Firebase Hosting rewrites all routes to `/index.html` (configured in `firebase.json`).

## Design system (index.html)

CSS custom properties defined in `:root`:

- Colors: `--blue`, `--blue-dark`, `--blue-xdark`, `--blue-light`, `--blue-pale` — primary palette
- Dark bg: `--bg1` (#080B12), `--bg2`, `--bg3` — hero/dark sections
- Light bg: `--paper`, `--paper2` — content sections
- Text: `--text`, `--muted`, `--ink`, `--muted-ink`
- Borders: `--border` (dark), `--border-light` (light sections)

Hero and nav use dark bg (`--bg1`). Content sections below the hero switch to light (`--paper`).

## Rules

- Never build after making changes.
- Never add a build step — this is intentionally a zero-toolchain project.
