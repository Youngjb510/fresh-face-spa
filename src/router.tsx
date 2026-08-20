import { createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    routeTree,
    // Matches Vite's `base` so the router resolves routes correctly when the
    // statically-built site is served from a subpath (e.g. `/fresh-face-spa/`).
    // For the SSR/live site this is "/", keeping existing behavior unchanged.
    basepath: import.meta.env.BASE_URL,
    defaultPreload: "intent",
    scrollRestoration: true,
    defaultNotFoundComponent: () => <p>Not found</p>,
  });
}
