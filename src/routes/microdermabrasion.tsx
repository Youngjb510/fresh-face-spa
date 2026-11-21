import { createFileRoute } from "@tanstack/react-router";

import { SiteShell } from "~/components/chrome";
import { TreatmentPage } from "~/components/treatment-page";
import { pageHead } from "~/lib/seo";
import { TREATMENTS } from "~/lib/site";

const T = TREATMENTS.find((t) => t.path === "/microdermabrasion")!;

export const Route = createFileRoute("/microdermabrasion")({
  head: () =>
    pageHead({
      title: "Microdermabrasion — $135, 60 min | Fresh Face Spa, San Diego",
      description:
        "A 60-minute microdermabrasion treatment in San Diego — $135. Double cleanse, exfoliation, light extraction and steam, mask, facial massage, LED light and SPF for a softer, brighter, more refined skin surface.",
      path: "/microdermabrasion",
      image: T.image,
      imageAlt: "Fresh Face Spa studio detail",
    }),
  component: MicrodermabrasionPage,
});

function MicrodermabrasionPage() {
  return (
    <SiteShell>
      <TreatmentPage
        current="/microdermabrasion"
        eyebrow="Microdermabrasion"
        h1="Microdermabrasion"
        lede="Refresh and polish your skin with this advanced physical exfoliation treatment."
        image={T.image}
        imageAlt="Fresh Face Spa studio detail"
        priceLine={T.priceLine}
        intro={[
          "It sweeps away dull, dead skin cells and clears clogged pores to instantly reveal a softer, brighter and more refined skin surface.",
        ]}
        included={[
          "Double cleanse",
          "Exfoliation",
          "Light extraction/steam",
          "Mask",
          "Facial massage (hand & shoulder)",
          "LED light",
          "Serum, moisturizer, SPF",
        ]}
        bookHeading="Book a microdermabrasion treatment"
      />
    </SiteShell>
  );
}
