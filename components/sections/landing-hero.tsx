"use client";
import { useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { HeroOverlay } from "@/components/sections/hero-overlay";

/**
 * Full-bleed video hero at the top of the landing page — the couple film.
 * Plays muted + looping after the intro finishes (so it never competes with
 * the intro's audio). The wedding-detail overlay animates in over ~5s on top.
 */
export function LandingHero() {
  const { config, introDone } = useI18n();
  const ref = useRef<HTMLVideoElement | null>(null);
  const src = config.assets.landingVideo;

  useEffect(() => {
    if (!introDone || !ref.current) return;
    ref.current.muted = true;
    ref.current.play().catch(() => {});
  }, [introDone]);

  if (!src) return null;

  return (
    <section
      aria-label="Wedding film"
      className="relative w-full h-[100svh] min-h-[420px] overflow-hidden bg-night"
    >
      {/* z-0 video */}
      <video
        ref={ref}
        playsInline
        autoPlay
        muted
        loop
        preload="auto"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* z-1 vignette: darken top + bottom so the overlay text reads, then melt to cream */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(11,8,5,.45) 0%, rgba(11,8,5,.12) 22%, rgba(11,8,5,.12) 52%, rgba(11,8,5,.5) 80%, var(--cream) 100%)",
        }}
      />

      {/* z-2 overlay text + z-3 scroll cue */}
      <HeroOverlay />
    </section>
  );
}
