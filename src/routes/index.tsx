import { createFileRoute } from "@tanstack/react-router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

const YOCALE_URL = "https://www.yocale.com/widget/fresh-face-spa";

// Base path for asset URLs. Vite's `base` (import.meta.env.BASE_URL) is "/" for
// the SSR/live site, and "/fresh-face-spa/" for the GitHub Pages static build.
// All gallery image references MUST go through `g()` so they resolve correctly
// when the site is served from a subpath (e.g. https://<user>.github.io/fresh-face-spa/).
const g = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

const IMAGES = {
  hero: g("/gallery/9-P1029012.jpg"),
};

// Locally-hosted, optimized studio photos (copied from the uploaded JPGs into
// public/gallery and served by the site at /gallery/*).
const GALLERY_IMG_NAMES = [
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
  ...GALLERY_IMAGES, // 5-8 gallery
  ...CONTACT_IMGS, // 9-10 contact
];
const ABOUT_START = 1;
const GALLERY_START = 5;
const CONTACT_START = 9;

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#hours", label: "Hours" },
  { href: "#contact", label: "Contact" },
];

const FOCUS_AREAS = [
  { title: "Acne", copy: "Calming, congestion-clearing treatments that respect your barrier." },
  { title: "Pigmentation", copy: "Brightening exfoliation and renewal to even out tone." },
  { title: "Sensitivity", copy: "Gentle, fragrance-free rituals that soothe reactive skin." },
  { title: "Age management", copy: "Firming actives and massage for a rested, lifted look." },
];

