"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/** Gold ornamental divider with a centre diamond. GSAP draws its stroke on scroll. */
export function Ornament({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const lines = el.querySelectorAll<SVGElement>("line");
    const diamond = el.querySelector<SVGElement>(".diamond");

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
        tl.fromTo(
          lines,
          { strokeDashoffset: 300 },
          { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" },
        );
        if (diamond) {
          tl.fromTo(
            diamond,
            { opacity: 0, scale: 0, transformOrigin: "100px 12px" },
            { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(2)" },
            "-=0.5",
          );
        }
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(lines, { strokeDashoffset: 0 });
        if (diamond) gsap.set(diamond, { opacity: 1, scale: 1 });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <svg ref={ref} className={`orn ${className}`.trim()} viewBox="0 0 200 24" aria-hidden="true">
      <line x1="0" y1="12" x2="84" y2="12" />
      <line x1="116" y1="12" x2="200" y2="12" />
      <path d="M84 12 L100 4 L116 12 L100 20 Z" className="diamond" />
    </svg>
  );
}
