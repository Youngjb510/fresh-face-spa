// Shared site data: booking link, canonical origin, image helper, nav links,
// the treatment pages, and the concierge concern list. Every route imports from
// here so the header, footer, chat widget and cross-links stay in one place.

// The studio's only external CTA. Booking is handled by Yocale.
export const BOOKING_URL =
  "https://www.yocale.com/widget/fresh-face-spa?locations=170951";

// Canonical origin used for <link rel="canonical"> and public/sitemap.xml.
export const SITE_URL = "https://freshfacespasd.com";

export const PHONE_DISPLAY = "(619) 755-9045";
export const PHONE_HREF = "tel:+16197559045";

// Social proof. The count is the studio's own figure; the link goes to the
// Google Business Profile for the Mission Valley studio. No aggregateRating
// markup is emitted for this — it's a plain, human-readable claim.
export const GOOGLE_REVIEWS_LINE = "79 five-star Google reviews";
export const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/place/Fresh+Face+Spa/data=!4m7!3m6!1s0x80d955b1233bf29d:0xf2f7c7f3340d5807!8m2!3d32.7689677!4d-117.1488894!16s%2Fg%2F11ms649xf9";

// Base path for asset URLs. Vite's `base` (import.meta.env.BASE_URL) is "/" for
// the SSR/live site, and "/fresh-face-spa/" for a GitHub Pages project-page
// build. All gallery image references MUST go through `g()` so they resolve
// correctly either way.
export const g = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

export type ConcernId = "acne" | "pigmentation" | "sensitivity" | "aging";

export const CONCERNS: {
  id: ConcernId;
  label: string;
  service: string;
  copy: string;
}[] = [
  {
    id: "acne",
    label: "Acne & breakouts",
    service: "Customized Facial",
    copy: "A personalized facial built around your skin. Your esthetician tailors the deep cleanse, gentle exfoliation and extractions to calm active breakouts and clear congested pores, finishing with a soothing step so skin never feels stripped.",
  },
  {
    id: "pigmentation",
    label: "Pigmentation & dark spots",
    service: "Liquid Microneedling (needle-less)",
    copy: "Brightening exfoliation and renewal treatments that lift dullness and help fade sun spots and post-acne marks. A short series of visits usually shows the clearest progress.",
  },
  {
    id: "sensitivity",
    label: "Sensitive / reactive skin",
    service: "Customized Facial",
    copy: "A calm, hydrating facial built around gentle, fragrance-free products that soothe reactive skin and help rebuild its barrier — no harsh scrubs, no surprises.",
  },
  {
    id: "aging",
    label: "Aging & fine lines",
    service: "Firming Peptide Facial",
    copy: "Age-management facials pair firming actives and lymphatic technique with our signature fascia facial massage to support elasticity, tone, and a rested, lifted look.",
  },
];

/* ------------------------------ Treatment pages ----------------------------- */

export type TreatmentPath =
  | "/teen-facial"
  | "/male-facial"
  | "/oxygen-glow-facial"
  | "/customized-facial"
  | "/hydra-glow-facial"
  | "/firming-peptide-facial"
  | "/dermaplaning-facial"
  | "/chemical-peel-facial"
  | "/microdermabrasion"
  | "/liquid-microneedling"
  | "/bio-skin-peel"
  | "/back-facial";

export type TreatmentLink = {
  path: TreatmentPath;
  /** Short name used in nav, cards and cross-links. */
  name: string;
  /** Longer name used in the booking menu / page headline. */
  fullName: string;
  /** One-line description for the cards. */
  blurb: string;
  /** "$125 · 90 min", "$90", or null when the studio hasn't set it yet. */
  priceLine: string | null;
  image: string;
};

