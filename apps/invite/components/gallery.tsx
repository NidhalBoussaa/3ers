"use client";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "./reveal";
import { Ornament } from "./ornament";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function Gallery() {
  const { config, t } = useI18n();
  const gal = config.gallery ?? [];
  const [idx, setIdx] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  // Batch-stagger the tiles in as the grid scrolls into view.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const tiles = gsap.utils.toArray<HTMLElement>(grid.children);
    if (!tiles.length) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(grid, { opacity: 1 });
        gsap.set(tiles, { opacity: 0, y: 24, scale: 0.92 });
        ScrollTrigger.batch(tiles, {
          start: "top 88%",
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              ease: "power3.out",
              stagger: 0.08,
              overwrite: true,
            }),
        });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(grid, { opacity: 1 });
        gsap.set(tiles, { opacity: 1, clearProps: "transform" });
      });
    }, grid);

    return () => ctx.revert();
  }, [gal.length]);

  if (!config.features.gallery || gal.length === 0) return null;

  function show(i: number) {
    setIdx(((i % gal.length) + gal.length) % gal.length);
  }

  return (
    <>
      <Ornament />
      <Reveal>
        <div className="font-cinzel text-[11px] tracking-[5px] text-gold-deep/80 mb-3">
          {t(config.i18n.labels.ourMoments)}
        </div>
      </Reveal>
      <div
        ref={gridRef}
        className="anim-init grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2 max-w-[560px] mx-auto"
      >
        {gal.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIdx(i)}
            className="relative aspect-square overflow-hidden rounded-xl border border-gold/40 bg-[#f0e7d0] cursor-pointer group transition hover:-translate-y-0.5"
            aria-label={`Photo ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      <Dialog open={idx !== null} onOpenChange={(o) => !o && setIdx(null)}>
        <DialogContent className="max-w-3xl bg-night/95 border-gold/40 p-2">
          {idx !== null && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={gal[idx]}
              alt={`Photo ${idx + 1}`}
              className="w-full max-h-[80vh] object-contain rounded"
            />
          )}
          <div className="flex justify-between mt-2">
            <button
              type="button"
              onClick={() => idx !== null && show(idx - 1)}
              className="size-10 rounded-full bg-cream/15 border border-gold-bright/40 text-gold-bright hover:bg-gold-bright/20 flex items-center justify-center"
              aria-label="Previous"
            >
              <svg viewBox="0 0 24 24" className="size-5 stroke-current fill-none" strokeWidth={1.8}>
                <polyline points="15 6 9 12 15 18" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => idx !== null && show(idx + 1)}
              className="size-10 rounded-full bg-cream/15 border border-gold-bright/40 text-gold-bright hover:bg-gold-bright/20 flex items-center justify-center"
              aria-label="Next"
            >
              <svg viewBox="0 0 24 24" className="size-5 stroke-current fill-none" strokeWidth={1.8}>
                <polyline points="9 6 15 12 9 18" />
              </svg>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
