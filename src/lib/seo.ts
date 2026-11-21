import { SITE_URL } from "~/lib/site";

type MetaEntry = {
  title?: string;
  name?: string;
  content?: string;
  property?: string;
  charSet?: string;
};

type LinkEntry = { rel: string; href: string };

// Per-page <title>, meta description, Open Graph tags and canonical URL.
// `image` is a site-relative path such as g("/gallery/…") — it is made absolute
// against SITE_URL for og:image.
export function pageHead({
  title,
  description,
  path,
  image,
  imageAlt,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
}): { meta: MetaEntry[]; links: LinkEntry[] } {
  const url = `${SITE_URL}${path}`;
  const meta: MetaEntry[] = [
    { title },
    { name: "description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
  ];
  if (image) {
    meta.push({ property: "og:image", content: `${SITE_URL}${image}` });
  }
  if (imageAlt) {
    meta.push({ property: "og:image:alt", content: imageAlt });
  }
  return { meta, links: [{ rel: "canonical", href: url }] };
}