// OWNER-EDITABLE: priceLine drives the price shown on cards, pages and
// cross-links. Fill in a duration (e.g. "$125 · 60 min") once the studio sets
// one and the pages pick it up everywhere.
export const TREATMENTS: TreatmentLink[] = [
  {
    path: "/teen-facial",
    name: "Teen Facial",
    fullName: "Teen Clarifying Facial",
    blurb:
      "Gentle, clarifying care for adolescent skin dealing with hormonal shifts, excess oil and early breakouts.",
    priceLine: "$90 · 60 min",
    image: g("/gallery/39-P1029083.jpg"),
  },
  {
    path: "/male-facial",
    name: "Gentleman's Facial",
    fullName: "The Gentleman's Facial",
    blurb:
      "Tailored to men's skin — deep pore cleansing and calming hydration for shaving stress, congestion and environmental fatigue.",
    priceLine: "$125 · 70 min",
    image: g("/gallery/18-P1029035.jpg"),
  },
  {
    path: "/oxygen-glow-facial",
    name: "Oxygen Glow Facial",
    fullName: "Oxygen Glow Facial",
    blurb:
      "Oxygen-infused hydration and brightness for skin that looks tired, dull or freshly stressed.",
    priceLine: "$200 · 60 min",
    image: g("/gallery/38-P1029082.jpg"),
  },
  {
    path: "/customized-facial",
    name: "Customized Facial",
    fullName: "Customized Facial",
    blurb:
      "Tailored specifically to your skin's unique needs. This fully personalized treatment delivers maximum results by addressing your specific concern.",
    priceLine: "$125 · 60 min",
    image: g("/gallery/21-P1029043.jpg"),
  },
  {
    path: "/hydra-glow-facial",
    name: "Hydra Glow Facial",
    fullName: "Hydra Glow Facial",
    blurb:
      "Experience the ultimate deep cleanse and instant glow with our advanced hydro-dermabrasion treatment.",
    priceLine: "$175 · 70 min",
    image: g("/gallery/29-P1029055.jpg"),
  },
  {
    path: "/firming-peptide-facial",
    name: "Firming Peptide Facial",
    fullName: "Firming Peptide Facial",
    blurb:
      "Renew, rebuild and lift aging or sluggish skin with this advanced anti-aging treatment.",
    priceLine: "$135 · 70 min",
    image: g("/gallery/19-P1029040.jpg"),
  },
  {
    path: "/dermaplaning-facial",
    name: "Dermaplaning Facial with Peel",
    fullName: "Dermaplaning Facial with Peel",
    blurb:
      "Reveal your smoothest, most radiant complexion with this high performance dual treatment.",
    priceLine: "$200 · 70 min",
    image: g("/gallery/26-P1029048.jpg"),
  },
  {
    path: "/chemical-peel-facial",
    name: "Chemical Peel with Facial",
    fullName: "Chemical Peel with Facial",
    blurb:
      "Combine the ultimate relaxation with clinical grade resurfacing — a classic facial paired with an advanced chemical peel.",
    priceLine: "$175 · 70 min",
    image: g("/gallery/20-P1029042.jpg"),
  },
  {
    path: "/microdermabrasion",
    name: "Microdermabrasion",
    fullName: "Microdermabrasion",
    blurb:
      "Refresh and polish your skin with this advanced physical exfoliation treatment.",
    priceLine: "$135 · 60 min",
    image: g("/gallery/23-P1029045.jpg"),
  },
  {
    path: "/liquid-microneedling",
    name: "Liquid Microneedling",
    fullName: "Liquid Microneedling (needle-free)",
    blurb:
      "Our Bio micro needling — 10 million spicules — for collagen production and skin rejuvenation.",
    priceLine: "$175 · 70 min",
    image: g("/gallery/24-P1029046.jpg"),
  },
  {
    path: "/bio-skin-peel",
    name: "Bio Skin Peel",
    fullName: "No Peel, Peel — Bio Skin",
    blurb:
      "Maximum skin transformation with zero downtime — a 35% TCA biphasic peel that works within deeper layers of the skin.",
    priceLine: "$225 · length in booking menu",
    image: g("/gallery/28-P1029054.jpg"),
  },
  {
    path: "/back-facial",
    name: "Back Facial",
    fullName: "Back Facial",
    blurb:
      "Treat a hard-to-reach area to the same deep-cleansing and skin-refining care as a classic facial.",
    priceLine: "$80 · 60 min",
    image: g("/gallery/pool-2.jpg"),
  },
];

export const GIFT_CERTIFICATES_PATH = "/gift-certificates";

export const treatmentByPath = (path: string) =>
  TREATMENTS.find((t) => t.path === path);

/* --------------------------------- Navigation -------------------------------- */

// Anchor targets on the home page. Subpages prefix them with "/" so they jump
// back to the home page section.
export const ANCHOR_LINKS = [
  { hash: "top", label: "Home" },
  { hash: "services", label: "Services" },
  { hash: "gallery", label: "Gallery" },
  { hash: "contact", label: "Contact" },
];
