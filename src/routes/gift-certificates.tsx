import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

import { SiteShell } from "~/components/chrome";
import { StudioNote } from "~/components/treatment-page";
import { pageHead } from "~/lib/seo";
import { PHONE_DISPLAY, PHONE_HREF, TREATMENTS, g } from "~/lib/site";

const GIFT_IMAGE = g("/gallery/34-P1029066.jpg");

export const Route = createFileRoute("/gift-certificates")({
  head: () =>
    pageHead({
      title: "Gift Certificates | Fresh Face Spa, Mission Valley San Diego",
      description:
        "Fresh Face Spa gift certificates for any service or any amount — digital or printed. Buy by calling or texting (619) 755-9045, or in the studio in Mission Valley, San Diego.",
      path: "/gift-certificates",
      image: GIFT_IMAGE,
      imageAlt: "Fresh Face Spa studio detail",
    }),
  component: GiftCertificatesPage,
});

function GiftCertificatesPage() {
  return (
    <SiteShell>
      <section aria-label="Gift certificates" className="relative overflow-hidden bg-ivory">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 right-[-10%] h-[34rem] w-[34rem] rounded-full bg-sage-soft/60 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div>
            <p className="eyebrow">Gift Certificates</p>
            <h1 className="mt-5 font-display text-4xl font-medium leading-[1.08] tracking-tight text-gold-display sm:text-5xl lg:text-6xl">
              Give an hour of <span className="italic text-gold-display">quiet</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-mute">
              A Fresh Face Spa gift certificate covers any treatment on the menu
              or any amount you choose — digital or printed, ready for a birthday,
              a thank you, or someone who has earned a slow hour.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href={PHONE_HREF}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-gold-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              >
                Call or text {PHONE_DISPLAY}
              </a>
              <Link to="/" hash="contact" className="btn-ghost">
                Studio address
              </Link>
            </div>
            <p className="mt-6 text-sm text-faint">
              Open every day, 10am – 7pm · Mission Valley + Chula Vista
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rotate-[-2deg] rounded-[2.5rem] bg-sand"
            />
            <img
              src={GIFT_IMAGE}
              alt="Fresh Face Spa studio detail"
              className="relative aspect-[4/5] w-full rounded-[2.5rem] object-cover shadow-xl"
            />
          </div>
        </div>
      </section>

      <section className="bg-linen/60 py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight text-gold-display sm:text-4xl">
            Three simple steps
          </h2>
          <ol className="mt-8 grid gap-5 sm:grid-cols-3">
            <li className="card">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-deep">
                Step 1
              </p>
              <p className="mt-2 font-display text-xl font-medium text-gold">
                Choose any amount or any service
              </p>
              <p className="mt-2 text-sm leading-relaxed text-mute">
                Put a dollar amount on the certificate and let them pick, or name
                the treatment you'd like to give — from a Customized Facial to the
                Oxygen Glow Facial.
              </p>
            </li>
            <li className="card">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-deep">
                Step 2
              </p>
              <p className="mt-2 font-display text-xl font-medium text-gold">
                Digital or printed
              </p>
              <p className="mt-2 text-sm leading-relaxed text-mute">
                Take it as a digital certificate to send the same day, or ask for
                a printed one to hand over in person.
              </p>
            </li>
            <li className="card">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-deep">
                Step 3
              </p>
              <p className="mt-2 font-display text-xl font-medium text-gold">
                They book whenever suits
              </p>
              <p className="mt-2 text-sm leading-relaxed text-mute">
                When they book — online or by phone — they mention the
                certificate and we apply it to the visit.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <section className="bg-ivory py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="eyebrow">How to buy</p>
              <h2 className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight text-gold-display sm:text-4xl">
                Call, text, or stop by
              </h2>
              <div className="mt-6 space-y-4 leading-relaxed text-mute">
                <p>
                  Call or text{" "}
                  <a
                    href={PHONE_HREF}
                    className="font-semibold text-gold underline-offset-4 hover:underline"
                  >
                    {PHONE_DISPLAY}
                  </a>{" "}
                  and we'll set the certificate up for you — tell us the amount or
                  the treatment, and who it's for.
                </p>
                <p>
                  You're also welcome to buy one in person at the studio: 1640
                  Camino Del Rio N, Ste 206, Rm 116, San Diego, CA 92108. The
                  Chula Vista location (Sola Salon Studios, 940 Eastlake Parkway,
                  Suite 16) is open Sundays and Mondays.
                </p>
                {/* OWNER-EDITABLE: once denominations and an online purchase link
                    are confirmed, add them here. No expiry wording is published
                    until the studio confirms the policy. */}
              </div>
            </div>
            <div>
              <p className="eyebrow">How to redeem</p>
              <h2 className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight text-gold-display sm:text-4xl">
                Using a certificate
              </h2>
              <div className="mt-6 space-y-4 leading-relaxed text-mute">
                <p>
                  Mention the certificate when you book — online in the booking
                  notes, or by phone — and again when you arrive, so we can apply
                  it to the right visit.
                </p>
                <p>
                  Certificates can be applied to any service on the menu, and
                  toward retail products in the studio.
                </p>
              </div>
              <div className="mt-6">
                <StudioNote title="Questions before you buy?">
                  Text {PHONE_DISPLAY} and we'll answer directly — including the
                  current policy on certificate expiry and any balance remaining
                  after a visit.
                </StudioNote>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-linen/60 py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="eyebrow">Good to pair with</p>
          <h2 className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight text-gold-display sm:text-4xl">
            Treatments people ask for
          </h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TREATMENTS.map((t) => (
              <li key={t.path}>
                <Link
                  to={t.path}
                  className="card block h-full !p-6 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                >
                  <p className="font-display text-xl font-medium text-gold">{t.name}</p>
                  <p className="mt-2 text-sm leading-relaxed text-mute">{t.blurb}</p>
                  <p className="mt-4 text-sm font-semibold text-sage-deep">
                    {t.priceLine ?? "Pricing in the booking menu"}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SiteShell>
  );
}
