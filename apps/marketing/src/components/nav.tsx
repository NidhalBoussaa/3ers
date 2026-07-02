"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * No nav on load — the entrance belongs to the film. The bar slides in once
 * the reader leaves the fold, on a night-ink glass.
 */
const LINKS = [
  { href: "#experience", label: "L'expérience" },
  { href: "#actes", label: "Les actes" },
  { href: "#formules", label: "Les formules" },
  { href: "#questions", label: "Questions" },
];

export function Nav() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(el, { yPercent: -110 });
        ScrollTrigger.create({
          start: () => window.innerHeight * 0.85,
          onEnter: () => gsap.to(el, { yPercent: 0, duration: 0.6, ease: "power3.out" }),
          onLeaveBack: () => gsap.to(el, { yPercent: -110, duration: 0.5, ease: "power2.in" }),
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(el, { yPercent: 0 });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={ref}
      className="fixed inset-x-0 top-0 z-50 border-b border-gold/15 bg-night/85 backdrop-blur-md"
    >
      <nav className="mx-auto flex h-[68px] max-w-6xl items-center justify-between gap-6 px-5">
        <a href="#" className="font-cinzel text-lg font-semibold tracking-[0.3em] text-gold-soft">
          3<span className="text-gold-bright">e</span>rs
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="font-body text-[1.02rem] italic text-champagne/85 transition-colors duration-300 hover:text-gold-bright"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#demande"
          className="btn-gold whitespace-nowrap !px-4 !py-3 !text-[9px] !tracking-[0.16em] sm:!px-6 sm:!text-[10px] sm:!tracking-[0.24em]"
        >
          Demander votre invitation
        </a>
      </nav>
    </header>
  );
}
