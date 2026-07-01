"use client";
/**
 * Central GSAP entry. Imports gsap + ScrollTrigger and registers the plugin
 * exactly once, no matter how many client components import from here.
 * Always import gsap / ScrollTrigger from this module, never directly.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// registerPlugin is idempotent; safe to call once at module load (client only).
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
