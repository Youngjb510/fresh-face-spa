import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import {
  ChatWidget,
  FacebookIcon,
  InstagramIcon,
  SiteFooter,
  SiteHeader,
  TikTokIcon,
} from "~/components/chrome";
import {
  ClickablePhoto,
  PhotosLightboxProvider,
  usePhotosLightbox,
} from "~/components/photos-lightbox";
import { BOOKING_URL, SITE_URL, TREATMENTS, g } from "~/lib/site";
import type { TreatmentPath } from "~/lib/site";

const IMAGES = {
  hero: g("/gallery/9-P1029012.jpg"),
};

// Locally-hosted, optimized studio photos (copied from the uploaded JPGs into
// public/gallery and served by the site at /gallery/*).
const GALLERY_IMG_NAMES = [
  "pool-1",
  "pool-2",
  "16-P1029029",
  "18-P1029035",
  "21-P1029043",
  "27-P1029053",
];
const GALLERY_IMAGES = GALLERY_IMG_NAMES.map((name) =>
  g(`/gallery/${name}.jpg`),
);

// Every photo on the page, in the order they appear (hero → about → services →
// gallery → contact). All share ONE lightbox: clicking any photo anywhere opens
// it large, and prev/next navigate the whole set. Srcs go through `g()` so they
// resolve correctly on both the live SSR site ("/") and GitHub Pages ("/fresh-face-spa/").
const ABOUT_IMGS = [
  g("/gallery/36-P1029071.jpg"),
  g("/gallery/8-P1029010.jpg"),
  g("/gallery/43-IMG_5465.jpg"),
];
const SERVICES_IMG = g("/gallery/4-P1029005.jpg");
const CONTACT_IMGS = [
  g("/gallery/34-P1029066.jpg"),
  g("/gallery/41-P1029090.jpg"),
];
const PG_PHOTOS = [
  IMAGES.hero, // 0  hero
  ...ABOUT_IMGS, // 1-3 about
  SERVICES_IMG, // 4  services
  ...GALLERY_IMAGES, // gallery
  ...CONTACT_IMGS, // contact
];
const ABOUT_START = 1;
const GALLERY_START = 5;
const CONTACT_START = GALLERY_START + GALLERY_IMAGES.length;

const FOCUS_AREAS = [
  { title: "Acne", copy: "Calming, congestion-clearing treatments that respect your barrier." },
  { title: "Pigmentation", copy: "Brightening exfoliation and renewal to even out tone." },
  { title: "Sensitivity", copy: "Gentle, fragrance-free rituals that soothe reactive skin." },
  { title: "Age management", copy: "Firming actives and massage for a rested, lifted look." },
];

type MenuService = {
  name: string;
  price: string;
  duration: string | null;
  copy: string;
  idealFor: string | null;
  included: string[];
  addOns: string[];
  tag?: string;
  // Dedicated page for this treatment, when one exists.
  page?: TreatmentPath;
};

