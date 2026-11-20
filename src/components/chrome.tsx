import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import {
  ANCHOR_LINKS,
  BOOKING_URL,
  CONCERNS,
  GIFT_CERTIFICATES_PATH,
  PHONE_DISPLAY,
  PHONE_HREF,
} from "~/lib/site";
import type { ConcernId } from "~/lib/site";

/* ---------------------------------- Header --------------------------------- */

export function SiteHeader({ onHome = false }: { onHome?: boolean }) {
  // Anchors point at the home page: bare "#services" on the home page itself,
  // "/#services" from a subpage so the browser goes back to the section.
  const anchorHref = (hash: string) => (onHome ? `#${hash}` : `/#${hash}`);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-ivory/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          to="/"
          className="rounded font-display text-xl font-semibold tracking-tight text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay-deep focus-visible:ring-offset-2"
        >
          Fresh Face <span className="italic text-gold">Spa</span>
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {ANCHOR_LINKS.map((l) => (
            <a key={l.hash} href={anchorHref(l.hash)} className="nav-link">
              {l.label}
            </a>
          ))}
          <Link to={GIFT_CERTIFICATES_PATH} className="nav-link">
            Gift Certificates
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to={GIFT_CERTIFICATES_PATH}
            className="hidden rounded text-sm font-semibold text-gold underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 sm:inline"
          >
            Gift Certificates
          </Link>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary !px-5 !py-2.5"
          >
            Book Now
          </a>
        </div>
      </div>
    </header>
  );
}

/* ---------------------------------- Footer --------------------------------- */

export function SiteFooter({ onHome = false }: { onHome?: boolean }) {
  const anchorHref = (hash: string) => (onHome ? `#${hash}` : `/#${hash}`);

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
        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center justify-center gap-6 text-sm text-mute"
        >
          {ANCHOR_LINKS.map((l) => (
            <a key={l.hash} href={anchorHref(l.hash)} className="nav-link">
              {l.label}
            </a>
          ))}
          <Link to={GIFT_CERTIFICATES_PATH} className="nav-link">
            Gift Certificates
          </Link>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link font-semibold text-gold"
          >
            Book Now
          </a>
        </nav>
        <p className="text-sm text-faint">
          © {new Date().getFullYear()} Fresh Face Spa
        </p>
      </div>
    </footer>
  );
}

/* ---------------------------------- Shell ---------------------------------- */

// Shared chrome for every route: header, page content, footer, chat widget.
export function SiteShell({
  children,
  onHome = false,
}: {
  children: React.ReactNode;
  onHome?: boolean;
}) {
  return (
    <div className="min-h-dvh bg-ivory text-ink">
      <SiteHeader onHome={onHome} />
      <main>{children}</main>
      <SiteFooter onHome={onHome} />
      <ChatWidget />
    </div>
  );
}

/* -------------------------------- Chat widget ------------------------------- */

const CHAT_OPTIONS: { id: ConcernId; label: string }[] = CONCERNS.map((c) => ({
  id: c.id,
  label: c.label,
}));

export function ChatWidget() {
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
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
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
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
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
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                  >
                    Book this treatment
                  </a>
                </div>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={reset}
                    className="rounded text-xs font-semibold text-gold underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    Ask about another concern
                  </button>
                </div>
              </>
            ) : null}
          </div>

          <p className="border-t border-line bg-white px-4 py-2.5 text-center text-[0.68rem] text-faint">
            Booking is quick and easy · no account needed
          </p>
        </div>
      ) : null}
    </>
  );
}

/* ---------------------------------- Icons ---------------------------------- */

export function FacebookIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.878h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94z" />
    </svg>
  );
}

export function TikTokIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M16.6 5.82c-1.0-.973-1.549-2.278-1.549-3.82h-3.117v13.34c0 1.548-1.257 2.805-2.805 2.805s-2.805-1.257-2.805-2.805 1.257-2.805 2.805-2.805c.31 0 .607.05.887.144V9.474a5.94 5.94 0 0 0-.887-.066C5.735 9.408 3 12.143 3 15.538S5.735 21.667 9.13 21.667s6.13-2.735 6.13-6.13V8.507a8.94 8.94 0 0 0 5.226 1.678v-3.34a5.31 5.31 0 0 1-3.886-1.024z" />
    </svg>
  );
}

export function InstagramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

/* ------------------------------ Contact blocks ------------------------------ */

export function PhoneLink({ className = "" }: { className?: string }) {
  return (
    <a href={PHONE_HREF} className={className}>
      {PHONE_DISPLAY}
    </a>
  );
}
