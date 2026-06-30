"use client";
import { useEffect, useRef } from "react";
import type { WeddingConfig } from "@/lib/schema";
import { gsap } from "@/lib/gsap";

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

        // ONE continuous spine: the gold line fills from the top down, scrubbed
        // to scroll across the whole list, and stays filled once complete.
        const fill = root.querySelector<HTMLElement>(".tl-fill");
        if (fill && list) {
          gsap.fromTo(
            fill,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              transformOrigin: "top center",
              scrollTrigger: {
                trigger: list,
                start: "top 72%",
                // finish when the last node reaches mid-viewport, then it holds
                end: "bottom 70%",
                scrub: 0.6,
              },
            },
          );
        }

        // node circles pop + content slides in from the start side (RTL → right)
        const fromX = 26;
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
        gsap.set(root.querySelectorAll<HTMLElement>(".tl-fill"), { scaleY: 1 });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} dir="rtl">
      <div className="tl-header anim-init font-amiri text-base tracking-[2px] text-gold-deep/80 mb-5">
        {lbl.ourStory.ar}
      </div>
      <div className="tl-list anim-init relative max-w-lg mx-auto">
        {/* continuous spine — sits under the node column (start edge: right in RTL).
            22px = node centre; the column is 44px wide. Track is faint; fill is gold. */}
        <span
          aria-hidden
          className="pointer-events-none absolute top-5 bottom-5 w-px bg-gold/20 start-[22px]"
        />
        <span
          aria-hidden
          className="tl-fill pointer-events-none absolute top-5 bottom-5 w-px bg-gold origin-top start-[22px]"
          style={{ transform: "scaleY(0)" }}
        />
        {config.story.map((s, i) => (
          <div key={i} className="tl-item relative flex gap-4 items-start text-start py-3.5">
            <div className="tl-node relative z-[1] flex-none size-11 rounded-full border border-gold flex items-center justify-center text-gold bg-cream">
              <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth={1.4} aria-hidden="true">
                {ICONS[s.icon]}
              </svg>
            </div>
            <div className="tl-body flex-1">
              <div className="font-amiri text-lg tracking-[1px] text-gold-deep">{s.title.ar}</div>
              <div className="font-amiri text-lg text-[#4a3e2c] leading-snug">{s.text.ar}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
