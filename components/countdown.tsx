"use client";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { gsap, ScrollTrigger } from "@/lib/gsap";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function Countdown() {
  const { lang, config } = useI18n();
  const target = new Date(config.date.iso).getTime();
  // start at null so SSR renders zeros — matches the first client paint, then we hydrate to real time.
  const [now, setNow] = useState<number | null>(null);

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const digitRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rolledRef = useRef(false);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = now === null ? 0 : Math.max(0, target - now);
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  const values = [d, h, m, s];

  const labels = config.i18n.labels.cdLabels[lang];

  // Card entrance (3D rotateX stagger) + one-time odometer roll on first real values.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || now === null || rolledRef.current) return;
    rolledRef.current = true;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(wrap, { opacity: 1 });
        // cards lift in
        gsap.fromTo(
          wrap.children,
          { opacity: 0, y: 36, rotateX: 40, transformPerspective: 700 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.09,
            ease: "power3.out",
            scrollTrigger: { trigger: wrap, start: "top 85%", once: true },
          },
        );
        // odometer: roll each digit box from 0 up to its target value
        ScrollTrigger.create({
          trigger: wrap,
          start: "top 85%",
          once: true,
          onEnter: () => {
            values.forEach((val, i) => {
              const el = digitRefs.current[i];
              if (!el) return;
              const proxy = { v: 0 };
              gsap.to(proxy, {
                v: val,
                duration: 1.1,
                delay: 0.25 + i * 0.09,
                ease: "power2.out",
                onUpdate: () => {
                  el.textContent = pad(Math.round(proxy.v));
                },
              });
            });
          },
        });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(wrap, { opacity: 1, clearProps: "all" });
      });
    }, wrap);

    return () => ctx.revert();
  }, [now]);

  return (
    <div
      ref={wrapRef}
      className="anim-init my-4 flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6"
    >
      {values.map((v, i) => (
        <div
          key={i}
          className="min-w-[64px] px-2 py-3.5 rounded-xl border border-gold/40 bg-gradient-to-b from-white/60 to-cream/30 shadow-[0_6px_22px_-12px_rgba(140,109,42,.5)] text-center"
        >
          <div
            ref={(el) => {
              digitRefs.current[i] = el;
            }}
            className="font-cinzel text-2xl md:text-3xl font-semibold text-gold-deep leading-none tabular-nums"
          >
            {pad(v)}
          </div>
          <div className="mt-1.5 font-cinzel text-[9px] tracking-widest text-[#9a8048]">
            {labels[i]}
          </div>
        </div>
      ))}
    </div>
  );
}
