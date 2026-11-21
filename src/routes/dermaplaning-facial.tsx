import { createFileRoute } from "@tanstack/react-router";

import { SiteShell } from "~/components/chrome";
import { TreatmentPage } from "~/components/treatment-page";
import { pageHead } from "~/lib/seo";
import { TREATMENTS } from "~/lib/site";

const T = TREATMENTS.find((t) => t.path === "/dermaplaning-facial")!;

export const Route = createFileRoute("/dermaplaning-facial")({
  head: () =>
    pageHead({
      title:
        "Dermaplaning Facial with Peel — $200, 70 min | Fresh Face Spa, San Diego",
      description:
        "A 70-minute dermaplaning facial with peel in San Diego — $200. Double cleanse, enzyme, dermaplaning, peel, facial massage, serum infusion and LED light for a smoother, brighter, more radiant complexion.",
      path: "/dermaplaning-facial",
      image: T.image,
      imageAlt: "Fresh Face Spa studio detail",
    }),
  component: DermaplaningFacialPage,
});

function DermaplaningFacialPage() {
  return (
    <SiteShell>
      <TreatmentPage
        current="/dermaplaning-facial"
        eyebrow="Dermaplaning Facial with Peel"
        h1="Dermaplaning Facial with Peel"
        lede="Reveal your smoothest, most radiant complexion with this high performance dual treatment."
        image={T.image}
        imageAlt="Fresh Face Spa studio detail"
        priceLine={T.priceLine}
        intro={[
          "Instant radiance — skin looks noticeably brighter, silky smooth and glowing after a single session.",
          "Removing the barrier layer lets serums and active ingredients work more effectively.",
        ]}
        idealFor="Dry, dull, uneven skin tone, sun damage and large pores."
        included={[
          "Double cleanse",
          "Enzyme",
          "Dermaplaning",
          "Peel",
          "Facial massage (hand & shoulder)",
          "Serum infusion",
          "LED light",
        ]}
        bookHeading="Book a dermaplaning facial"
      />
    </SiteShell>
  );
}