const SERVICES: MenuService[] = [
  {
    name: "Dermaplaning Facial with Peel",
    price: "$200",
    duration: "70 min",
    copy: "Reveal your smoothest, most radiant complexion with this high performance dual treatment. Instant radiance. Leaves skin noticeably brighter, silky smooth and glowing after a single session. Deeper product penetration removes the barrier layer so serums and active ingredients work more effectively.",
    idealFor: "Dry, dull, uneven skin tone, sun damage and large pores.",
    included: ["Double Cleanse", "Enzyme", "Dermaplaning", "Peel", "Facial massage (hand & shoulder)", "Serum infusion", "LED light"],
    addOns: [],
  },
  {
    name: "Customized Facial",
    price: "$125",
    duration: "60 min",
    copy: "Tailored specifically to your skin's unique needs. This fully personalized treatment delivers maximum results by addressing your specific concern.",
    idealFor: "All skin types, including sensitive, congested, dry or aging skin.",
    included: ["Double Cleanse", "Exfoliation (enzyme mask)", "Extraction/steam", "Mask (depends on your skin type)", "Facial massage (hand & shoulder)", "LED light", "Serum, moisturizer, SPF"],
    addOns: ["Dermaplaning — $25", "Microdermabrasion — $30"],
  },
  {
    name: "Chemical Peel with Facial",
    price: "$175",
    duration: "70 min",
    copy: "Combine the ultimate relaxation with clinical grade resurfacing. This targeted treatment pairs the restorative steps of a classic facial — deep cleansing, gentle extraction — with an advanced chemical peel tailored to your specific skin goals.",
    idealFor: "Anti-aging, sun damaged, hyperpigmentation or breakout prone skin.",
    included: ["Double cleanse", "Light exfoliation", "Extraction (if needed)", "Facial massage (hand & shoulder)", "Chemical peel Jessner by Circadia"],
    addOns: [],
  },
  {
    name: "No Peel, Peel — Bio Skin",
    price: "$225",
    duration: null,
    copy: "Experience maximum skin transformation with zero downtime. Bio RePeel CI3 Blue is an innovative 35% TCA biphasic chemical peel that bypasses the epidermis to work directly within deeper layers of the skin (Bio Skin Bio Repeel CI3).",
    idealFor: "Blocked pores, acne, hyperpigmentation, melasma, fine lines and wrinkles.",
    included: ["Double cleanse", "Exfoliation", "LED light", "Facial massage (hand & shoulder)", "Face mask", "Serum"],
    addOns: ["Dermaplaning — $25"],
  },
  {
    name: "Liquid Microneedling (needle-less)",
    price: "$175",
    duration: "70 min",
    copy: "Our Bio micro needling — 10 million spicules — ensures optimal stimulation for collagen production and skin rejuvenation. It offers a manual treatment that replaces traditional microneedling and chemical peels.",
    idealFor: "Hyperpigmentation, dull skin, uneven skin tone, acne scars and texture.",
    included: ["Double cleanse", "Exfoliation", "Light extraction (if needed) / steam", "Facial massage (hand & shoulder)", "Mask", "Serum, SPF"],
    addOns: [],
  },
  {
    name: "Microdermabrasion",
    price: "$135",
    duration: "60 min",
    copy: "Refresh and polish your skin with this advanced physical exfoliation treatment. It sweeps away dull, dead skin cells and clears clogged pores to instantly reveal a softer, brighter and more refined skin surface.",
    idealFor: null,
    included: ["Double cleanse", "Exfoliation", "Light extraction/steam", "Mask", "Facial massage (hand & shoulder)", "LED light", "Serum, moisturizer, SPF"],
    addOns: [],
  },
  {
    name: "Hydra Glow Facial",
    price: "$175",
    duration: "70 min",
    copy: "Experience the ultimate deep cleanse and instant glow with our advanced hydro-dermabrasion treatment. This treatment can even skin tone, help treat acne, and reduce the appearance of enlarged pores and fine lines.",
    idealFor: null,
    included: ["Double cleanse", "Exfoliation (enzyme mask)", "Extraction/steam", "RF skin tightening", "Facial massage (hand & shoulder)", "Mask", "LED light", "Serum, moisturizer, SPF"],
    addOns: ["Dermaplaning — $25"],
  },
  {
    name: "Oxygen Glow Facial",
    price: "$200",
    duration: "60 min",
    copy: "A rejuvenating facial utilizing pure oxygen delivery and OxygenCeuticals formulated ampoules to deeply hydrate, refresh skin tone, and restore a clear, natural glow.",
    idealFor: null,
    page: "/oxygen-glow-facial",
    included: ["Double cleanse", "Light exfoliation", "Customized oxygen infusion misting", "Signature facial & shoulder massage", "Protective barrier hydration"],
    addOns: [],
  },
  {
    name: "Firming Peptide Facial",
    price: "$135",
    duration: "70 min",
    copy: "Renew, rebuild and lift aging or sluggish skin with this advanced anti-aging treatment. Instant firming & tightening delivers an immediate lifting effect, smoothing fine lines and softening deep wrinkles.",
    idealFor: null,
    included: ["Double cleanse", "Exfoliation", "Facial massage (hand & shoulder)", "Mask (firming peptide)", "LED light", "Serum, moisturizer, SPF"],
    addOns: ["Dermaplaning — $20"],
  },
  {
    name: "Teen Clarifying Facial",
    price: "$90",
    duration: null,
    copy: "Designed specifically for adolescent skin, this gentle yet effective facial addresses the unique skin changes caused by hormonal shifts, excess oil production and early breakouts.",
    idealFor: null,
    page: "/teen-facial",
    included: ["Double Cleanse", "Exfoliation", "Light extraction (if needed) / steam", "Mask", "Serum, moisturizer, SPF"],
    addOns: [],
  },
  {
    name: "The Gentleman's Facial",
    price: "$125",
    duration: "70 min",
    copy: "Tailored specifically to the distinct needs of men's skin, this treatment addresses daily shaving stress, congestion, and environmental fatigue. Key focus: calming, hydrating, deep pore cleansing.",
    idealFor: null,
    page: "/male-facial",
    included: ["Deep pore cleansing", "Gentle exfoliation to prevent ingrown hairs", "Clinical botanical hydration to calm razor burn", "Signature 10-minute face, neck & shoulder massage"],
    addOns: [],
  },
  {
    name: "Back Facial",
    price: "$80",
    duration: "60 min",
    copy: "Treat a hard-to-reach area to the same deep-cleansing and skin-refining care as a classic facial.",
    idealFor: null,
    included: ["Double cleanse", "Exfoliation", "Extraction (if needed)", "Back massage", "Mask"],
    addOns: ["Microdermabrasion — $25"],
  },
];

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const Route = createFileRoute("/")({
  head: () => ({
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
  }),
  component: Home,
});

