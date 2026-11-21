import { createFileRoute } from "@tanstack/react-router";

import { SiteShell } from "~/components/chrome";
import { TreatmentPage } from "~/components/treatment-page";
import { pageHead } from "~/lib/seo";
import { TREATMENTS } from "~/lib/site";

const T = TREATMENTS.find((t) => t.path === "/liquid-microneedling")!;

export const Route = createFileRoute("/liquid-microneedling")({
  head: () =>
    pageHead({
      title: "Liquid Microneedling (Needle-Free) — $175, 70 min | Fresh Face Spa",
      description:
        "A 70-minute needle-free liquid microneedling treatment in San Diego — $175. Bio micro needling with 10 million spicules for collagen production and skin rejuvenation, with double cleanse, exfoliation, steam, mask and facial massage.",
      path: "/liquid-microneedling",
      image: T.image,
      imageAlt: "Fresh Face Spa studio detail",
    }),
  component: LiquidMicroneedlingPage,
});

function LiquidMicroneedlingPage() {
  return (
    <SiteShell>
      <TreatmentPage
        current="/liquid-microneedling"
        eyebrow="Liquid Microneedling (needle-free)"
        h1="Liquid Microneedling (needle-free)"
        lede="Our Bio micro needling — 10 million spicules — ensures optimal stimulation for collagen production and skin rejuvenation."
        image={T.image}
        imageAlt="Fresh Face Spa studio detail"
        priceLine={T.priceLine}
        intro={[
          "A manual treatment that replaces traditional microneedling and chemical peels.",
        ]}
        idealFor="Hyperpigmentation, dull skin, uneven skin tone, acne scars and texture."
        included={[
          "Double cleanse",
          "Exfoliation",
          "Light extraction (if needed) / steam",
          "Facial massage (hand & shoulder)",
          "Mask",
          "Serum, SPF",
        ]}
        bookHeading="Book a liquid microneedling treatment"
      />
    </SiteShell>
  );
}
