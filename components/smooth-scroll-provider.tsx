"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useI18n } from "@/lib/i18n";

type ScrollTo = (
  target: number | string | HTMLElement,
  opts?: { offset?: number; duration?: number },
) => void;

const SmoothScrollContext = createContext<{ scrollTo: ScrollTo }>({
  scrollTo: () => {},
});

/** Read the active Lenis instance to drive assisted scrolls (e.g. the hero scroll cue). */
export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

/**
 * Owns the single Lenis instance and the GSAP <-> Lenis ticker bridge.
 * Drives native window scroll (no wrapper) so every position:fixed layer
 * (dust, petals, dock, intro overlay) stays correct untouched.
 * Scroll is held until the envelope intro finishes (introDone).
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const { introDone } = useI18n();
  const lenisRef = useRef<Lenis | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Respect reduced motion: skip smooth scroll entirely, native scrolling stays.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setReady(true);
      return;
    }

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    // Hold the page still until the intro overlay is gone.
    lenis.stop();

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Document height shifts on language switch (data-lang visibility), font swap,
    // and media load — keep ScrollTrigger positions honest.
    let raf = 0;
    const refresh = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    const ro = new ResizeObserver(refresh);
    ro.observe(document.body);

    setReady(true);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // Start / stop Lenis with the intro lifecycle.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (introDone) lenis.start();
    else lenis.stop();
  }, [introDone, ready]);

  const scrollTo: ScrollTo = (target, opts) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.2, ...opts });
    } else if (typeof target !== "number" && typeof target !== "string") {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <SmoothScrollContext.Provider value={{ scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
