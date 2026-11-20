import { createFileRoute } from "@tanstack/react-router";

import { SiteShell } from "~/components/chrome";
import { StudioNote, TreatmentPage } from "~/components/treatment-page";
import { pageHead } from "~/lib/seo";
import { TREATMENTS } from "~/lib/site";

const T = TREATMENTS.find((t) => t.path === "/oxygen-glow-facial")!;

export const Route = createFileRoute("/oxygen-glow-facial")({
  head: () =>
    pageHead({
      title: "Oxygen Glow Facial in San Diego | Fresh Face Spa, Mission Valley",
      description:
        "An oxygen-infusion glow facial at Fresh Face Spa in Mission Valley, San Diego — deep hydration, brightness and a rested finish for dull, tired or stressed skin — $200 for 60 minutes.",
      path: "/oxygen-glow-facial",
      image: T.image,
      imageAlt: "Fresh Face Spa studio detail",
    }),
  component: OxygenGlowFacialPage,
});

function OxygenGlowFacialPage() {
  return (
    <SiteShell>
      <TreatmentPage
        current="/oxygen-glow-facial"
        eyebrow="Oxygen Glow Facial"
        h1="Oxygen Glow Facial"
        lede="Oxygen-infused hydration for skin that looks tired — dullness lifted, moisture pressed back in, and a finish bright enough to skip makeup the next morning."
        image={T.image}
        imageAlt="Fresh Face Spa studio detail"
        priceLine={T.priceLine}
        priceNote="60 minutes with your esthetician."
        intro={[
          "Some skin isn't congested so much as flat. Long weeks, poor sleep, dry air and travel leave skin dehydrated and light-refusing, and no amount of extra cleansing fixes it. This is the facial for that skin.",
          "It follows the studio's standard sequence — double cleanse, gentle exfoliation, extractions only where needed, a treatment mask — with an oxygen infusion worked in to drive hydration and brightening actives deeper than a surface serum can reach. A facial massage through the face, neck and shoulders finishes the reset.",
          "Expect softness and a lit-from-within look straight after, with the clearest glow the following day. It's the appointment people book before a wedding, a shoot or a week they need to look rested for.",
        ]}
        idealFor="Dull or tired-looking skin, dehydration, skin stressed by travel or a busy season, and anyone wanting a bright, event-ready finish with no downtime."
        included={[
          "Double Cleanse",
          "Exfoliation (enzyme mask)",
          "Extraction/steam (if needed)",
          "Oxygen infusion",
          "Mask",
          "Facial massage (hand & shoulder)",
          "Serum, moisturizer, SPF",
        ]}
        bookHeading="Book your glow facial"
      >
        <section className="bg-ivory py-16 lg:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <p className="eyebrow">Good to know</p>
            <h2 className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight text-gold-display sm:text-4xl">
              Before a big day
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <StudioNote title="No downtime">
                Skin may look flushed for an hour or two afterwards. Makeup can
                go on straight after, and most people book one to three days
                before an event.
              </StudioNote>
              <StudioNote title="Build the glow">
                One visit gives an immediate lift. For a longer-lasting change in
                tone and hydration, Raquel will suggest a short series spaced a
                few weeks apart.
              </StudioNote>
            </div>
          </div>
        </section>
      </TreatmentPage>
    </SiteShell>
  );
}
