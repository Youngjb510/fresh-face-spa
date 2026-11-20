import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

import { SiteShell } from "~/components/chrome";
import { StudioNote } from "~/components/treatment-page";
import { pageHead } from "~/lib/seo";
import {
  BOOKING_URL,
  PHONE_DISPLAY,
  PHONE_HREF,
  TREATMENTS,
  g,
} from "~/lib/site";

const GIFT_IMAGE = g("/gallery/34-P1029066.jpg");

const AMOUNTS = ["$50", "$75", "$100", "$150", "$200"];

const CTA_CLASS =
  "inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-gold-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2";

const PHONE_CLASS =
  "inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-gold ring-1 ring-line transition-colors hover:bg-sand/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2";

export const Route = createFileRoute("/gift-certificates")({
  head: () =>
    pageHead({
      title: "Gift Certificates | Fresh Face Spa, Mission Valley San Diego",
      description:
        "Fresh Face Spa gift certificates in $50, $75, $100, $150 and $200 amounts. Buy online through the booking menu, in person at the Mission Valley or Chula Vista studio, or by calling (619) 755-9045. They never expire.",
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
              Fresh Face Spa gift certificates come in $50, $75, $100, $150 and
              $200 amounts and can go toward any treatment on the menu — a
              birthday, a thank you, or someone who has earned a slow hour. They
              never expire.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={CTA_CLASS}
              >
                Buy online
              </a>
              <a href={PHONE_HREF} className={PHONE_CLASS}>
                Call or text {PHONE_DISPLAY}
              </a>
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
          <p className="eyebrow">Amounts</p>
          <h2 className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight text-gold-display sm:text-4xl">
            Choose an amount
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-mute">
            Certificates are issued in five amounts. Pick the one that matches the
            treatment you have in mind, or the budget you have in mind.
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {AMOUNTS.map((amount) => (
              <li key={amount} className="card text-center">
                <p className="font-display text-3xl font-medium text-gold">{amount}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.14em] text-sage-deep">
                  Gift certificate
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-faint">
            Every certificate can be applied to any treatment on the menu, and it
            never expires — so it's still good whenever they're ready to use it.
          </p>
        </div>
      </section>

      <section className="bg-ivory py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="eyebrow">How to buy</p>
          <h2 className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight text-gold-display sm:text-4xl">
            Three ways to buy one
          </h2>
          <ul className="mt-8 grid gap-5 lg:grid-cols-3">
            <li className="card flex h-full flex-col">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-deep">
                Online
              </p>
              <p className="mt-2 font-display text-xl font-medium text-gold">
                Through the booking menu
              </p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-mute">
                Open the studio's online booking menu, choose the gift certificate
                amount you want, and pay for it there. Same menu you book a facial
                in.
              </p>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`${CTA_CLASS} mt-5 self-start !px-6 !py-3 text-sm`}
              >
                Buy online
              </a>
            </li>
            <li className="card flex h-full flex-col">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-deep">
                In person
              </p>
              <p className="mt-2 font-display text-xl font-medium text-gold">
                At either studio
              </p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-mute">
                Stop by Mission Valley — 1640 Camino Del Rio N, Ste 206, Rm 116,
                San Diego, CA 92108 — or Chula Vista, at Sola Salon Studios, 940
                Eastlake Parkway, Suite 16. Open every day, 10am – 7pm.
              </p>
              <Link
                to="/"
                hash="contact"
                className="mt-5 self-start text-sm font-semibold text-sage-deep underline-offset-4 hover:underline"
              >
                Studio addresses &amp; hours
              </Link>
            </li>
            <li className="card flex h-full flex-col">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-deep">
                By phone
              </p>
              <p className="mt-2 font-display text-xl font-medium text-gold">
                Call or text {PHONE_DISPLAY}
              </p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-mute">
                Tell us the amount and who it's for, and we'll take it from there —
                including getting it to someone who isn't local.
              </p>
              <a href={PHONE_HREF} className={`${PHONE_CLASS} mt-5 self-start !px-6 !py-3`}>
                Call or text
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section className="bg-linen/60 py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="eyebrow">How to redeem</p>
              <h2 className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight text-gold-display sm:text-4xl">
                Using a certificate
              </h2>
              <div className="mt-6 space-y-4 leading-relaxed text-mute">
                <p>
                  Mention the certificate when you book — in the booking notes, or
                  by phone — and again when you arrive, so we can apply it to the
                  right visit.
                </p>
                <p>
                  Certificates can be applied to any treatment on the menu, and
                  toward retail products in the studio. There is no expiration
                  date: a certificate is still valid whenever it's used.
                </p>
              </div>
            </div>
            <div>
              <p className="eyebrow">Good to know</p>
              <h2 className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight text-gold-display sm:text-4xl">
                Questions before you buy?
              </h2>
              <div className="mt-6 space-y-4 leading-relaxed text-mute">
                <p>
                  Not sure which amount fits the treatment you want to give? Ask
                  us and we'll point you at the right one.
                </p>
              </div>
              <div className="mt-6">
                <StudioNote title="No expiration">
                  Text {PHONE_DISPLAY} with any question about a certificate — the
                  amount to choose, how it's delivered, or how to use it.
                </StudioNote>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ivory py-16 lg:py-24">
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
