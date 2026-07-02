"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { Reveal } from "@/components/reveal";

/**
 * Two formules on one sheet, separated by a drawn gold hairline — a menu,
 * not a SaaS pricing grid. Prestige wears the house seal.
 */
const TIERS = [
  {
    name: "Essentiel",
    tagline: "L'invitation, complète",
    price: "149 €",
    lines: [
      "Une langue, français ou arabe",
      "Réponses des invités en direct",
      "Une photo de couple mise en scène",
      "Une série de retouches",
      "En ligne sous cinq jours",
    ],
  },
  {
    name: "Prestige",
    tagline: "La maison au complet",
    price: "249 €",
    lines: [
      "Trois langues : français, arabe, anglais",
      "RSVP complet et livre d'or",
      "Deux photos et votre film de couple",
      "Trois séries de retouches",
      "En ligne sous 48 heures",
    ],
    sealed: true,
  },
];

export function Pricing() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".tier-divider",
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 1.4,
            ease: "power2.inOut",
            scrollTrigger: { trigger: el, start: "top 65%", once: true },
          },
        );
        gsap.fromTo(
          ".tier-seal",
          { opacity: 0, scale: 1.7, rotate: -14 },
          {
            opacity: 1,
            scale: 1,
            rotate: -8,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 55%", once: true },
          },
        );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".tier-divider", { scaleY: 1 });
        gsap.set(".tier-seal", { opacity: 1, scale: 1, rotate: -8 });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="formules" className="scroll-mt-20 bg-cream pb-28 pt-4 md:pb-36">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal variant="rise" className="mx-auto max-w-xl text-center">
          <h2 className="font-body text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.12] text-ink">
            Les <em className="text-gold-deep">formules</em>
          </h2>
          <p className="mt-6 font-body text-[1.14rem] leading-relaxed text-ink-soft">
            Deux fa&ccedil;ons de nous confier votre soir&eacute;e. Les prix sont
            affich&eacute;s parce que nous en sommes fiers.
          </p>
        </Reveal>

        <div className="relative mt-20 grid gap-16 md:grid-cols-2 md:gap-0">
          {/* Drawn divider (desktop) */}
          <span
            className="tier-divider absolute left-1/2 top-2 hidden h-[92%] w-px origin-top bg-gradient-to-b from-transparent via-gold/60 to-transparent md:block"
            aria-hidden="true"
          />

          {TIERS.map((tier) => (
            <Reveal
              key={tier.name}
              variant="rise"
              className={`relative flex flex-col items-center text-center ${tier.sealed ? "md:pl-16" : "md:pr-16"}`}
            >
              {tier.sealed && (
                <Image
                  src="/wax.png"
                  alt="Sceau de cire de la maison 3ers"
                  width={88}
                  height={88}
                  className="tier-seal absolute -top-10 right-2 h-20 w-20 object-contain drop-shadow-[0_10px_18px_rgba(140,109,42,0.35)] md:right-6"
                />
              )}
              <h3 className="font-cinzel text-[1.1rem] font-semibold uppercase tracking-[0.3em] text-ink">
                {tier.name}
              </h3>
              <p className="mt-3 font-body text-[1.05rem] italic text-ink-soft">{tier.tagline}</p>
              <p className="mt-8 font-cinzel text-[clamp(2.6rem,5vw,3.4rem)] font-semibold text-gold-deep">
                {tier.price}
              </p>
              <ul className="mt-9 space-y-4">
                {tier.lines.map((line) => (
                  <li key={line} className="font-body text-[1.12rem] leading-relaxed text-ink-soft">
                    {line}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal variant="rise" className="mt-20 flex flex-col items-center gap-6 text-center">
          <a href="#demande" className="btn-gold on-cream">
            Demander votre invitation
          </a>
          <p className="max-w-[46ch] font-body text-[1.02rem] italic text-ink-soft">
            Aucun paiement aujourd&rsquo;hui : vous r&eacute;glez apr&egrave;s avoir
            valid&eacute; votre aper&ccedil;u.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
