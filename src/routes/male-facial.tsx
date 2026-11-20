import { createFileRoute } from "@tanstack/react-router";

import { SiteShell } from "~/components/chrome";
import { StudioNote, TreatmentPage } from "~/components/treatment-page";
import { pageHead } from "~/lib/seo";
import { TREATMENTS } from "~/lib/site";

const T = TREATMENTS.find((t) => t.path === "/male-facial")!;

export const Route = createFileRoute("/male-facial")({
  head: () =>
    pageHead({
      title:
        "The Gentleman's Facial — $125 | Fresh Face Spa, Mission Valley San Diego",
      description:
        "The Gentleman's Facial at Fresh Face Spa in Mission Valley, San Diego ($125) — deep pore cleansing, gentle exfoliation and calming botanical hydration for shaving stress, congestion and environmental fatigue.",
      path: "/male-facial",
      image: T.image,
      imageAlt: "Fresh Face Spa studio detail",
    }),
  component: MaleFacialPage,
});

function MaleFacialPage() {
  return (
    <SiteShell>
      <TreatmentPage
        current="/male-facial"
        eyebrow="The Gentleman's Facial"
        h1="The Gentleman's Facial"
        lede="Tailored specifically to the distinct needs of men's skin — daily shaving stress, congestion and environmental fatigue, handled with a focus on calming, hydrating, deep pore cleansing."
        image={T.image}
        imageAlt="Fresh Face Spa studio detail"
        priceLine={T.priceLine}
        priceNote="Booking is handled in the studio's online menu."
        intro={[
          "Men's skin tends to be thicker and oilier, and it takes daily wear from shaving. This treatment is built around that: a proper deep pore cleanse, gentle exfoliation to keep ingrown hairs at bay, and clinical botanical hydration to calm razor burn.",
          "Congestion gets attention where it actually sits — around the nose, chin and jawline — and the finish is a signature 10-minute face, neck and shoulder massage.",
          "No hard sell, no ten-product routine to take home. If something simple will keep your skin clear between visits, that's what you'll hear.",
        ]}
        idealFor="Men dealing with shaving irritation or ingrown hairs, oily and congested skin, blackheads around the nose, or simply skin that hasn't been looked after in a while."
        included={[
          "Deep pore cleansing",
          "Gentle exfoliation to prevent ingrown hairs",
          "Clinical botanical hydration to calm razor burn",
          "Signature 10-minute face, neck & shoulder massage",
        ]}
        bookHeading="Book your facial"
      >
        <section className="bg-ivory py-16 lg:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <p className="eyebrow">Good to know</p>
            <h2 className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight text-gold-display sm:text-4xl">
              Simple, and nothing you don't need
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <StudioNote title="Shaving, handled">
                Tell us how you shave and where it irritates you. We'll work
                around it in the treatment and suggest something to use
                afterwards that won't sting.
              </StudioNote>
              <StudioNote title="First facial? Fine.">
                Say so when you book. Every step gets explained, extractions are
                kept to what your skin tolerates, and you can ask for as much or
                as little conversation as you like.
              </StudioNote>
            </div>
          </div>
        </section>
      </TreatmentPage>
    </SiteShell>
  );
}
