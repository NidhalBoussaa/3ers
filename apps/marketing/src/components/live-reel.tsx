"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { Reveal } from "@/components/reveal";

// The showcase invitation (Fahmi & Esmiralda's real, live order). The root
// domain is this marketing site itself, so the reel must point at a slug.
const SHOWCASE_URL =
  process.env.NEXT_PUBLIC_SHOWCASE_INVITE_URL ??
  `${(process.env.NEXT_PUBLIC_INVITE_URL ?? "https://celebrio-digital.com").replace(/\/$/, "")}/fahmi-esmiralda`;

/**
 * No screenshots, no mockups: the phone frames the real invitation app,
 * live. It arrives turned away and straightens to face the reader as they
 * scroll — the artifact presents itself.
 */
export function LiveReel() {
  const root = useRef<HTMLElement | null>(null);
  const [mountFrame, setMountFrame] = useState(false);
  const [active, setActive] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Mount the iframe only when the section approaches — it must never
  // compete with the hero film for first paint.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMountFrame(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".reel-phone",
          { rotateY: -24, rotateX: 9, y: 70, scale: 0.93 },
          {
            rotateY: 0,
            rotateX: 0,
            y: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: "center 45%",
              scrub: 0.6,
            },
          },
        );
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="experience"
      className="relative scroll-mt-20 overflow-hidden bg-night py-28 md:py-40"
    >
      {/* One candlelight glow behind the artifact. */}
      <div
        className="pointer-events-none absolute right-[8%] top-1/2 h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,164,76,0.14)_0%,transparent_65%)]"
        aria-hidden="true"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-16 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        {/* Copy */}
        <div className="max-w-xl">
          <Reveal variant="soft">
            <p className="lbl mb-8 text-gold">L&rsquo;exp&eacute;rience en direct</p>
          </Reveal>
          <Reveal variant="rise" delay={1}>
            <h2 className="font-body text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.12] text-cream">
              Ce n&rsquo;est pas une carte.
              <br />
              <em className="text-gold-soft">C&rsquo;est une entr&eacute;e en sc&egrave;ne.</em>
            </h2>
          </Reveal>
          <Reveal variant="rise" delay={2}>
            <p className="mt-8 max-w-[52ch] font-body text-[1.18rem] leading-relaxed text-champagne/90">
              Chaque invitation 3ers est un film que vos invit&eacute;s ouvrent d&rsquo;un
              simple lien : la b&eacute;n&eacute;diction, le compte &agrave; rebours, le programme,
              la r&eacute;ponse. Celle-ci est vraie ; elle a invit&eacute; trois cents personnes.
            </p>
          </Reveal>
          <Reveal variant="rise" delay={3}>
            <a
              href={SHOWCASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-10 inline-flex items-baseline gap-3 font-cinzel text-[12px] font-semibold uppercase tracking-[0.28em] text-gold-bright"
            >
              <span className="border-b border-gold/40 pb-1 transition-colors duration-300 group-hover:border-gold-bright">
                Ouvrir l&rsquo;invitation en direct
              </span>
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                ↗
              </span>
            </a>
          </Reveal>
        </div>

        {/* The artifact */}
        <Reveal variant="soft" className="flex flex-col items-center [perspective:1600px]">
          <figure className="reel-phone w-[clamp(270px,72vw,350px)] will-change-transform">
            <div className="rounded-[2.9rem] border border-gold/30 bg-[#16110a] p-[10px] shadow-[0_40px_90px_-30px_rgba(201,164,76,0.28)]">
              <div className="relative aspect-[9/19] overflow-hidden rounded-[2.25rem] bg-night">
                {/* Waiting face: a quiet monogram until the live app arrives. */}
                <div
                  className={`absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-night transition-opacity duration-700 ${loaded ? "pointer-events-none opacity-0" : "opacity-100"}`}
                >
                  <span className="gold-text-night font-deco text-3xl font-bold">F &amp; E</span>
                  <span className="h-px w-12 bg-gold/50" />
                  <span className="lbl text-[9px] text-gold-soft/80">Invitation en direct</span>
                </div>

                {mountFrame && (
                  <iframe
                    src={`${SHOWCASE_URL}?preview=1`}
                    title="Invitation de Fahmi & Esmiralda — aperçu en direct"
                    className={`absolute inset-0 h-full w-full border-0 ${active ? "" : "pointer-events-none"}`}
                    loading="lazy"
                    onLoad={() => setLoaded(true)}
                  />
                )}

                {/* Scroll guard: one tap hands the scroll to the invitation. */}
                {loaded && !active && (
                  <button
                    type="button"
                    onClick={() => setActive(true)}
                    className="absolute inset-x-0 bottom-0 z-20 flex h-24 items-end justify-center bg-gradient-to-t from-night/90 to-transparent pb-5"
                  >
                    <span className="lbl rounded-full border border-gold/50 bg-night/70 px-5 py-2.5 text-[9px] text-gold-bright backdrop-blur-sm">
                      Toucher pour explorer
                    </span>
                  </button>
                )}
              </div>
            </div>
            <figcaption className="mt-6 text-center font-body text-[1.02rem] italic text-champagne/75">
              Fahmi &amp; Esmiralda, octobre 2025 · leur invitation, en direct
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
