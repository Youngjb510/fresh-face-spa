# Fresh Face Spa — Self-hosting guide

> **Running for free on GitHub Pages?** See **GITHUB_PAGES.md** — the site is
> pre-rendered to a static bundle and deployed to the `gh-pages` branch by a
> GitHub Actions workflow. The rest of this file covers hosting the SSR app
> yourself (Vercel, Netlify, your own Node/Bun server).

This is the full source for the Fresh Face Spa website. It is a **TanStack Start
(React + Vite) app** — not a single static HTML file — so it must be built before
serving. The following explains how to run it on your own infrastructure
(anywhere you normally deploy a Node/Bun app: Vercel, Netlify, Railway, Render,
Fly.io, or a plain Linux server).

## What's in here

- `src/` — the React app (the entire site is `src/routes/index.tsx`; styles in
  `src/styles/app.css`)
- `public/gallery/` — all studio photo assets
- `package.json`, `vite.config.ts`, `tsconfig.json` — build configuration
- `serve.ts` / `publish.sh` — local production server + publish script
- `build-vercel.sh` / `vercel-entry.ts` — Vercel build entry

## Quick start (local / generic Node server)

Requires Bun (or Node 20+). From this directory:

```bash
bun install
bun run build          # builds dist/ (SSR server + static client assets)
bun run start          # serves on port 3000
```

Or with Node/npm:

```bash
npm install
npm run build
npm run start
```

## Deploy to Vercel (easiest)

1. Create a new Vercel project and import this directory.
2. Keep the default framework preset (Vite).
3. The build command is `bun run build` (or `npm run build`).
4. For the serverless SSR entry, Vercel uses `build-vercel.sh` /
   `vercel-entry.ts` (the `vercel-entry.ts` file is the function entry).

## Environment / config notes

- No database or secret keys are required — the site is fully static content
  plus a client-side chat widget.
- The only external link is the **Yocale booking widget**:
  `https://www.yocale.com/widget/fresh-face-spa` (defined as `YOCALE_URL` at the
  top of `src/routes/index.tsx`). Update it if your Yocale account changes.
- Social/contact details (addresses, phone, Instagram link) live in
  `src/routes/index.tsx` — edit there and rebuild.
