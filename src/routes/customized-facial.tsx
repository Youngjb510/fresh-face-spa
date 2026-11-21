import { createFileRoute } from "@tanstack/react-router";

import { SiteShell } from "~/components/chrome";
import {
  IncludedCard,
  StudioNote,
  TreatmentPage,
  TreatmentSection,
} from "~/components/treatment-page";
import { pageHead } from "~/lib/seo";
import { TREATMENTS } from "~/lib/site";

const T = TREATMENTS.find((t) => t.path === "/customized-facial")!;

export const Route = createFileRoute("/customized-facial")({
  head: () =>
    pageHead({
      title:
        "Customized Facial — $125, 60 min | Fresh Face Spa, Mission Valley San Diego",
      description:
        "A fully personalized 60-minute facial in Mission Valley, San Diego — $125. Double cleanse, enzyme exfoliation, extraction, a mask chosen for your skin type, facial massage, LED light and SPF, tailored to your skin's specific concern.",
      path: "/customized-facial",
      image: T.image,
      imageAlt: "Fresh Face Spa studio detail",
    }),
  component: CustomizedFacialPage,
});

function CustomizedFacialPage() {
  return (
    <SiteShell>
      <TreatmentPage
        current="/customized-facial"
        eyebrow="Customized Facial"
        h1="Customized Facial"
        lede="Tailored specifically to your skin's unique needs."
        image={T.image}
        imageAlt="Fresh Face Spa studio detail"
        priceLine={T.priceLine}
        intro={[
          "This fully personalized treatment delivers maximum results by addressing your specific concern.",
        ]}
        idealFor="All skin types, including sensitive, congested, dry or aging skin."
        included={[
          "Double cleanse",
          "Exfoliation (enzyme mask)",
          "Extraction/steam",
          "Mask (chosen for your skin type)",
          "Facial massage (hand & shoulder)",
          "LED light",
          "Serum, moisturizer, SPF",
        ]}
        bookHeading="Book a customized facial"
      >
        <TreatmentSection
          tone="ivory"
          eyebrow="Add-ons"
          heading="Make it a little more"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <IncludedCard
              title="Add to any customized facial"
              items={["Dermaplaning $25", "Microdermabrasion $30"]}
            />
            <StudioNote title="Best starting point">
              Anyone who isn't sure which facial to book.
            </StudioNote>
          </div>
        </TreatmentSection>
      </TreatmentPage>
    </SiteShell>
  );
}
