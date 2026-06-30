"use client";
import { useEffect, useRef } from "react";
import type { WeddingConfig, Lang } from "@/lib/schema";
import { useI18n } from "@/lib/i18n";
import { gsap } from "@/lib/gsap";

const LANGS: Lang[] = ["fr", "ar", "en"];

const ICONS: Record<"heart" | "ring" | "star", React.ReactNode> = {
  heart: <path d="M12 21s-7-5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5-7 10-7 10z" />,
  ring: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21c0-4 3-6 7-6s7 2 7 6" />
    </>
  ),
  star: <path d="M12 3l2.5 5 5.5.8-4 3.9 1 5.5L12 21l-5-2.9 1-5.5-4-3.9 5.5-.8z" />,
};

export function StoryTimeline({ config }: { config: WeddingConfig }) {
  const { lang } = useI18n();
  const lbl = config.i18n.labels;
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // header
        const header = root.querySelector(".tl-header");
        if (header) {
          gsap.set(header, { opacity: 1 });
          gsap.fromTo(
            header,
            { opacity: 0, y: 18 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: { trigger: header, start: "top 85%", once: true },
            },
          );
        }

        const list = root.querySelector(".tl-list");
        if (list) gsap.set(list, { opacity: 1 });

        // each line segment draws (scaleY) scrubbed to scroll
        root.querySelectorAll<HTMLElement>(".tl-line").forEach((line) => {
          gsap.fromTo(
            line,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              transformOrigin: "top center",
              scrollTrigger: {
                trigger: line,
                start: "top 80%",
                end: "bottom 60%",
                scrub: true,
              },
            },
          );
        });

        // node circles pop + content slides in from the start side (RTL-aware)
        const fromX = lang === "ar" ? 26 : -26;
        root.querySelectorAll<HTMLElement>(".tl-item").forEach((item) => {
          const node = item.querySelector(".tl-node");
          const body = item.querySelector(".tl-body");
          const tl = gsap.timeline({
            scrollTrigger: { trigger: item, start: "top 82%", once: true },
          });
          if (node) {
            tl.fromTo(
              node,
              { scale: 0, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
            );
          }
          if (body) {
            tl.fromTo(
              body,
              { opacity: 0, x: fromX },
              { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" },
              "-=0.3",
            );
          }
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(root.querySelectorAll(".tl-header, .tl-list"), { opacity: 1 });
        gsap.set(root.querySelectorAll<HTMLElement>(".tl-line"), { scaleY: 1 });
      });
    }, root);

    return () => ctx.revert();
  }, [lang]);

  return (
    <div ref={rootRef}>
      <div className="tl-header anim-init font-cinzel text-[11px] tracking-[5px] text-gold-deep/80 mb-3">
        {LANGS.map((l) => (
          <span key={l} data-lang={l}>{lbl.ourStory[l]}</span>
        ))}
      </div>
      <div className="tl-list anim-init max-w-lg mx-auto">
        {config.story.map((s, i) => (
          <div key={i} className="tl-item flex gap-4 items-start text-start py-3.5 relative">
            <div className="tl-node flex-none size-11 rounded-full border border-gold flex items-center justify-center text-gold bg-white/50">
              <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth={1.4} aria-hidden="true">
                {ICONS[s.icon]}
              </svg>
            </div>
            {i < config.story.length - 1 && (
              <div className="tl-line absolute top-11 -bottom-3.5 w-px bg-gold/40" style={{ left: 22 }} />
            )}
            <div className="tl-body flex-1">
              {LANGS.map((l) => (
                <div key={l} data-lang={l}>
                  <div className="font-cinzel text-[13px] tracking-[2px] text-gold-deep">{s.title[l]}</div>
                  <div className="text-base sm:text-lg text-[#4a3e2c] leading-snug">{s.text[l]}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
