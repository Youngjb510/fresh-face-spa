import { createFileRoute } from "@tanstack/react-router";

import { SiteShell } from "~/components/chrome";
import {
  IncludedCard,
  TreatmentPage,
  TreatmentSection,
} from "~/components/treatment-page";
import { pageHead } from "~/lib/seo";
import { TREATMENTS } from "~/lib/site";

const T = TREATMENTS.find((t) => t.path === "/firming-peptide-facial")!;

export const Route = createFileRoute("/firming-peptide-facial")({
  head: () =>
    pageHead({
      title: "Firming Peptide Facial — $135, 70 min | Fresh Face Spa, San Diego",
      description:
        "An advanced anti-aging facial in San Diego — $135, 70 minutes. Renew, rebuild and lift aging or sluggish skin with firming peptide actives, facial massage and LED light, smoothing fine lines and softening deep wrinkles.",
      path: "/firming-peptide-facial",
      image: T.image,
      imageAlt: "Fresh Face Spa studio detail",
    }),
  component: FirmingPeptideFacialPage,
});

function FirmingPeptideFacialPage() {
  return (
    <SiteShell>
      <TreatmentPage
        current="/firming-peptide-facial"
        eyebrow="Firming Peptide Facial"
        h1="Firming Peptide Facial"
        lede="Renew, rebuild and lift aging or sluggish skin with this advanced anti-aging treatment."
        image={T.image}
        imageAlt="Fresh Face Spa studio detail"
        priceLine={T.priceLine}
        intro={[
          "Instant firming & tightening delivers an immediate lifting effect, smoothing fine lines and softening deep wrinkles.",
        ]}
        included={[
          "Double cleanse",
          "Exfoliation",
          "Facial massage (hand & shoulder)",
          "Mask (firming peptide)",
          "LED light",
          "Serum, moisturizer, SPF",
        ]}
        bookHeading="Book a firming peptide facial"
      >
        <TreatmentSection tone="ivory" eyebrow="Add-ons" heading="Make it a little more">
          <div className="grid gap-5 sm:grid-cols-2">
            <IncludedCard
              title="Add to the firming peptide facial"
              items={["Dermaplaning $20"]}
            />
          </div>
        </TreatmentSection>
      </TreatmentPage>
    </SiteShell>
  );
}
