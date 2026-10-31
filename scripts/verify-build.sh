#!/usr/bin/env bash
# Fails if a build would publish a broken or disconnected site.
# Usage: scripts/verify-build.sh <build-log> [dist-dir]
set -u
log="${1:-build.log}"
out="${2:-dist/client}"
fail=0

err() { echo "::error::$1"; fail=1; }

[ -s "$out/index.html" ] || err "index.html is missing or empty"

# Every deploy replaces the whole gh-pages branch, so a missing CNAME would
# disconnect freshfacespasd.com from the site.
grep -qx "freshfacespasd.com" "$out/CNAME" 2>/dev/null \
  || err "CNAME is missing or wrong; the live domain would be disconnected"

for f in robots.txt sitemap.xml og-image.jpg; do
  [ -s "$out/$f" ] || err "$f is missing from the build"
done

if grep -q '^MISSING:' "$log" 2>/dev/null; then
  err "gallery images are referenced but missing from the build:"
  grep '^MISSING:' "$log"
fi

[ "$fail" -eq 0 ] && echo "Build looks deployable."
exit "$fail"
