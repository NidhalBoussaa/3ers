"use client";
import { useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { gsap } from "@/lib/gsap";
import { splitWords } from "@/lib/split-text";
import { useSmoothScroll } from "@/components/smooth-scroll-provider";

/**
 * Trilingual wedding-detail overlay over the looping couple film.
 * A ~5s GSAP timeline reveals: names (gold-leaf) -> date -> time -> venue,
 * then a gold scroll cue. Plays once the envelope intro is done.
 */
export function HeroOverlay() {
  const { config, lang, t, introDone } = useI18n();
  const { scrollTo } = useSmoothScroll();

  const rootRef = useRef<HTMLDivElement | null>(null);
  const ruleRef = useRef<HTMLSpanElement | null>(null);
  const namesRef = useRef<HTMLDivElement | null>(null);
  const dateRef = useRef<HTMLDivElement | null>(null);
  const timeRef = useRef<HTMLDivElement | null>(null);
  const venueRef = useRef<HTMLDivElement | null>(null);
  const cueRef = useRef<HTMLButtonElement | null>(null);

  const c = config.couple;
  const dateText = t(config.date.display);
  const timeText = t(config.date.timeDisplay);
  const venueText = `${t(config.venue.name)} · ${t(config.venue.city)}`;

  useEffect(() => {
    if (!introDone) return;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Clear the FOUC guard on every container; the timeline animates the
        // inner words/elements, so the parents themselves must be visible.
        gsap.set(
          [
            ruleRef.current,
            namesRef.current,
            dateRef.current,
            timeRef.current,
            venueRef.current,
            cueRef.current,
          ].filter(Boolean),
          { opacity: 1 },
        );

        // word-split the detail lines for staggered reveals
        const dateSplit = dateRef.current ? splitWords(dateRef.current) : null;
        const timeSplit = timeRef.current ? splitWords(timeRef.current) : null;

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // 0.0 — hairline rule / eyebrow
        if (ruleRef.current) {
          tl.fromTo(
            ruleRef.current,
            { opacity: 0, scaleX: 0 },
            { opacity: 1, scaleX: 1, duration: 0.7 },
            0,
          );
        }

        // 0.4 — names: gold-leaf scale + blur settle (the single gleam)
        if (namesRef.current) {
          tl.fromTo(
            namesRef.current.children,
            { opacity: 0, y: 26, scale: 1.08, filter: "blur(8px)" },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: 1.1,
              stagger: 0.18,
            },
            0.4,
          );
        }

        // 1.4 — date, word stagger
        if (dateSplit?.parts.length) {
          tl.fromTo(
            dateSplit.parts,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.04 },
            1.4,
          );
        }

        // 2.2 — time, lighter word stagger
        if (timeSplit?.parts.length) {
          tl.fromTo(
            timeSplit.parts,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.05 },
            2.2,
          );
        }

        // 2.8 — venue + city, rise
        if (venueRef.current) {
          tl.fromTo(
            venueRef.current,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.7 },
            2.8,
          );
        }

        // ~4.6 — scroll cue appears, then gently bobs forever
        if (cueRef.current) {
          tl.fromTo(
            cueRef.current,
            { opacity: 0, y: -6 },
            { opacity: 1, y: 0, duration: 0.6 },
            4.4,
          );
          tl.to(
            cueRef.current,
            {
              y: 9,
              duration: 1.2,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            },
            5,
          );
        }

        return () => {
          dateSplit?.revert();
          timeSplit?.revert();
        };
      });

      // reduced motion: everything visible at rest, static cue
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [
            ruleRef.current,
            namesRef.current,
            namesRef.current?.children ?? null,
            dateRef.current,
            timeRef.current,
            venueRef.current,
            cueRef.current,
          ].filter(Boolean),
          { opacity: 1, scaleX: 1, clearProps: "transform,filter" },
        );
      });
    }, root);

    return () => ctx.revert();
    // re-run on language change so the split text matches the visible string
  }, [introDone, lang]);

  function handleCue() {
    const stage = document.querySelector(".stage");
    if (stage instanceof HTMLElement) scrollTo(stage, { offset: 0 });
  }

  return (
    <div
      ref={rootRef}
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="absolute inset-0 z-[2] flex flex-col items-center justify-center px-6 text-center pointer-events-none"
    >
      <span
        ref={ruleRef}
        aria-hidden
        className="anim-init block h-px w-16 origin-center mb-6"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--gold-bright), transparent)",
        }}
      />

      <div
        ref={namesRef}
        className="flex flex-col items-center leading-none"
      >
        <span className="anim-init font-cinzel-deco font-bold gold-text text-[clamp(40px,12vw,86px)] tracking-tight">
          {c.groom.first.toUpperCase()}
        </span>
        <span className="anim-init font-vibes gold-text-soft text-[clamp(34px,10vw,64px)] leading-[.7] my-1">
          &amp;
        </span>
        <span className="anim-init font-cinzel-deco font-bold gold-text text-[clamp(40px,12vw,86px)] tracking-tight">
          {c.bride.first.toUpperCase()}
        </span>
      </div>

      <div
        ref={dateRef}
        className="anim-init mt-7 font-cinzel text-[clamp(17px,4.6vw,23px)] tracking-[3px] text-[#fdfbf4]"
        style={{ textShadow: "0 2px 16px rgba(0,0,0,.7)" }}
      >
        {dateText}
      </div>
      <div
        ref={timeRef}
        className="anim-init mt-2 font-cinzel text-[clamp(13px,3.4vw,16px)] tracking-[4px] text-[#f8f1de]"
        style={{ textShadow: "0 2px 14px rgba(0,0,0,.7)" }}
      >
        {timeText}
      </div>
      <div
        ref={venueRef}
        className="anim-init mt-4 font-marcellus text-[clamp(16px,4vw,20px)] tracking-[2px] text-[#fdfbf4]/95"
        style={{ textShadow: "0 2px 14px rgba(0,0,0,.7)" }}
      >
        {venueText}
      </div>

      <button
        ref={cueRef}
        type="button"
        onClick={handleCue}
        aria-label={t(config.i18n.labels.ourMoments)}
        className="anim-init pointer-events-auto absolute bottom-[max(28px,calc(env(safe-area-inset-bottom)+20px))] left-1/2 -translate-x-1/2 grid place-items-center cursor-pointer text-gold-bright focus-visible:outline-2 focus-visible:outline-gold-bright focus-visible:outline-offset-4 rounded-full p-2"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-7 fill-none stroke-current"
          strokeWidth={1.4}
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </div>
  );
}
