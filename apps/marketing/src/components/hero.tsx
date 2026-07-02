"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Full-bleed cinematic entrance. The film from the real invitation plays
 * beneath a night veil; couple names crossfade in gold leaf — the pitch is
 * literal: these could be your names.
 */
const COUPLES: Array<[string, string]> = [
  ["Fahmi", "Esmiralda"],
  ["Yassine", "Mariem"],
  ["Aziz", "Inès"],
  ["Skander", "Leïla"],
];

export function Hero() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // ── Entrance: veil thins, names bloom, the rest follows. ──
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.set(el.querySelectorAll(".anim-init"), { opacity: 1 })
          .fromTo(".hero-veil", { opacity: 1 }, { opacity: 0, duration: 1.6, ease: "power2.inOut" })
          .fromTo(
            ".hero-mark",
            { opacity: 0, y: -14 },
            { opacity: 1, y: 0, duration: 0.9 },
            "-=1.0",
          )
          .fromTo(
            ".hero-names",
            { opacity: 0, scale: 1.06, filter: "blur(10px)" },
            { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.3 },
            "-=0.7",
          )
          .fromTo(".hero-sub", { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.9 }, "-=0.6")
          .fromTo(".hero-cta", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.5")
          .fromTo(".hero-rule", { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "power2.inOut" }, "-=0.6");

        // ── Names carousel: each couple holds the stage, then hands it on. ──
        const pairs = gsap.utils.toArray<HTMLElement>(".hero-pair");
        if (pairs.length > 1) {
          gsap.set(pairs.slice(1), { opacity: 0 });
          const cycle = gsap.timeline({ repeat: -1, delay: 3.6 });
          pairs.forEach((pair, i) => {
            const next = pairs[(i + 1) % pairs.length];
            cycle
              .to(pair, { opacity: 0, filter: "blur(8px)", duration: 0.8, ease: "power2.in" }, `+=${i === 0 ? 0 : 3.4}`)
              .fromTo(
                next,
                { opacity: 0, filter: "blur(8px)", letterSpacing: "0.06em" },
                { opacity: 1, filter: "blur(0px)", letterSpacing: "0em", duration: 1.1, ease: "power2.out" },
                "-=0.25",
              );
          });
        }

        // ── The film recedes as you leave the fold (depth, not decoration). ──
        gsap.to(".hero-stage", {
          opacity: 0.25,
          scale: 0.98,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(el.querySelectorAll(".anim-init"), { opacity: 1, clearProps: "transform,filter" });
        gsap.set(".hero-veil", { opacity: 0 });
        gsap.set(".hero-rule", { scaleX: 1 });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative min-h-[100dvh] overflow-hidden bg-night" aria-label="3ers — atelier d'invitations de mariage">
      {/* The film — the actual entrance film shipped with the invitation. */}
      <div className="hero-stage absolute inset-0">
        <video
          className="film-drift absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/Landing.jpg"
          aria-hidden="true"
        >
          <source src="/Landing.webm" type="video/webm" />
          <source src="/Landing.mp4" type="video/mp4" />
        </video>
        <Image
          src="/Landing.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hidden object-cover motion-reduce:block"
        />
        {/* Night vignette — the words must always win over the film. */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(11,8,5,0.55)_78%,rgba(11,8,5,0.92)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-night/70 via-night/25 to-night" />
      </div>

      {/* Entrance veil — the page opens like the invitation does. */}
      <div className="hero-veil pointer-events-none absolute inset-0 z-20 bg-night" />

      {/* Composition */}
      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-5xl flex-col items-center justify-center px-6 pb-24 pt-[calc(var(--safe-top)+2rem)] text-center">
        <p className="hero-mark anim-init lbl mb-10 text-gold-soft">
          3ers <span className="mx-3 inline-block h-px w-8 translate-y-[-3px] bg-gold/60 align-middle" aria-hidden="true" />{" "}
          Atelier d&rsquo;invitations
        </p>

        {/* Names — stacked pairs share one grid cell; GSAP hands the stage over. */}
        <h1 className="hero-names anim-init grid w-full [grid-template-areas:'names']">
          {COUPLES.map(([a, b], i) => (
            <span
              key={a}
              className="hero-pair flex flex-wrap items-baseline justify-center gap-x-5 gap-y-1 [grid-area:names]"
              aria-hidden={i > 0}
            >
              <span className="gold-text-night font-deco text-[clamp(2.5rem,8.5vw,5.5rem)] font-bold uppercase leading-[1.05] tracking-[-0.01em]">
                {a}
              </span>
              <span className="font-vibes text-[clamp(1.9rem,5vw,3.2rem)] leading-none text-gold-soft">
                &amp;
              </span>
              <span className="gold-text-night font-deco text-[clamp(2.5rem,8.5vw,5.5rem)] font-bold uppercase leading-[1.05] tracking-[-0.01em]">
                {b}
              </span>
            </span>
          ))}
        </h1>

        <p className="hero-sub anim-init mt-9 max-w-xl font-body text-[clamp(1.15rem,2.4vw,1.45rem)] italic leading-relaxed text-champagne">
          L&rsquo;invitation de mariage qui s&rsquo;ouvre comme un film, et porte vos
          pr&eacute;noms en feuille d&rsquo;or.
        </p>

        <div className="hero-cta anim-init mt-12">
          <a href="#demande" className="btn-gold">
            Demander votre invitation
          </a>
        </div>
      </div>

      {/* A single gold thread closes the fold. */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center pb-[max(var(--safe-bot),1.25rem)]">
        <span className="hero-rule block h-px w-40 origin-center bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
      </div>
    </section>
  );
}
