import { createFileRoute } from "@tanstack/react-router";

import { SiteShell } from "~/components/chrome";
import {
  IncludedCard,
  TreatmentPage,
  TreatmentSection,
} from "~/components/treatment-page";
import { pageHead } from "~/lib/seo";
import { TREATMENTS } from "~/lib/site";

const T = TREATMENTS.find((t) => t.path === "/hydra-glow-facial")!;

export const Route = createFileRoute("/hydra-glow-facial")({
  head: () =>
    pageHead({
      title: "Hydra Glow Facial — $175, 70 min | Fresh Face Spa, San Diego",
      description:
        "Our advanced hydro-dermabrasion facial in San Diego — $175, 70 minutes. A deep cleanse that can even skin tone, help treat acne and reduce the appearance of enlarged pores and fine lines, with RF skin tightening, LED light and SPF.",
      path: "/hydra-glow-facial",
      image: T.image,
      imageAlt: "Fresh Face Spa studio detail",
    }),
  component: HydraGlowFacialPage,
});

function HydraGlowFacialPage() {
  return (
    <SiteShell>
      <TreatmentPage
        current="/hydra-glow-facial"
        eyebrow="Hydra Glow Facial"
        h1="Hydra Glow Facial"
        lede="Experience the ultimate deep cleanse and instant glow with our advanced hydro-dermabrasion treatment."
        image={T.image}
        imageAlt="Fresh Face Spa studio detail"
        priceLine={T.priceLine}
        intro={[
          "This treatment can even skin tone, help treat acne, and reduce the appearance of enlarged pores and fine lines.",
        ]}
        included={[
          "Double cleanse",
          "Exfoliation (enzyme mask)",
          "Extraction/steam",
          "RF skin tightening",
          "Facial massage (hand & shoulder)",
          "Mask",
          "LED light",
          "Serum, moisturizer, SPF",
        ]}
        bookHeading="Book a hydra glow facial"
      >
        <TreatmentSection tone="ivory" eyebrow="Add-ons" heading="Make it a little more">
          <div className="grid gap-5 sm:grid-cols-2">
            <IncludedCard
              title="Add to the hydra glow facial"
              items={["Dermaplaning $25"]}
            />
          </div>
        </TreatmentSection>
      </TreatmentPage>
    </SiteShell>
  );
}
