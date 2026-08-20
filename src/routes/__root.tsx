import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "~/styles/app.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title: "Fresh Face Spa — Boutique Esthetician Studio in Mission Valley, San Diego",
      },
      {
        name: "description",
        content:
          "Fresh Face Spa is a boutique esthetician studio in Mission Valley, San Diego. Corrective and relaxing skincare with owner Raquel Cartlidge — acne, pigmentation, sensitivity, age management, and fascia facial massage. Open every day 10am–7pm.",
      },
      { name: "theme-color", content: "#fbf8f3" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Fresh Face Spa — Mission Valley, San Diego" },
      {
        property: "og:description",
        content:
          "Corrective, results-driven skincare wrapped in slow, calming rituals. Book your visit — open every day 10am–7pm.",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  notFoundComponent: () => <div>Page not found</div>,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