const SERVICES = [
  {
    name: "Signature Facials",
    copy: "Bespoke facials tailored to your skin on the day — deep hydration, calming botanicals, and a glow you can feel.",
    tag: "Most loved",
  },
  {
    name: "Advanced Skin Treatments",
    copy: "Corrective, results-focused care for acne, pigmentation, and reactive skin — clinical-strength actives paired with gentle technique.",
    tag: null,
  },
  {
    name: "Back Facial",
    copy: "Deeply clean and de-stress the back and décolleté — a favorite for congestion, breakouts, and tension.",
    tag: null,
  },
  {
    name: "Exfoliation & Renewal",
    copy: "Targeted chemical and physical exfoliation that resurfaces, brightens, and preps skin to absorb more.",
    tag: null,
  },
  {
    name: "New Client Specials",
    copy: "A consultation-led first visit: personalized facial, honest skin assessment, and a plan you'll actually follow.",
    tag: null,
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

type ConcernId = "acne" | "pigmentation" | "sensitivity" | "aging" | "first";

const CONCERNS: {
  id: ConcernId;
  label: string;
  service: string;
  copy: string;
}[] = [
  {
    id: "acne",
    label: "Acne & breakouts",
    service: "Advanced Skin Treatments",
    copy: "Deep-clearing, congestion-focused work that calms active breakouts and gently exfoliates pores — finished with a soothing step so skin never feels stripped. Your esthetician tailors every pass to your skin's tolerance.",
  },
  {
    id: "pigmentation",
    label: "Pigmentation & dark spots",
    service: "Exfoliation & Renewal",
    copy: "Brightening exfoliation and renewal treatments that lift dullness and help fade sun spots and post-acne marks. A short series of visits usually shows the clearest progress.",
  },
  {
    id: "sensitivity",
    label: "Sensitive / reactive skin",
    service: "Signature Facials",
    copy: "A calm, hydrating facial built around gentle, fragrance-free products that soothe reactive skin and help rebuild its barrier — no harsh scrubs, no surprises.",
  },
  {
    id: "aging",
    label: "Aging & fine lines",
    service: "Signature Facials",
    copy: "Age-management facials pair firming actives and lymphatic technique with our signature fascia facial massage to support elasticity, tone, and a rested, lifted look.",
  },
  {
    id: "first",
    label: "First-time client",
    service: "New Client Specials",
    copy: "Book a New Client Special: we start with a consultation and a fully customized facial, then build a plan around your skin's goals — with take-home guidance after every visit.",
  },
];

/* --------------------------- Shared photo lightbox -------------------------- */
// One lightbox for EVERY photo on the page (hero, about, services, gallery,
// contact). Sections register their photos via usePhotosLightbox() and call
// open(index); the overlay is rendered once here in a portal to document.body.
// Reuses the same approach as the previous gallery-only lightbox: role="dialog"
// aria-modal, prev/next arrows, Escape/Arrow keys, Tab focus trap, focus restore
// to the clicked thumbnail, and body scroll lock.

const PhotosLightboxContext = createContext<{
  open: (i: number) => void;
  register: (i: number, el: HTMLButtonElement | null) => void;
} | null>(null);

function usePhotosLightbox() {
  const ctx = useContext(PhotosLightboxContext);
  if (!ctx) throw new Error("usePhotosLightbox must be used within PhotosLightboxProvider");
  return ctx;
}

// Wraps any <img> (with its own styling) in a button that opens the shared lightbox.
function ClickablePhoto({
  index,
  label,
  className,
  children,
}: {
  index: number;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const { open, register } = usePhotosLightbox();
  return (
    <button
      type="button"
      onClick={() => open(index)}
      ref={(el) => register(index, el)}
      aria-label={label}
      className={className}
    >
      {children}
    </button>
  );
}

function PhotosLightboxProvider({
  photos,
  children,
}: {
  photos: string[];
  children: ReactNode;
}) {
  const [active, setActive] = useState<number | null>(null);
  const activeRef = useRef<number | null>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const count = photos.length;

  const restoreFocus = useCallback(() => {
    const idx = activeRef.current;
    if (idx !== null) thumbRefs.current[idx]?.focus();
  }, []);

  const open = useCallback((i: number) => {
    activeRef.current = i;
    setActive(i);
  }, []);

  const close = useCallback(() => {
    restoreFocus();
    setActive(null);
  }, [restoreFocus]);

  const next = useCallback(
    () => setActive((a) => (a === null ? a : (a + 1) % count)),
    [count],
  );
  const prev = useCallback(
    () => setActive((a) => (a === null ? a : (a - 1 + count) % count)),
    [count],
  );

  const register = useCallback((i: number, el: HTMLButtonElement | null) => {
    thumbRefs.current[i] = el;
  }, []);

  useEffect(() => {
    if (active === null) return;
    activeRef.current = active;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [active, close, next, prev]);

  return (
    <PhotosLightboxContext.Provider value={{ open, register }}>
      {children}

      {active !== null &&
        createPortal(
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Photo ${active + 1} of ${count}`}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/85 p-4 sm:p-8"
            onClick={close}
          >
            {/* Close button */}
            <button
              ref={closeBtnRef}
              type="button"
              onClick={close}
              aria-label="Close photo"
              className="absolute right-4 top-4 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-ivory/15 text-2xl leading-none text-ivory backdrop-blur transition-colors hover:bg-ivory/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              ×
            </button>

            {/* Prev arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-ivory/15 text-3xl leading-none text-ivory backdrop-blur transition-colors hover:bg-ivory/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:left-4"
            >
              ‹
            </button>

            {/* Next arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-ivory/15 text-3xl leading-none text-ivory backdrop-blur transition-colors hover:bg-ivory/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:right-4"
            >
              ›
            </button>

            {/* Large image — same resolved src as the thumbnail; stopPropagation so
                a click on the image doesn't close */}
            <img
              src={photos[active]}
              alt={`Photo ${active + 1} of the Fresh Face Spa studio and treatments`}
              onClick={(e) => e.stopPropagation()}
              className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl ring-1 ring-line/30"
            />

            {/* Counter */}
            <p className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 text-sm tabular-nums text-ivory/85">
              {active + 1} / {count}
            </p>
          </div>,
          document.body,
        )}
    </PhotosLightboxContext.Provider>
  );
}

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <PhotosLightboxProvider photos={PG_PHOTOS}>
      <div className="min-h-dvh bg-ivory text-ink">
        <Header />
        <main>
          <Hero />
          <About />
          <Services />
          <Gallery />
          <Hours />
          <Contact />
        </main>
        <Footer />
        <ChatWidget />
      </div>
    </PhotosLightboxProvider>
  );
}

/* ---------------------------------- Header --------------------------------- */

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-ivory/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <a
          href="#top"
          className="font-display text-xl font-semibold tracking-tight text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay-deep focus-visible:ring-offset-2 rounded"
        >
          Fresh Face <span className="italic text-gold">Spa</span>
        </a>
        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="nav-link">
              {l.label}
            </a>
          ))}
        </nav>
        <a href={YOCALE_URL} target="_blank" rel="noopener noreferrer" className="btn-primary !px-5 !py-2.5">
          Book Now
        </a>
      </div>
    </header>
  );
}

/* ----------------------------------- Hero ---------------------------------- */

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
            <a href={YOCALE_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
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
          <ClickablePhoto
            index={0}
            label={`Open photo 1 of ${PG_PHOTOS.length} full size`}
            className="relative block w-full cursor-pointer rounded-t-[10rem] rounded-b-[2.5rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay-deep focus-visible:ring-offset-2"
          >
            <img
              src={IMAGES.hero}
              alt="The calm, softly lit treatment room at Fresh Face Spa"
              fetchPriority="high"
              className="relative aspect-[4/5] w-full rounded-t-[10rem] rounded-b-[2.5rem] object-cover shadow-xl"
            />
          </ClickablePhoto>
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
            Every treatment starts with a conversation about your skin. Prices
            and times vary by visit — the Back Facial is a studio favorite at
            $80 for 60 minutes.
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
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <article
              key={s.name}
              className="card flex flex-col transition-shadow duration-200 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-2xl font-medium text-gold">
                  {s.name}
                </h3>
                {s.tag ? (
                  <span className="shrink-0 rounded-full bg-sage-soft px-3 py-1 text-xs font-semibold text-gold">
                    {s.tag}
                  </span>
                ) : null}
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-mute">
                {s.copy}
              </p>
              <a
                href={YOCALE_URL}
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
            </article>
          ))}
          <article className="card flex flex-col justify-center border-dashed bg-transparent !p-7">
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
          </article>
        </div>
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
        <div className="mt-12 columns-2 gap-5 sm:columns-3 lg:columns-4 [column-fill:balance]">
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
            <a href={YOCALE_URL} target="_blank" rel="noopener noreferrer" className="btn-primary mt-8">
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
                <span>
                  1640 Camino Del Rio N, Ste 206, Rm 116
                  <br />
                  San Diego, CA 92108
                </span>
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
                  <span>
                    940 Eastlake Parkway, Suite 16
                    <br />
                    Chula Vista, CA 91914
                  </span>
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
              href={YOCALE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-gold-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-sage-deep"
            >
              Book on Yocale
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
            </ul>
              <p className="mt-7 border-t border-ivory/15 pt-5 text-xs leading-relaxed text-ivory/60">
                Booking is handled through Yocale — the only place to reserve your
                appointment.
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

/* ---------------------------------- Footer --------------------------------- */

function Footer() {
  return (
    <footer className="border-t border-line bg-ivory py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-5 text-center sm:px-8 md:flex-row md:text-left">
        <div>
          <p className="font-display text-lg font-semibold text-gold">
            Fresh Face <span className="italic text-gold">Spa</span>
          </p>
          <p className="mt-1 text-sm text-mute">
            Boutique esthetician studio · Mission Valley, San Diego
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-6 text-sm text-mute">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="nav-link">
              {l.label}
            </a>
          ))}
          <a
            href={YOCALE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link font-semibold text-gold"
          >
            Book Now
          </a>
        </nav>
        <p className="text-sm text-faint">© {new Date().getFullYear()} Fresh Face Spa</p>
      </div>
    </footer>
  );
}

/* -------------------------------- Chat widget ------------------------------- */

const CHAT_OPTIONS: { id: ConcernId; label: string }[] = CONCERNS.map((c) => ({
  id: c.id,
  label: c.label,
}));

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [chosen, setChosen] = useState<ConcernId | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => {
        panelRef.current?.querySelector<HTMLElement>("[data-chat-close]")?.focus();
      }, 50);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        setOpen(false);
        launcherRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => {
    setOpen(false);
    launcherRef.current?.focus();
  };

  const reset = () => setChosen(null);
  const recommendation = chosen ? CONCERNS.find((c) => c.id === chosen) : null;

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        id="chat-launcher"
        aria-label="Chat with us — get a treatment recommendation"
        aria-expanded={open}
        aria-controls="chat-panel"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-sage-deep text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay-deep focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
      >
        <span className="sr-only">Chat with us</span>
        {open ? (
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
          </svg>
        )}
      </button>

      {open ? (
        <div
          ref={panelRef}
          id="chat-panel"
          role="dialog"
          aria-modal="false"
          aria-label="Fresh Face Spa skin concierge"
          className="fixed bottom-24 right-4 left-4 z-50 flex max-h-[70dvh] flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-2xl sm:left-auto sm:w-[22.5rem]"
        >
          <div className="flex items-center justify-between gap-3 bg-sage-deep px-5 py-4 text-ivory">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-lg"
              >
                ✦
              </span>
              <div>
                <p className="font-display text-base font-semibold leading-tight text-gold">
                  Fresh Face Spa
                </p>
                <p className="text-xs text-ivory/80">Skin concierge · replies instantly</p>
              </div>
            </div>
            <button
              type="button"
              data-chat-close
              aria-label="Close chat"
              onClick={close}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ivory/85 transition-colors hover:bg-white/15 hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-2 focus-visible:ring-offset-sage-deep"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div
            aria-live="polite"
            className="flex-1 space-y-3 overflow-y-auto bg-linen/50 px-4 py-4"
          >
            <p className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm leading-relaxed text-ink shadow-sm ring-1 ring-line">
              Hi, I'm the Fresh Face Spa concierge 🌿 Tell me your main skin
              concern and I'll recommend the right treatment.
            </p>

            {!chosen ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {CHAT_OPTIONS.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setChosen(o.id)}
                    className="rounded-full border border-sage/40 bg-white px-4 py-2 text-sm font-medium text-sage-deep transition-colors hover:bg-sage-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay-deep focus-visible:ring-offset-2"
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            ) : recommendation ? (
              <>
                <p className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-sage-deep px-4 py-3 text-sm leading-relaxed text-ivory">
                  {recommendation.label}
                </p>
                <div className="max-w-[92%] rounded-2xl rounded-tl-sm bg-white px-4 py-4 shadow-sm ring-1 ring-line">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">
                    I recommend
                  </p>
                  <p className="mt-1.5 font-display text-lg font-semibold text-gold">
                    {recommendation.service}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-mute">
                    {recommendation.copy}
                  </p>
                  <a
                    href={YOCALE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                  >
                    Book this on Yocale
                  </a>
                </div>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={reset}
                    className="text-xs font-semibold text-gold underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
                  >
                    Ask about another concern
                  </button>
                </div>
              </>
            ) : null}
          </div>

          <p className="border-t border-line bg-white px-4 py-2.5 text-center text-[0.68rem] text-faint">
            Booking happens on Yocale · no account needed
          </p>
        </div>
      ) : null}
    </>
  );
}

/* ---------------------------------- Icons ---------------------------------- */

function InstagramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

