#!/usr/bin/env bash
# Build a static, pre-rendered bundle for GitHub Pages and place it in dist/client.
#
# The site is normally a TanStack Start SSR app served at "/". GitHub Pages is a
# pure static host, so this script:
#   1. Builds with VITE_BASE=/ so every emitted asset URL and all gallery/image
#      references resolve from the domain root.
#   2. Pre-renders the single "/" route to dist/client/index.html using the
#      project's own SSR handler.
#
# VITE_BASE was "/fresh-face-spa/" while the site lived at
# youngjb510.github.io/fresh-face-spa/ (a GitHub *project* page). Once
# freshfacespasd.com was connected as a custom domain, the site serves from the
# domain root instead, and every asset URL carrying that prefix 404'd — CSS,
# JS and all gallery images. Root and project-page hosting need different base
# paths; there is no single value that is correct for both, so this must be
# revisited if the site is ever moved back to a project-page URL.
#
# The resulting dist/client folder is the deployable site (serves the full home
# page rendered, all sections, the chat widget, and all 43+ gallery images from
# /gallery/).
set -euo pipefail
cd "$(dirname "$0")/.."

VITE_BASE="/" bun run build
# prerender.mjs defaults to requesting /fresh-face-spa/ from the built SSR
# server — the other half of the same stale base path. With VITE_BASE="/" the
# server only serves "/", so the old default 307-redirects instead of
# rendering and the build fails before it reaches the missing-image checks.
PRERENDER_URL="http://localhost/" node scripts/prerender.mjs
echo "[build-gh-pages] static site ready in dist/client/"

# Sanity checks: every referenced gallery image must exist in the output.
missing=0
for f in $(grep -o '/gallery/[^"'"'"']*\.jpg' dist/client/index.html | sort -u); do
  rel="${f#/}"
  if [ ! -f "dist/client/$rel" ]; then
    echo "MISSING: $rel"
    missing=1
  fi
done
[ "$missing" -eq 0 ] && echo "[build-gh-pages] all gallery images referenced in index.html exist in dist/client/gallery"
exit 0
