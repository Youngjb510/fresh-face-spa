# GitHub Pages hosting for Fresh Face Spa

The public site (formerly served on the sandbox's port 3000) can also run for
free on **GitHub Pages**, a static host. Since GitHub Pages only serves static
files, this project is built into a static, pre-rendered bundle and deployed to
the `gh-pages` branch by a GitHub Actions workflow.

> The sandbox's live server on **port 3000** is unchanged and still works — it
> serves the site from the source (TanStack Start SSR) at `/`. GitHub Pages is an
> independent, static copy that lives under the project base path
> `/fresh-face-spa/`.

## How the static build works

The site is a TanStack Start (React + Vite) app. The whole page is
`src/routes/index.tsx` — pure static content plus a client-side chat widget and
the external Yocale booking link (no server functions, no database). So it can
be pre-rendered into a static site.

`scripts/build-gh-pages.sh` does two things:

1. Runs `vite build` with `VITE_BASE=/fresh-face-spa/` so every emitted asset
   URL (JS/CSS) and every gallery/section image is prefixed with the GitHub
   Pages project path. Without this, images and assets would 404 under
   `/fresh-face-spa/`.
2. Runs `scripts/prerender.mjs`, which re-uses the project's own SSR handler
   (`dist/server/server.js`) to render the `/` route to a static
   `dist/client/index.html`.

The deployable folder is **`dist/client`** — it contains `index.html`, hashed
`assets/`, and `gallery/` (all 43 JPGs).

### Base-path awareness in source

- All gallery image references in `src/routes/index.tsx` go through a helper
  `g()` that prepends `import.meta.env.BASE_URL`. For the GitHub Pages build
  that resolves to `/fresh-face-spa/gallery/...`; for the SSR/live build (base
  `/`) it resolves to `/gallery/...` just as before.
- The router basepath (`src/router.tsx`) is set to `import.meta.env.BASE_URL`
  so client-side routing matches under `/fresh-face-spa/`.
- `vite.config.ts` reads `VITE_BASE` (defaults to `/`) to control Vite's `base`.

The default `bun run build` (no `VITE_BASE`) still produces the SSR build used
by the live server on port 3000 — nothing there changes.

## How the deploy pipeline works

`.github/workflows/deploy.yml` triggers on pushes to `master` (and manually via
Actions). It:

1. Checks out the repo and installs dependencies (Bun).
2. Runs `bash ./scripts/build-gh-pages.sh` to produce `dist/client`.
3. Deploys `dist/client` to the `gh-pages` branch using
   `peaceiris/actions-gh-pages` with the standard `GITHUB_TOKEN`.

No custom secrets are required; the repo's Actions `GITHUB_TOKEN` already has
write permission to push the `gh-pages` branch (it is set by the repo owner).

## One-time setup: enable Pages

1. In the repo go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose either:
   - **Deploy from a branch**, set the branch to `gh-pages` and folder to
     `/ (root)` — the workflow already pushes to `gh-pages`, so this works out
     of the box; or
   - **GitHub Actions** — the workflow's deploy step publishes the artifact.
3. The site will be served at:
   `https://<username>.github.io/fresh-face-spa/`
   (for this repo: `https://youngjb510.github.io/fresh-face-spa/`).

Because project pages are served under `/fresh-face-spa/`, the site must use the
base path everywhere — which is exactly what the build script configures.

## After a source change

Just push to `master` and merge — the workflow rebuilds and redeploys
automatically. To run the static build locally and inspect the output:

```bash
bash ./scripts/build-gh-pages.sh   # writes dist/client/
```

Then serve `dist/client` under `/fresh-face-spa/` to preview (e.g. put it in a
`/fresh-face-spa/` folder and serve its parent), or simply open
`dist/client/index.html` and confirm every `/fresh-face-spa/...` asset resolves.
