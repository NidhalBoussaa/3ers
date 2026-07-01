"use client";
import { useEffect, useRef } from "react";
import type { WeddingConfig } from "@/lib/schema";
import { useI18n } from "@/lib/i18n";
import { gsap } from "@/lib/gsap";
import { Reveal } from "@/components/reveal";

/**
 * The wedding venue — Salle Mawazine. The ballroom photo sits in a gold couture
 * mat with corner brackets, drifts gently (Ken-Burns) on scroll, and carries the
 * hall name + city and a map link. Arabic / RTL.
 */
export function Venue({ config }: { config: WeddingConfig }) {
  const { t } = useI18n();
  const src = config.assets.venuePhoto;
  const matRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // clip-path reveal wipe + slow scrubbed Ken-Burns drift, matching CouplePhoto.
  useEffect(() => {
    const mat = matRef.current;
    const img = imgRef.current;
    if (!mat || !img) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(mat, { opacity: 1 });
        gsap.fromTo(
          mat,
          { clipPath: "inset(0 0 100% 0)" },
          {
            clipPath: "inset(0 0 0% 0)",
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: mat, start: "top 82%", once: true },
          },
        );
        gsap.fromTo(
          img,
          { scale: 1.14 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: mat,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(mat, { opacity: 1, clearProps: "all" });
      });
    }, mat);

    return () => ctx.revert();
  }, [src]);

  if (!src) return null;

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.venue.mapsQuery)}`;
  const venueLabel = config.i18n.labels.venueLabel;

  return (
    <section dir="rtl" className="my-10">
      {venueLabel && (
        <Reveal variant="rise">
          <div className="font-amiri text-base tracking-[2px] text-gold-deep/80 mb-5 text-center">
            {venueLabel.ar}
          </div>
        </Reveal>
      )}

      <div className="relative mx-auto max-w-2xl">
        {/* gold mat — the couture frame, with an inner white hairline */}
        <div
          ref={matRef}
          className="anim-init relative overflow-hidden rounded-md p-2.5 shadow-[0_22px_60px_-26px_rgba(140,109,42,.85)]"
          style={{ background: "linear-gradient(145deg, #f3e3b4, #c9a44c)" }}
        >
          <picture>
            {config.assets.venuePhotoWebp && (
              <source srcSet={config.assets.venuePhotoWebp} type="image/webp" />
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={src}
              alt={`${config.venue.name.ar} · ${config.venue.city.ar}`}
              loading="lazy"
              className="block w-full rounded-sm will-change-transform"
            />
          </picture>
          <div className="pointer-events-none absolute inset-[14px] rounded-sm border border-white/55" />

          {/* corner brackets — the same L-frame motif as the cards */}
          <Corner className="top-2.5 left-2.5" d="M0 16 L0 0 L16 0" />
          <Corner className="top-2.5 right-2.5" d="M0 0 L16 0 L16 16" />
          <Corner className="bottom-2.5 left-2.5" d="M0 0 L0 16 L16 16" />
          <Corner className="bottom-2.5 right-2.5" d="M16 0 L16 16 L0 16" />

          {/* caption glassy ribbon along the bottom */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/55 via-black/20 to-transparent pt-12 pb-4 px-5 text-center">
            <div className="font-amiri text-xl sm:text-2xl text-[#fdfbf4] leading-tight" style={{ textShadow: "0 2px 12px rgba(0,0,0,.6)" }}>
              {config.venue.name.ar}
            </div>
            <div className="font-amiri text-base text-[#f8f1de]/90 mt-0.5" style={{ textShadow: "0 2px 12px rgba(0,0,0,.6)" }}>
              {config.venue.city.ar}
            </div>
          </div>
        </div>

        <div className="text-center">
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener"
            className="btn-gold mt-5 justify-center"
          >
            {t(config.i18n.labels.viewMap)}
          </a>
        </div>
      </div>
    </section>
  );
}

function Corner({ className, d }: { className: string; d: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className={`pointer-events-none absolute size-5 ${className}`}
    >
      <path d={d} fill="none" stroke="rgba(255,255,255,.7)" strokeWidth={1.2} />
    </svg>
  );
}
