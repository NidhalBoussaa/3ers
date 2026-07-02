"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

export type RevealVariant = "fade-up" | "rise" | "soft" | "gold-leaf" | "lines";

type Props = {
  children: ReactNode;
  className?: string;
  /** Stagger delay step. */
  delay?: 0 | 1 | 2 | 3 | 4;
  /** Motion vocabulary. Defaults to a quiet fade-up. */
  variant?: RevealVariant;
  /** Stagger direct children instead of animating the root as one. */
  stagger?: boolean;
  as?: "div" | "section" | "article" | "header" | "footer";
};

const DELAY_STEP = [0, 0.08, 0.18, 0.28, 0.38];

function fromState(variant: RevealVariant): gsap.TweenVars {
  switch (variant) {
    case "rise":
      return { opacity: 0, y: 24 };
    case "soft":
      return { opacity: 0, y: 16, filter: "blur(6px)" };
    case "gold-leaf":
      return { opacity: 0, y: 30, scale: 1.06, filter: "blur(8px)" };
    case "lines":
      return { opacity: 0, y: 18 };
    default:
      return { opacity: 0, y: 40 };
  }
}

function toState(variant: RevealVariant): gsap.TweenVars {
  switch (variant) {
    case "gold-leaf":
      return { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", ease: "power3.out" };
    case "soft":
    case "lines":
      return { opacity: 1, y: 0, filter: "blur(0px)", ease: "power2.out" };
    default:
      return { opacity: 1, y: 0, ease: "power3.out" };
  }
}

/** Wraps server-rendered content so it animates in when scrolled into view. */
export function Reveal({
  children,
  className = "",
  delay = 0,
  variant = "fade-up",
  stagger = false,
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const targets = stagger ? Array.from(el.children) : el;
        const duration = variant === "gold-leaf" ? 1.1 : 0.9;

        gsap.set(el, { opacity: 1 }); // clear FOUC guard
        gsap.fromTo(targets, fromState(variant), {
          ...toState(variant),
          duration,
          delay: DELAY_STEP[delay],
          stagger: stagger ? 0.1 : 0,
          scrollTrigger: { trigger: el, start: "top 82%", once: true },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(el, { opacity: 1, clearProps: "all" });
      });
    }, el);

    return () => ctx.revert();
  }, [variant, delay, stagger]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const T = Tag as any;
  return (
    <T ref={ref} className={`anim-init ${className}`.trim()}>
      {children}
    </T>
  );
}
