import { createFileRoute } from "@tanstack/react-router";

import { SiteShell } from "~/components/chrome";
import { StudioNote, TreatmentPage } from "~/components/treatment-page";
import { pageHead } from "~/lib/seo";
import { TREATMENTS } from "~/lib/site";

const T = TREATMENTS.find((t) => t.path === "/teen-facial")!;

export const Route = createFileRoute("/teen-facial")({
  head: () =>
    pageHead({
      title:
        "Teen Clarifying Facial — $90 · 60 min | Fresh Face Spa, San Diego",
      description:
        "A gentle 60-minute clarifying facial for teen skin in Mission Valley, San Diego. Double cleanse, exfoliation, light extractions and a calming mask to settle hormonal breakouts and excess oil — $90.",
      path: "/teen-facial",
      image: T.image,
      imageAlt: "Fresh Face Spa studio detail",
    }),
  component: TeenFacialPage,
});

function TeenFacialPage() {
  return (
    <SiteShell>
      <TreatmentPage
        current="/teen-facial"
        eyebrow="Teen Facial"
        h1="Teen Clarifying Facial"
        lede="Designed specifically for adolescent skin, this gentle yet effective facial addresses the changes that come with hormonal shifts, excess oil production and early breakouts."
        image={T.image}
        imageAlt="Fresh Face Spa studio detail"
        priceLine={T.priceLine}
        intro={[
          "Teen skin is not just smaller adult skin. Hormones drive oil production up, pores get congested faster, and the barrier is often already irritated by the products teenagers reach for first. This facial is built around that reality — clarifying, but never punishing.",
          "A double cleanse is followed by gentle exfoliation, then light extraction only where it's actually needed, softened with steam. A calming mask, serum, moisturiser and SPF finish the visit so skin leaves comfortable rather than tight.",
          "It's also a good first facial. Raquel talks through what she's seeing and what to use at home in plain language, which tends to land better from an esthetician than from a parent.",
        ]}
        idealFor="Teenagers dealing with early breakouts, oily and congested skin, blackheads, or a first facial they're a little nervous about."
        included={[
          "Double Cleanse",
          "Exfoliation",
          "Light extraction (if needed) / steam",
          "Mask",
          "Serum, moisturizer, SPF",
        ]}
        bookHeading="Book a teen facial"
      >
        <section className="bg-ivory py-16 lg:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <p className="eyebrow">Good to know</p>
            <h2 className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight text-gold-display sm:text-4xl">
              A calm first appointment
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <StudioNote title="No pressure, no lectures">
                Every step is explained before it happens, and extractions are
                done only where skin will tolerate them. Comfortable silence is
                also completely fine.
              </StudioNote>
              <StudioNote title="Parents welcome">
                A parent is welcome to stay for the consultation, and we'll go
                over a simple home routine together so the results hold between
                visits.
              </StudioNote>
            </div>
          </div>
        </section>
      </TreatmentPage>
    </SiteShell>
  );
}
