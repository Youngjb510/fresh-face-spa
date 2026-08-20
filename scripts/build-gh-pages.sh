#!/usr/bin/env bash
# Build a static, pre-rendered bundle for GitHub Pages and place it in dist/client.
#
# The site is normally a TanStack Start SSR app served at "/". GitHub Pages is a
# pure static host, so this script:
#   1. Builds with VITE_BASE=/fresh-face-spa/ so every emitted asset URL and all
#      gallery/image references get the project base path prefix.
#   2. Pre-renders the single "/" route to dist/client/index.html using the
#      project's own SSR handler.
#
# The resulting dist/client folder is the deployable site (serves the full home
# page rendered, all sections, the chat widget, and all 43+ gallery images from
# /fresh-face-spa/gallery/).
set -euo pipefail
cd "$(dirname "$0")/.."

VITE_BASE="/fresh-face-spa/" bun run build
node scripts/prerender.mjs
echo "[build-gh-pages] static site ready in dist/client/"

# Sanity checks: every referenced gallery image must exist in the output.
missing=0
for f in $(grep -o '/fresh-face-spa/gallery/[^"'"'"']*\.jpg' dist/client/index.html | sort -u); do
  rel="${f#/fresh-face-spa/}"
  if [ ! -f "dist/client/$rel" ]; then
    echo "MISSING: $rel"
    missing=1
  fi
done
[ "$missing" -eq 0 ] && echo "[build-gh-pages] all gallery images referenced in index.html exist in dist/client/gallery"
exit 0