function Home() {
  return (
    <PhotosLightboxProvider photos={PG_PHOTOS}>
      <div className="min-h-dvh bg-ivory text-ink">
        <SiteHeader onHome />
        <main>
          <Hero />
          <About />
          <Services />
          <TreatmentGuides />
          <Gallery />
          <Process />
          <Hours />
          <Contact />
        </main>
        <SiteFooter onHome />
        <ChatWidget />
      </div>
    </PhotosLightboxProvider>
  );
}

/* ----------------------------------- Hero ---------------------------------- */

function HeroVideo() {
  const [muted, setMuted] = useState(true);
  const ref = useRef<HTMLVideoElement>(null);

  const unmute = () => {
    setMuted(false);
    ref.current?.play();
  };

  return (
    <div className="relative">
      <video
        ref={ref}
        className="relative aspect-[9/16] w-full rounded-t-[10rem] rounded-b-[2.5rem] object-cover object-bottom shadow-xl"
        src={g("/video/promo.mp4")}
        poster={g("/video/promo-poster.jpg")}
        autoPlay
        muted={muted}
        loop
        playsInline
        preload="auto"
      />
      {muted && (
        <button
          type="button"
          onClick={unmute}
          aria-label="Play with sound"
          className="absolute bottom-6 right-6 flex items-center gap-2 rounded-full bg-black/60 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm transition-colors hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3Z" />
            <path
              d="M16 8.5a4.5 4.5 0 0 1 0 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M18.5 6a8 8 0 0 1 0 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          Tap for sound
        </button>
      )}
    </div>
  );
}

function Hero() {
  return (
    <section
      id="top"
      aria-label="Welcome"
      className="relative overflow-hidden bg-ivory"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-10%] h-[34rem] w-[34rem] rounded-full bg-sage-soft/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-12rem] left-[-8%] h-[28rem] w-[28rem] rounded-full bg-sand/70 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div>
          <p className="eyebrow">Boutique esthetician studio · Mission Valley + Chula Vista, San Diego</p>
          <h1 className="mt-5 font-display text-5xl font-medium leading-[1.05] tracking-tight text-gold-display sm:text-6xl lg:text-7xl">
            Fresh Face{" "}
            <span className="italic text-gold-display">Spa</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-mute">
            Corrective, results-driven skincare wrapped in slow, calming
            rituals. From acne and pigmentation to sensitivity and
            age management — your skin, thoughtfully cared for.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Book Now
            </a>
            <a href="#services" className="btn-ghost">
              Explore services
            </a>
          </div>
          <p className="mt-7 text-sm text-faint">
            Open every day, 10am – 7pm · by appointment
          </p>
        </div>
        <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
          <div
            aria-hidden="true"
            className="absolute -inset-3 rotate-[-2deg] rounded-t-[10rem] rounded-b-[2.5rem] bg-sand"
          />
          <HeroVideo />
          <p className="absolute -bottom-4 left-1/2 w-max -translate-x-1/2 rounded-full bg-white/90 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep shadow-sm ring-1 ring-line">
            Est. Mission Valley, San Diego
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- About ---------------------------------- */

