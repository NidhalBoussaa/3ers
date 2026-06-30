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

  // The landing film must NOT start until the entrance/intro is over.
  // Keep it paused at frame 0 while the intro runs, then play once introDone.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (!introDone) {
      v.pause();
      try {
        v.currentTime = 0;
      } catch {}
      return;
    }
    v.muted = true;
    v.play().catch(() => {});
  }, [introDone]);

  if (!src) return null;

  return (
    <section
      aria-label="Wedding film"
      className="relative w-full h-[100svh] min-h-[420px] overflow-hidden bg-night"
    >
      {/* z-0 video */}
      {/* No autoPlay — playback is started by the introDone effect above, so
          the film never runs during the entrance section. */}
      <video
        ref={ref}
        playsInline
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
            "linear-gradient(180deg, rgba(11,8,5,.45) 0%, rgba(11,8,5,.12) 22%, rgba(11,8,5,.12) 52%, rgba(11,8,5,.42) 82%, rgba(243,236,221,.55) 100%)",
        }}
      />

      {/* z-2 overlay text + z-3 scroll cue */}
      <HeroOverlay />
    </section>
  );
}
