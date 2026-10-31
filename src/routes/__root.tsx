import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "~/styles/app.css?url";

const SITE_URL = "https://freshfacespasd.com";
const SHARE_IMAGE = `${SITE_URL}/og-image.jpg`;
const SHARE_TITLE = "Fresh Face Spa — Mission Valley, San Diego";
const SHARE_DESCRIPTION =
  "Corrective, results-driven skincare wrapped in slow, calming rituals. Book your visit — open every day 10am–7pm.";

// Business details must match what the page shows. Chula Vista has no listed
// hours of day on the site, so only the address is given for it.
const BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "DaySpa",
      "@id": `${SITE_URL}/#mission-valley`,
      name: "Fresh Face Spa",
      url: `${SITE_URL}/`,
      image: SHARE_IMAGE,
      description:
        "Boutique esthetician studio in Mission Valley, San Diego. Corrective, results-driven facials and fascia facial massage with Raquel Cartlidge.",
      telephone: "+1-619-755-9045",
      founder: { "@type": "Person", name: "Raquel Cartlidge" },
      address: {
        "@type": "PostalAddress",
        streetAddress: "1640 Camino Del Rio N, Ste 206, Rm 116",
        addressLocality: "San Diego",
        addressRegion: "CA",
        postalCode: "92108",
        addressCountry: "US",
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "10:00",
          closes: "19:00",
        },
      ],
      sameAs: [
        "https://www.instagram.com/freshfacespasd/",
        "https://www.facebook.com/profile.php?id=61587966540511",
        "https://www.tiktok.com/@freshfacespasd",
      ],
    },
    {
      "@type": "DaySpa",
      "@id": `${SITE_URL}/#chula-vista`,
      name: "Fresh Face Spa, Chula Vista",
      url: `${SITE_URL}/`,
      image: SHARE_IMAGE,
      description:
        "Second Fresh Face Spa location, inside Sola Salon Studios in Chula Vista. Open Sundays and Mondays.",
      branchOf: { "@id": `${SITE_URL}/#mission-valley` },
      address: {
        "@type": "PostalAddress",
        streetAddress: "940 Eastlake Parkway, Suite 16",
        addressLocality: "Chula Vista",
        addressRegion: "CA",
        postalCode: "91914",
        addressCountry: "US",
      },
    },
  ],
};

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
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:site_name", content: "Fresh Face Spa" },
      { property: "og:locale", content: "en_US" },
      { property: "og:image", content: SHARE_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: "The Fresh Face Spa treatment room with the studio sign and arched mirror",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SHARE_TITLE },
      { name: "twitter:description", content: SHARE_DESCRIPTION },
      { name: "twitter:image", content: SHARE_IMAGE },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: `${SITE_URL}/` },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(BUSINESS_SCHEMA),
      },
    ],
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
