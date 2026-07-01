"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  className?: string;
  /** Layout classes applied to the inner content wrapper (e.g. flex rows). */
  contentClassName?: string;
  /** Stagger index — offsets the draw so cards in a row reveal in sequence. */
  index?: number;
  /** Tighter padding + smaller brackets for compact rows (e.g. program). */
  dense?: boolean;
};

/**
 * Couture "corner-bracket" card: no border, no border-radius — just four
 * gold L-brackets that draw themselves on scroll-in and ease outward on hover.
 * The surface is a soft cream wash that fades up beneath the drawn frame.
 */
export function LuxeCard({
  children,
  className = "",
  contentClassName = "",
  index = 0,
  dense = false,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      const corners = Array.from(el.querySelectorAll<SVGPathElement>(".lx-corner"));
      const surface = el.querySelector<HTMLElement>(".lx-surface");

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(el, { opacity: 1 }); // clear FOUC guard

        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 84%", once: true },
          delay: index * 0.12,
        });

        // 1 — surface fades + lifts into place
        if (surface) {
          tl.fromTo(
            surface,
            { opacity: 0, y: 26, filter: "blur(6px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power3.out" },
            0,
          );
        }

        // 2 — the four L-brackets draw themselves in
        if (corners.length) {
          tl.fromTo(
            corners,
            { strokeDashoffset: (i, t) => (t as SVGPathElement).getTotalLength() },
            {
              strokeDashoffset: 0,
              duration: 0.75,
              ease: "power2.inOut",
              stagger: 0.06,
            },
            0.25,
          );
        }

        // 3 — content within the surface settles last
        tl.fromTo(
          el.querySelectorAll(".lx-content > *"),
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.07 },
          0.55,
        );
      });

      // Reduced motion: everything drawn + visible, no transforms.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(el, { opacity: 1 });
        gsap.set(corners, { strokeDashoffset: 0 });
        gsap.set([surface, ...el.querySelectorAll(".lx-content > *")], {
          opacity: 1,
          clearProps: "transform,filter",
        });
      });
    }, el);

    return () => ctx.revert();
  }, [index]);

  const pad = dense ? "px-6 py-5" : "px-7 py-9";
  // short vertical hook height, as a % of card height in the 0..100 viewBox.
  // Dense rows are shorter, so the hook needs a larger % to read the same.
  const hook = dense ? 34 : 22;

  return (
    <div
      ref={ref}
      className={`anim-init group relative ${pad} ${className}`}
    >
      {/* soft surface wash — fades up under the frame, no radius/border */}
      <span
        aria-hidden
        className="lx-surface pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-[#fffdf8]/85 to-[#f4ecd9]/70 shadow-[0_24px_50px_-30px_rgba(110,84,30,.5)]"
      />

      {/* two extended L-brackets — long arm along the top + bottom edges,
          short vertical hook at one end. Drawn on scroll, open on hover. */}
      <Brackets hook={hook} />

      <div className={`lx-content relative ${contentClassName}`.trim()}>{children}</div>
    </div>
  );
}

/**
 * Two long L-brackets, diagonally opposed:
 *   top edge  →  short hook up at the right end, long arm sweeping left  (‾‾‾‾⌐ mirror)
 *   bottom    →  short hook down at the left end, long arm sweeping right (L____)
 * The horizontal arm runs the full width; only the vertical hook is short.
 */
function Brackets({ hook }: { hook: number }) {
  // viewBox is 0..100 wide, 0..100 tall; preserveAspectRatio none lets the
  // horizontal run stretch to the card while the vertical hook stays crisp.
  const top = `M100 ${hook} L100 0 L0 0`; // hook up at right, line left along top
  const bottom = `M0 ${100 - hook} L0 100 L100 100`; // hook down at left, line right along bottom

  return (
    <>
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 size-full overflow-visible transition-transform duration-500 ease-out group-hover:-translate-y-1"
      >
        <path
          d={top}
          className="lx-corner"
          fill="none"
          stroke="var(--gold)"
          strokeWidth={1.4}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 size-full overflow-visible transition-transform duration-500 ease-out group-hover:translate-y-1"
      >
        <path
          d={bottom}
          className="lx-corner"
          fill="none"
          stroke="var(--gold)"
          strokeWidth={1.4}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </>
  );
}
