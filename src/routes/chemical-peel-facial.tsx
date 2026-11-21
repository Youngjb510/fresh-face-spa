import { createFileRoute } from "@tanstack/react-router";

import { SiteShell } from "~/components/chrome";
import { TreatmentPage } from "~/components/treatment-page";
import { pageHead } from "~/lib/seo";
import { TREATMENTS } from "~/lib/site";

const T = TREATMENTS.find((t) => t.path === "/chemical-peel-facial")!;

export const Route = createFileRoute("/chemical-peel-facial")({
  head: () =>
    pageHead({
      title:
        "Chemical Peel with Facial — $175, 70 min | Fresh Face Spa, San Diego",
      description:
        "A 70-minute chemical peel with facial in San Diego — $175. Double cleanse, light exfoliation, extraction if needed, facial massage and a Jessner peel by Circadia, tailored to your skin goals.",
      path: "/chemical-peel-facial",
      image: T.image,
      imageAlt: "Fresh Face Spa studio detail",
    }),
  component: ChemicalPeelFacialPage,
});

function ChemicalPeelFacialPage() {
  return (
    <SiteShell>
      <TreatmentPage
        current="/chemical-peel-facial"
        eyebrow="Chemical Peel with Facial"
        h1="Chemical Peel with Facial"
        lede="Combine the ultimate relaxation with clinical grade resurfacing."
        image={T.image}
        imageAlt="Fresh Face Spa studio detail"
        priceLine={T.priceLine}
        intro={[
          "This targeted treatment pairs the restorative steps of a classic facial — deep cleansing, gentle extraction — with an advanced chemical peel tailored to your specific skin goals.",
        ]}
        idealFor="Anti-aging, sun damaged, hyperpigmentation or breakout prone skin."
        included={[
          "Double cleanse",
          "Light exfoliation",
          "Extraction (if needed)",
          "Facial massage (hand & shoulder)",
          "Chemical peel (Jessner by Circadia)",
        ]}
        bookHeading="Book a chemical peel with facial"
      />
    </SiteShell>
  );
}
