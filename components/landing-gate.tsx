"use client";
import { type ReactNode } from "react";
import { useI18n } from "@/lib/i18n";

/**
 * Holds the landing page hidden until the intro overlay is dismissed.
 *
 * The intro is a `fixed inset-0 z-60` overlay, but its video (and the landing
 * hero video below it) both mount and paint their first frame immediately on
 * load. Before the intro's own paint settles, the landing film can flash beside
 * /behind it. Gating the whole <main> on `introDone` guarantees there is simply
 * nothing underneath to bleed through — the intro owns the screen alone until
 * the seal is tapped (or skipped).
 *
 * Kept in the DOM (opacity, not unmount) so SSR markup and scroll height are
 * stable; revealed with a soft fade as the intro melts away.
 */
export function LandingGate({ children }: { children: ReactNode }) {
  const { introDone } = useI18n();
  return (
    <div
      className={`transition-opacity duration-700 ease-out ${
        introDone ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      // While hidden, clamp it out of the painting/scroll path entirely.
      aria-hidden={!introDone}
    >
      {children}
    </div>
  );
}