function About() {
  return (
    <section id="about" className="bg-linen/60 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="eyebrow">About</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-tight tracking-tight text-gold-display sm:text-5xl">
              Skincare with a <span className="italic text-gold-display">gentle hand</span>
            </h2>
            <p className="mt-6 leading-relaxed text-mute">
              Fresh Face Spa is a boutique esthetician studio in San Diego's
              Mission Valley, owned and run by esthetician{" "}
              <strong className="font-semibold text-ink">Raquel Cartlidge</strong>.
              Every visit blends corrective, results-driven skincare with deeply
              relaxing technique — clear-skin goals met with slow, calming rituals.
            </p>
            <p className="mt-4 leading-relaxed text-mute">
              The studio's signature is <strong className="font-semibold text-ink">fascia facial massage</strong>:
              a gentle, sculpting massage that releases tension in the face, neck,
              and scalp for a softer, more lifted look — and a quieter nervous system.
            </p>

          </div>
          <div className="self-start rounded-3xl border border-line bg-white/80 p-7 sm:p-9">
            <p className="eyebrow">Focus areas</p>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2">
              {FOCUS_AREAS.map((f) => (
                <li key={f.title} className="flex gap-3">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    className="mt-1 h-4 w-4 shrink-0 text-sage"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Zm4.1 6.9a1 1 0 0 0-1.4-1.4L9 10.6 7.3 8.9a1 1 0 1 0-1.4 1.4l2.4 2.4a1 1 0 0 0 1.4 0l5-5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold text-gold">{f.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-mute">{f.copy}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex items-start gap-3 rounded-2xl bg-sage-soft/70 p-5">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="mt-0.5 h-5 w-5 shrink-0 text-sage-deep"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-gold">
                  Fascia facial massage
                </p>
                <p className="mt-1 text-sm leading-relaxed text-mute">
                  A studio signature — ask about adding it to any facial for a
                  lifted, de-tense finish.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <ClickablePhoto
            index={ABOUT_START + 0}
            label={`Open photo ${ABOUT_START + 0 + 1} of ${PG_PHOTOS.length} full size`}
            className="block w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay-deep focus-visible:ring-offset-2 rounded-2xl"
          >
            <img
              src={ABOUT_IMGS[0]}
              alt="Fresh Face Spa studio detail"
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] h-full w-full rounded-2xl object-cover"
            />
          </ClickablePhoto>
          <ClickablePhoto
            index={ABOUT_START + 1}
            label={`Open photo ${ABOUT_START + 1 + 1} of ${PG_PHOTOS.length} full size`}
            className="block w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay-deep focus-visible:ring-offset-2 rounded-2xl"
          >
            <img
              src={ABOUT_IMGS[1]}
              alt="Fresh Face Spa treatment room detail"
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] h-full w-full rounded-2xl object-cover"
            />
          </ClickablePhoto>
          <ClickablePhoto
            index={ABOUT_START + 2}
            label={`Open photo ${ABOUT_START + 2 + 1} of ${PG_PHOTOS.length} full size`}
            className="block w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay-deep focus-visible:ring-offset-2 overflow-hidden rounded-2xl"
          >
            <img
              src={ABOUT_IMGS[2]}
              alt="Fresh Face Spa studio detail"
              loading="lazy"
              decoding="async"
              className="block aspect-[4/5] h-full w-full object-contain"
            />
          </ClickablePhoto>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Services -------------------------------- */

function ServiceRow({ s }: { s: MenuService }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card !p-0 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-3xl"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="font-display text-xl font-medium text-gold sm:text-2xl">
              {s.name}
            </h3>
            {s.tag ? (
              <span className="shrink-0 rounded-full bg-sage-soft px-3 py-1 text-xs font-semibold text-gold">
                {s.tag}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-mute">
            {s.price}
            {s.duration ? ` · ${s.duration}` : ""}
          </p>
        </div>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className={`h-5 w-5 shrink-0 text-gold transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m5 7.5 5 5 5-5" />
        </svg>
      </button>
      {open ? (
        <div className="px-6 pb-6 pt-0">
          <p className="text-sm leading-relaxed text-mute">{s.copy}</p>
          {s.idealFor ? (
            <p className="mt-3 text-sm leading-relaxed text-mute">
              <span className="font-semibold text-ink">Ideal for:</span> {s.idealFor}
            </p>
          ) : null}
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-deep">
              Included in your treatment
            </p>
            <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
              {s.included.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-mute">
                  <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-sage" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {s.addOns.length > 0 ? (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-deep">
                Add-ons
              </p>
              <ul className="mt-2 space-y-1">
                {s.addOns.map((item) => (
                  <li key={item} className="text-sm text-mute">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {s.page ? (
            <Link
              to={s.page}
              className="mt-5 mr-6 inline-flex items-center gap-1.5 rounded text-sm font-semibold text-sage-deep transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
            >
              Full treatment details
            </Link>
          ) : null}
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition-colors hover:text-gold-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded"
          >
            Book this treatment
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 7h10v10M7 17 17 7" />
            </svg>
          </a>
        </div>
      ) : null}
    </div>
  );
}

function Services() {
  return (
    <section id="services" className="bg-ivory py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">Services</p>
          <h2 className="mt-4 font-display text-4xl font-medium leading-tight tracking-tight text-gold-display sm:text-5xl">
            Treatments for every <span className="italic text-gold-display">concern</span>
          </h2>
          <p className="mt-5 leading-relaxed text-mute">
            Every treatment starts with a conversation about your skin. Tap a
            treatment to see what's included.
          </p>
        </div>
        <figure className="mt-10 overflow-hidden rounded-3xl bg-sand">
          <ClickablePhoto
            index={4}
            label={`Open photo 5 of ${PG_PHOTOS.length} full size`}
            className="block w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay-deep focus-visible:ring-offset-2"
          >
            <img
              src={SERVICES_IMG}
              alt="Fresh Face Spa treatment space prepared for a facial"
              loading="lazy"
              decoding="async"
              className="h-auto w-full object-contain"
            />
          </ClickablePhoto>
        </figure>
        <div className="mt-12 space-y-4">
          {SERVICES.map((s) => (
            <ServiceRow key={s.name} s={s} />
          ))}
        </div>
        <div className="mt-8 card flex flex-col items-start justify-center border-dashed bg-transparent !p-7">
          <p className="text-sm font-semibold text-gold">Not sure where to start?</p>
          <p className="mt-2 text-sm leading-relaxed text-mute">
            Tell the concierge your skin concern — it'll point you to the
            right treatment in seconds.
          </p>
          <button
            type="button"
            onClick={() => document.getElementById("chat-launcher")?.click()}
            className="mt-5 text-left text-sm font-semibold text-gold underline-offset-4 hover:underline"
          >
            Ask the concierge
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Treatment guides ---------------------------- */

// Links to the dedicated treatment pages (and gift certificates). Keeps the
// three treatment pages one click from the home page.
function TreatmentGuides() {
  return (
    <section id="treatment-guides" aria-label="Treatment guides" className="bg-linen/60 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Treatment guides</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-tight tracking-tight text-gold-display sm:text-5xl">
              A closer look at <span className="italic text-gold-display">three facials</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-mute">
            What's included, who each one suits, and what it costs.
          </p>
        </div>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TREATMENTS.map((t) => (
            <li key={t.path}>
              <Link
                to={t.path}
                className="card block h-full !p-0 overflow-hidden transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              >
                <img
                  src={t.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="p-6">
                  <p className="font-display text-xl font-medium text-gold">{t.name}</p>
                  <p className="mt-2 text-sm leading-relaxed text-mute">{t.blurb}</p>
                  <p className="mt-4 text-sm font-semibold text-sage-deep">
                    {t.priceLine ?? "Pricing in the booking menu"}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------------------------- Gallery -------------------------------- */

function Gallery() {
  const { open, register } = usePhotosLightbox();

  return (
    <section id="gallery" aria-label="Studio gallery" className="bg-linen/60 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">The studio</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-tight tracking-tight text-gold-display sm:text-5xl">
              A calm place for <span className="italic text-gold-display">your skin</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-mute">
            Soft light, quiet rooms, and treatments that feel as good as they
            work.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-3 sm:hidden">
          {GALLERY_IMAGES.slice(0, 4).map((src, i) => (
            <button
              key={src}
              type="button"
              ref={(el) => register(GALLERY_START + i, el)}
              onClick={() => open(GALLERY_START + i)}
              aria-label={`Open photo ${GALLERY_START + i + 1} of ${PG_PHOTOS.length} full size`}
              className="block aspect-square cursor-pointer overflow-hidden rounded-3xl bg-linen text-left ring-1 ring-line/60 transition-shadow duration-300 hover:ring-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay-deep focus-visible:ring-offset-2 focus-visible:ring-offset-linen"
            >
              <img
                src={src}
                alt={`Photo ${GALLERY_START + i + 1} of the Fresh Face Spa studio and treatments`}
                loading="lazy"
                decoding="async"
                className="block h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
              />
            </button>
          ))}
        </div>
        <div className="mt-12 hidden gap-5 sm:columns-3 sm:[column-fill:balance] sm:block">
          {GALLERY_IMAGES.map((src, i) => (
            <button
              key={src}
              type="button"
              ref={(el) => register(GALLERY_START + i, el)}
              onClick={() => open(GALLERY_START + i)}
              aria-label={`Open photo ${GALLERY_START + i + 1} of ${PG_PHOTOS.length} full size`}
              className="mb-5 block w-full cursor-pointer break-inside-avoid overflow-hidden rounded-3xl bg-linen text-left ring-1 ring-line/60 transition-shadow duration-300 hover:ring-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay-deep focus-visible:ring-offset-2 focus-visible:ring-offset-linen"
            >
              <img
                src={src}
                alt={`Photo ${GALLERY_START + i + 1} of the Fresh Face Spa studio and treatments`}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full transition-transform duration-500 hover:scale-[1.03]"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- Process -------------------------------- */

// Loaded and played only once scrolled near, paused the moment it scrolls
// away — nobody on a phone plan should pay for two videos they never looked
// at. Respects prefers-reduced-motion by falling back to native controls
// instead of autoplaying, same courtesy as the rest of the page.
const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function ProcessVideo({
  src,
  poster,
  caption,
}: {
  src: string;
  poster: string;
  caption: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      setReduced(true);
      el.src = src;
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!el.src) el.src = src;
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src]);

  return (
    <div className="relative aspect-[9/16] overflow-hidden rounded-3xl bg-ink ring-1 ring-line/60">
      <video
        ref={ref}
        muted
        loop={!reduced}
        controls={reduced}
        playsInline
        preload="none"
        poster={poster}
        className="block h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent px-5 pb-4 pt-10 text-sm text-white">
        {caption}
      </div>
    </div>
  );
}

function Process() {
  return (
    <section id="process" aria-label="A treatment in motion" className="bg-linen/60 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">The process</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-tight tracking-tight text-gold-display sm:text-5xl">
              See a treatment <span className="italic text-gold-display">in motion</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-mute">
            A short look at the pace of a visit here &mdash; warm towels, unhurried
            hands, and the fascia facial massage that&rsquo;s become the studio&rsquo;s
            signature.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <ProcessVideo
            src={g("/video/process-1.mp4")}
            poster={g("/video/process-1-poster.jpg")}
            caption="Warm prep, before every treatment"
          />
          <ProcessVideo
            src={g("/video/process-2.mp4")}
            poster={g("/video/process-2-poster.jpg")}
            caption="Fascia facial massage, the studio signature"
          />
          <ProcessVideo
            src={g("/video/process-3.mp4")}
            poster={g("/video/process-3-poster.jpg")}
            caption="Poolside, outside the studio"
          />
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------- Hours --------------------------------- */

function Hours() {
  return (
    <section id="hours" className="bg-ivory py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="eyebrow">Hours</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-tight tracking-tight text-gold-display sm:text-5xl">
              Open <span className="italic text-gold-display">every day</span>
            </h2>
            <p className="mt-5 leading-relaxed text-mute">
              Fresh Face Spa is open all seven days, 10am to 7pm. Appointments
              are recommended — booking online takes less than a minute.
            </p>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-primary mt-8">
              Book an appointment
            </a>
          </div>
          <div className="card">
            <dl className="divide-y divide-line">
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <dt className="text-sm font-medium text-ink">{d}</dt>
                  <dd className="text-sm tabular-nums text-mute">10:00 AM – 7:00 PM</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- Contact -------------------------------- */

function Contact() {
  return (
    <section id="contact" className="bg-sage-deep pb-0 pt-20 text-ivory lg:pb-0 lg:pt-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-gold">
              Location & contact
            </p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-tight tracking-tight text-gold-display sm:text-5xl">
              Visit the <span className="italic text-gold-display">studio</span>
            </h2>
            <p className="mt-8 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-white">
              Mission Valley
            </p>
            <address className="mt-3 space-y-5 text-base not-italic leading-relaxed text-ivory/90">
              <p className="flex items-start gap-3">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="mt-0.5 h-5 w-5 shrink-0 text-sand"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=1640+Camino+Del+Rio+N+Ste+206+San+Diego+CA+92108"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 transition-colors hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-2 focus-visible:ring-offset-sage-deep rounded"
                >
                  1640 Camino Del Rio N, Ste 206, Rm 116
                  <br />
                  San Diego, CA 92108
                </a>
              </p>
              <p className="flex items-start gap-3">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="mt-0.5 h-5 w-5 shrink-0 text-sand"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
                </svg>
                <a
                  href="tel:+16197559045"
                  className="underline-offset-4 transition-colors hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-2 focus-visible:ring-offset-sage-deep rounded"
                >
                  (619) 755-9045
                </a>
              </p>
              <p className="flex items-start gap-3">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="mt-0.5 h-5 w-5 shrink-0 text-sand"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                <span>
                  Monday – Sunday · 10:00 AM – 7:00 PM
                </span>
              </p>
              <div className="mt-6 border-t border-ivory/15 pt-5">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-white">
                  Chula Vista
                </p>
                <p className="mt-2 flex items-start gap-3">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="mt-0.5 h-5 w-5 shrink-0 text-sand"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=940+Eastlake+Parkway+Suite+16+Chula+Vista+CA+91914"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-4 transition-colors hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-2 focus-visible:ring-offset-sage-deep rounded"
                  >
                    Sola Salon Studios
                    <br />
                    940 Eastlake Parkway, Suite 16
                    <br />
                    Chula Vista, CA 91914
                  </a>
                </p>
                <p className="mt-3 flex items-start gap-3">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="mt-0.5 h-5 w-5 shrink-0 text-sand"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                  <span>Open Sundays &amp; Mondays only</span>
                </p>
              </div>
            </address>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-gold-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-sage-deep"
            >
              Book an appointment
            </a>
          </div>

          <div className="self-start">
            <div className="card !border-ivory/15 !bg-white/10">
              <p className="eyebrow !text-white">FOLLOW ALONG</p>
            <h3 className="mt-4 font-display text-2xl font-medium text-white">
              Fresh Face Spa on social
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ivory/75">
              Treatment tips, before-and-afters, and studio moments on Instagram
              — follow along, or book a visit and see the studio yourself.
            </p>
            <ul className="mt-7 flex flex-wrap gap-3" aria-label="Social media">
              <li>
                <a
                  href="https://www.instagram.com/freshfacespasd?igsh=NTc4MTIwNjQ2YQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-ivory ring-1 ring-ivory/20 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-2 focus-visible:ring-offset-sage-deep"
                >
                  <InstagramIcon />
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/profile.php?id=61587966540511"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-ivory ring-1 ring-ivory/20 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-2 focus-visible:ring-offset-sage-deep"
                >
                  <FacebookIcon />
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@freshfacespasd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-ivory ring-1 ring-ivory/20 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-2 focus-visible:ring-offset-sage-deep"
                >
                  <TikTokIcon />
                  TikTok
                </a>
              </li>
            </ul>
              <p className="mt-7 border-t border-ivory/15 pt-5 text-xs leading-relaxed text-ivory/60">
                Booking is handled online — reservations open in a new window.
              </p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <ClickablePhoto
                index={CONTACT_START + 0}
                label={`Open photo ${CONTACT_START + 0 + 1} of ${PG_PHOTOS.length} full size`}
                className="block w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-2 focus-visible:ring-offset-sage-deep rounded-2xl"
              >
                <img
                  src={CONTACT_IMGS[0]}
                  alt="Fresh Face Spa studio detail"
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full rounded-2xl object-contain"
                />
              </ClickablePhoto>
              <ClickablePhoto
                index={CONTACT_START + 1}
                label={`Open photo ${CONTACT_START + 1 + 1} of ${PG_PHOTOS.length} full size`}
                className="block w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-2 focus-visible:ring-offset-sage-deep rounded-2xl"
              >
                <img
                  src={CONTACT_IMGS[1]}
                  alt="Fresh Face Spa studio detail"
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full rounded-2xl object-contain"
                />
              </ClickablePhoto>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
