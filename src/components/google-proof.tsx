import { GOOGLE_REVIEWS_LINE, GOOGLE_REVIEWS_URL } from "~/lib/site";

// Small, quiet social-proof line: five stars plus the studio's review count,
// linking out to the Google Business Profile. Used next to the booking CTAs.
export function GoogleProof({
  tone = "light",
  className = "",
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const colour = tone === "dark" ? "text-ivory/75" : "text-faint";
  const hover = tone === "dark" ? "hover:text-ivory" : "hover:text-gold";

  return (
    <a
      href={GOOGLE_REVIEWS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded text-sm ${colour} transition-colors ${hover} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${className}`}
    >
      <span aria-hidden="true" className="flex gap-0.5 text-gold">
        {[0, 1, 2, 3, 4].map((i) => (
          <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
            <path d="M10 1.6l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.2l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.6z" />
          </svg>
        ))}
      </span>
      <span className="font-medium">{GOOGLE_REVIEWS_LINE}</span>
    </a>
  );
}
