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

/* --------------------------- Shared photo lightbox -------------------------- */
// One lightbox for EVERY photo on the home page (hero, about, services, gallery,
// contact). Sections register their photos via usePhotosLightbox() and call
// open(index); the overlay is rendered once here in a portal to document.body.
// role="dialog" aria-modal, prev/next arrows, Escape/Arrow keys, Tab focus trap,
// focus restore to the clicked thumbnail, and body scroll lock.

const PhotosLightboxContext = createContext<{
  open: (i: number) => void;
  register: (i: number, el: HTMLButtonElement | null) => void;
} | null>(null);

export function usePhotosLightbox() {
  const ctx = useContext(PhotosLightboxContext);
  if (!ctx) throw new Error("usePhotosLightbox must be used within PhotosLightboxProvider");
  return ctx;
}

// Wraps any <img> (with its own styling) in a button that opens the shared lightbox.
export function ClickablePhoto({
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

export function PhotosLightboxProvider({
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
            <button
              ref={closeBtnRef}
              type="button"
              onClick={close}
              aria-label="Close photo"
              className="absolute right-4 top-4 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-ivory/15 text-2xl leading-none text-ivory backdrop-blur transition-colors hover:bg-ivory/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              ×
            </button>

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

            <img
              src={photos[active]}
              alt={`Photo ${active + 1} of the Fresh Face Spa studio and treatments`}
              onClick={(e) => e.stopPropagation()}
              className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl ring-1 ring-line/30"
            />

            <p className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 text-sm tabular-nums text-ivory/85">
              {active + 1} / {count}
            </p>
          </div>,
          document.body,
        )}
    </PhotosLightboxContext.Provider>
  );
}
