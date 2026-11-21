import { createFileRoute } from "@tanstack/react-router";

import { SiteShell } from "~/components/chrome";
import {
  IncludedCard,
  TreatmentPage,
  TreatmentSection,
} from "~/components/treatment-page";
import { pageHead } from "~/lib/seo";
import { TREATMENTS } from "~/lib/site";

const T = TREATMENTS.find((t) => t.path === "/bio-skin-peel")!;

export const Route = createFileRoute("/bio-skin-peel")({
  head: () =>
    pageHead({
      title: "No Peel, Peel — Bio Skin — $225 | Fresh Face Spa, San Diego",
      description:
        "Bio RePeel CI3 Blue at Fresh Face Spa in San Diego — $225. A 35% TCA biphasic chemical peel that bypasses the epidermis to work within deeper layers of the skin, with zero downtime. Length shown in the booking menu.",
      path: "/bio-skin-peel",
      image: T.image,
      imageAlt: "Fresh Face Spa studio detail",
    }),
  component: BioSkinPeelPage,
});

function BioSkinPeelPage() {
  return (
    <SiteShell>
      <TreatmentPage
        current="/bio-skin-peel"
        eyebrow="No Peel, Peel — Bio Skin"
        h1="No Peel, Peel — Bio Skin"
        lede="Experience maximum skin transformation with zero downtime."
        image={T.image}
        imageAlt="Fresh Face Spa studio detail"
        priceLine={T.priceLine}
        intro={[
          "Bio RePeel CI3 Blue is an innovative 35% TCA biphasic chemical peel that bypasses the epidermis to work directly within deeper layers of the skin (Bio Skin Bio Repeel CI3).",
        ]}
        idealFor="Blocked pores, acne, hyperpigmentation, melasma, fine lines and wrinkles."
        included={[
          "Double cleanse",
          "Exfoliation",
          "LED light",
          "Facial massage (hand & shoulder)",
          "Face mask",
          "Serum",
        ]}
        bookHeading="Book a No Peel, Peel — Bio Skin"
      >
        <TreatmentSection tone="ivory" eyebrow="Add-ons" heading="Make it a little more">
          <div className="grid gap-5 sm:grid-cols-2">
            <IncludedCard
              title="Add to your Bio Skin peel"
              items={["Dermaplaning $25"]}
            />
          </div>
        </TreatmentSection>
      </TreatmentPage>
    </SiteShell>
  );
}
