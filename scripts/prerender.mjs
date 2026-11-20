// Static pre-render for GitHub Pages.
//
// Runs AFTER `vite build` (with VITE_BASE set to the site's base path). It
// reuses the site's own TanStack Start SSR handler (dist/server/server.js) to
// render every public route to real HTML, then writes the results into
// dist/client so the whole folder is a deployable static site:
//
//   /                        -> dist/client/index.html
//   /teen-facial             -> dist/client/teen-facial/index.html
//   /male-facial             -> dist/client/male-facial/index.html
//   /oxygen-glow-facial      -> dist/client/oxygen-glow-facial/index.html
//   /gift-certificates       -> dist/client/gift-certificates/index.html
//
// GitHub Pages serves `<dir>/index.html` for `/dir/`, so each page is crawlable
// at its own URL. Keep ROUTES in sync with src/routes and public/sitemap.xml.
//
// Usage:  node scripts/prerender.mjs
// Env:    PRERENDER_URL  (default "http://localhost/fresh-face-spa/")

import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const ROUTES = [
  "/",
  "/teen-facial",
  "/male-facial",
  "/oxygen-glow-facial",
  "/gift-certificates",
];

const mod = await import(join(root, "dist/server/server.js"));
// dist/server/server.js exports its fetch-capable handler as the default export
// ({ server as default }); createServerEntry is also available as a named export.
const server = mod.default ?? mod.server;

// Trailing slash matters: new URL("teen-facial", "http://localhost/") resolves
// to http://localhost/teen-facial, and on a subpath build
// ("http://localhost/fresh-face-spa/") it resolves under that subpath too.
const baseUrl = process.env.PRERENDER_URL || "http://localhost/fresh-face-spa/";
const origin = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

let failures = 0;

for (const route of ROUTES) {
  const url = new URL(route.replace(/^\//, ""), origin).href;
  const res = await server.fetch(
    new Request(url, { headers: { host: "localhost", accept: "text/html" } }),
  );
  const html = await res.text();

  if (!res.ok) {
    throw new Error(`Pre-render of ${route} failed with status ${res.status}`);
  }
  // A 200 is not enough: the router's not-found page also returns 200.
  if (html.includes("Page not found") || !html.includes("<h1")) {
    failures += 1;
    console.error(`[prerender] ${route} rendered without a heading — check the route`);
    continue;
  }

  const outPath =
    route === "/"
      ? join(root, "dist/client/index.html")
      : join(root, "dist/client", route.replace(/^\//, ""), "index.html");

  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, html);
  console.log(`[prerender] ${route} -> ${outPath} (${res.status}, ${html.length} bytes)`);
}

if (failures > 0) {
  throw new Error(`Pre-render failed for ${failures} route(s)`);
}
console.log(`[prerender] ${ROUTES.length} pages written`);
