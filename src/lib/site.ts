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
  | "/oxygen-glow-facial";

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
    priceLine: "$90",
    image: g("/gallery/18-P1029035.jpg"),
  },
  {
    path: "/male-facial",
    name: "Gentleman's Facial",
    fullName: "The Gentleman's Facial",
    blurb:
      "Tailored to men's skin — deep pore cleansing and calming hydration for shaving stress, congestion and environmental fatigue.",
    priceLine: "$125",
    image: g("/gallery/16-P1029029.jpg"),
  },
  {
    path: "/oxygen-glow-facial",
    name: "Oxygen Glow Facial",
    fullName: "Oxygen Glow Facial",
    blurb:
      "Oxygen-infused hydration and brightness for skin that looks tired, dull or freshly stressed.",
    priceLine: "$200 · 60 min",
    image: g("/gallery/27-P1029053.jpg"),
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
