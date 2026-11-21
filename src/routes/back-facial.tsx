import { createFileRoute } from "@tanstack/react-router";

import { SiteShell } from "~/components/chrome";
import {
  IncludedCard,
  TreatmentPage,
  TreatmentSection,
} from "~/components/treatment-page";
import { pageHead } from "~/lib/seo";
import { TREATMENTS } from "~/lib/site";

const T = TREATMENTS.find((t) => t.path === "/back-facial")!;

export const Route = createFileRoute("/back-facial")({
  head: () =>
    pageHead({
      title: "Back Facial — $80, 60 min | Fresh Face Spa, San Diego",
      description:
        "A 60-minute back facial at Fresh Face Spa in San Diego — $80. Double cleanse, exfoliation, extraction if needed, back massage and a mask for a hard-to-reach area.",
      path: "/back-facial",
      image: T.image,
      imageAlt: "Fresh Face Spa studio detail",
    }),
  component: BackFacialPage,
});

function BackFacialPage() {
  return (
    <SiteShell>
      <TreatmentPage
        current="/back-facial"
        eyebrow="Back Facial"
        h1="Back Facial"
        lede="Treat a hard-to-reach area to the same deep-cleansing and skin-refining care as a classic facial."
        image={T.image}
        imageAlt="Fresh Face Spa studio detail"
        priceLine={T.priceLine}
        intro={[
          "The same steps as a classic facial, applied to the back — deep cleansing, exfoliation, extraction if needed, a back massage and a mask.",
        ]}
        included={[
          "Double cleanse",
          "Exfoliation",
          "Extraction (if needed)",
          "Back massage",
          "Mask",
        ]}
        bookHeading="Book a back facial"
      >
        <TreatmentSection tone="ivory" eyebrow="Add-ons" heading="Make it a little more">
          <div className="grid gap-5 sm:grid-cols-2">
            <IncludedCard
              title="Add to your back facial"
              items={["Microdermabrasion $25"]}
            />
          </div>
        </TreatmentSection>
      </TreatmentPage>
    </SiteShell>
  );
}
