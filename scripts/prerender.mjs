// Static pre-render for GitHub Pages.
//
// Runs AFTER `vite build` (with VITE_BASE set to the project base path). It
// reuses the site's own TanStack Start SSR handler (dist/server/server.js) to
// render the "/" route to a static index.html, then writes it into
// dist/client so the whole `dist/client` folder is a deployable static site.
//
// Usage:  node scripts/prerender.mjs
// Env:    PRERENDER_URL  (default "http://localhost/fresh-face-spa/")

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const mod = await import(join(root, "dist/server/server.js"));
// dist/server/server.js exports its fetch-capable handler as the default export
// ({ server as default }); createServerEntry is also available as a named export.
const server = mod.default ?? mod.server;

const url = process.env.PRERENDER_URL || "http://localhost/fresh-face-spa/";
const res = await server.fetch(
  new Request(url, { headers: { host: "localhost", accept: "text/html" } }),
);

const html = await res.text();
if (!res.ok) {
  throw new Error(`Pre-render failed with status ${res.status}`);
}

const outPath = join(root, "dist/client/index.html");
await writeFile(outPath, html);
console.log(`[prerender] wrote ${outPath} (${res.status}, ${html.length} bytes)`);
