"use client";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { gsap } from "@/lib/gsap";

export function CouplePhoto() {
  const { config } = useI18n();
  const [present, setPresent] = useState(false);
  const [src, setSrc] = useState<string | null>(null);
  const matRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const photo = config.assets.photo;
    if (!config.features.photo || !photo) return;
    const img = new window.Image();
    img.onload = () => { setPresent(true); setSrc(photo); };
    img.onerror = () => setPresent(false);
    img.src = photo;
  }, [config.assets.photo, config.features.photo]);

  // Mat clip-path wipe on reveal + slow scrubbed Ken-Burns drift.
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
          { scale: 1.12 },
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
  }, [present, src]);

  if (!present || !src) return null;

  return (
    <div className="my-8 mx-auto max-w-[340px] relative">
      <div
        ref={matRef}
        className="anim-init relative p-3 rounded-md shadow-[0_18px_50px_-22px_rgba(140,109,42,.8)] overflow-hidden"
        style={{ background: "linear-gradient(145deg, #f3e3b4, #c9a44c)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={src}
          alt={`${config.couple.groom.first} & ${config.couple.bride.first}`}
          className="block w-full rounded-sm will-change-transform"
        />
        <div className="absolute inset-1.5 border border-white/55 rounded-sm pointer-events-none" />
      </div>
    </div>
  );
}
