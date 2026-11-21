import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import {
  BOOKING_URL,
  GIFT_CERTIFICATES_PATH,
  PHONE_DISPLAY,
  PHONE_HREF,
  TREATMENTS,
  g,
} from "~/lib/site";
import type { TreatmentPath } from "~/lib/site";
import { GoogleProof } from "~/components/google-proof";

/* ------------------------------ Treatment hero ------------------------------ */

export function TreatmentHero({
  eyebrow,
  h1,
  lede,
  image,
  imageAlt,
  priceLine,
  priceNote,
}: {
  eyebrow: string;
  h1: string;
  lede: string;
  image: string;
  imageAlt: string;
  priceLine: string | null;
  priceNote?: string;
}) {
  return (
    <section aria-label={h1} className="relative overflow-hidden bg-ivory">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-10%] h-[34rem] w-[34rem] rounded-full bg-sage-soft/60 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-5 font-display text-4xl font-medium leading-[1.08] tracking-tight text-gold-display sm:text-5xl lg:text-6xl">
            {h1}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-mute">{lede}</p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            {priceLine ? (
              <span className="rounded-full bg-sand px-4 py-2 text-sm font-semibold text-gold">
                {priceLine}
              </span>
            ) : null}
            <span className="rounded-full bg-sage-soft px-4 py-2 text-sm font-medium text-sage-deep">
              Mission Valley + Chula Vista
            </span>
          </div>
          {priceNote ? (
            <p className="mt-3 text-sm text-faint">{priceNote}</p>
          ) : null}

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Book Now
            </a>
            <a href={PHONE_HREF} className="btn-ghost">
              Call or text {PHONE_DISPLAY}
            </a>
          </div>
          <p className="mt-6 text-sm text-faint">
            Open every day, 10am – 7pm · by appointment
          </p>
          <GoogleProof className="mt-3" />
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div
            aria-hidden="true"
            className="absolute -inset-3 rotate-[-2deg] rounded-[2.5rem] bg-sand"
          />
          <img
            src={image}
            alt={imageAlt}
            className="relative aspect-[4/5] w-full rounded-[2.5rem] object-cover shadow-xl"
          />
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Sections --------------------------------- */

export function TreatmentSection({
  eyebrow,
  heading,
  children,
  tone = "linen",
}: {
  eyebrow: string;
  heading: ReactNode;
  children: ReactNode;
  tone?: "linen" | "ivory";
}) {
  return (
    <section
      className={
        tone === "linen" ? "bg-linen/60 py-16 lg:py-24" : "bg-ivory py-16 lg:py-24"
      }
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-4 max-w-2xl font-display text-3xl font-medium leading-tight tracking-tight text-gold-display sm:text-4xl">
          {heading}
        </h2>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

export function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="max-w-2xl space-y-4 leading-relaxed text-mute">
      {paragraphs.map((p) => (
        <p key={p.slice(0, 40)}>{p}</p>
      ))}
    </div>
  );
}

export function IncludedCard({
  items,
  title = "Included in your treatment",
}: {
  items: string[];
  title?: string;
}) {
  return (
    <div className="card">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-deep">
        {title}
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-mute">
            <span
              aria-hidden="true"
              className="mt-2 h-1 w-1 shrink-0 rounded-full bg-sage"
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------- Cross-links -------------------------------- */

export function RelatedTreatments({ current }: { current: TreatmentPath }) {
  // Three cross-links keeps the grid to one tidy row.
  const others = TREATMENTS.filter((t) => t.path !== current).slice(0, 3);

  return (
    <section className="bg-ivory py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="eyebrow">Also at the studio</p>
        <h2 className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight text-gold-display sm:text-4xl">
          Other treatments
        </h2>
        <ul className="mt-8 grid gap-5 sm:grid-cols-3">
          {others.map((t) => (
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
        <p className="mt-8 text-sm text-mute">
          Looking for a gift?{" "}
          <Link
            to={GIFT_CERTIFICATES_PATH}
            className="font-semibold text-gold underline-offset-4 hover:underline"
          >
            Gift certificates
          </Link>{" "}
          are available for any service or any amount.
        </p>
      </div>
    </section>
  );
}

/* --------------------------------- Book band -------------------------------- */

export function BookBand({ heading }: { heading: string }) {
  return (
    <section className="bg-sage-deep py-16 text-ivory lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 sm:px-8 md:flex-row md:items-center">
        <div>
          <h2 className="font-display text-3xl font-medium leading-tight text-gold-display sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ivory/80">
            Booking takes less than a minute, no account needed. Prefer to talk
            it through? Call or text {PHONE_DISPLAY}.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-gold-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-sage-deep"
          >
            Book Now
          </a>
          <a
            href={PHONE_HREF}
            className="inline-flex items-center justify-center rounded-full bg-white/10 px-6 py-3.5 text-sm font-semibold text-ivory ring-1 ring-ivory/20 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-2 focus-visible:ring-offset-sage-deep"
          >
            {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Full page shell ----------------------------- */

// Shared body for the four treatment pages: hero, intro + what's included,
// optional extra sections, cross-links and the booking band.
export function TreatmentPage({
  current,
  eyebrow,
  h1,
  lede,
  image,
  imageAlt,
  priceLine,
  priceNote,
  intro,
  idealFor,
  included,
  includedTitle,
  children,
  bookHeading,
}: {
  current: TreatmentPath;
  eyebrow: string;
  h1: string;
  lede: string;
  image: string;
  imageAlt: string;
  priceLine: string | null;
  priceNote?: string;
  intro: string[];
  /** Omitted where the studio has never stated who a treatment suits. */
  idealFor?: string;
  included: string[];
  includedTitle?: string;
  children?: ReactNode;
  bookHeading: string;
}) {
  return (
    <>
      <TreatmentHero
        eyebrow={eyebrow}
        h1={h1}
        lede={lede}
        image={image}
        imageAlt={imageAlt}
        priceLine={priceLine}
        priceNote={priceNote}
      />
      <TreatmentSection
        eyebrow="The treatment"
        heading={
          <>
            What happens in a{" "}
            <span className="italic text-gold-display">{eyebrow.toLowerCase()}</span>
          </>
        }
      >
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div>
            <Prose paragraphs={intro} />
            {idealFor ? (
              <div className="mt-6 rounded-2xl bg-sage-soft/70 p-5">
                <p className="text-sm font-semibold text-gold">Best for</p>
                <p className="mt-1 text-sm leading-relaxed text-mute">{idealFor}</p>
              </div>
            ) : null}
          </div>
          <IncludedCard items={included} title={includedTitle} />
        </div>
      </TreatmentSection>
      {children}
      <RelatedTreatments current={current} />
      <BookBand heading={bookHeading} />
    </>
  );
}

/* ------------------------------- Small helpers ------------------------------- */

export function StudioNote({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="card !border-dashed bg-transparent">
      <p className="text-sm font-semibold text-gold">{title}</p>
      <div className="mt-2 text-sm leading-relaxed text-mute">{children}</div>
    </div>
  );
}

export const STUDIO_GALLERY_IMAGE = g("/gallery/36-P1029071.jpg");
