"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { Reveal } from "@/components/reveal";

/**
 * The commission, in three movements. A single gold thread draws itself
 * through the steps — the sequence is the thread, not a row of numbers.
 */
const STEPS = [
  {
    title: "Demandez",
    body: "Vos prénoms, votre date, votre langue. Deux minutes suffisent ; nous revenons vers vous sous 24 heures avec un aperçu.",
  },
  {
    title: "Confiez",
    body: "Nous cousons votre film, votre bénédiction, vos détails. Vous validez chaque retouche depuis votre espace privé.",
  },
  {
    title: "Partagez",
    body: "Votre lien est prêt. Envoyez-le à tous vos invités ; la soirée commence avant la soirée.",
  },
];

export function Steps() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const threads = el.querySelectorAll<SVGLineElement>(".step-thread line");
        const diamonds = gsap.utils.toArray<HTMLElement>(".step-diamond");

        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 70%", once: true },
        });
        tl.fromTo(
          threads,
          { strokeDashoffset: 1000 },
          { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut" },
        ).fromTo(
          diamonds,
          { opacity: 0, scale: 0 },
          { opacity: 1, scale: 1, duration: 0.5, stagger: 0.28, ease: "back.out(2)" },
          "-=1.5",
        );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(el.querySelectorAll(".step-thread line"), { strokeDashoffset: 0 });
        gsap.set(".step-diamond", { opacity: 1, scale: 1 });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="etapes" className="scroll-mt-20 bg-cream py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal variant="rise" className="mx-auto max-w-xl text-center">
          <h2 className="font-body text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.12] text-ink">
            Trois pas jusqu&rsquo;&agrave; <em className="text-gold-deep">votre lien</em>
          </h2>
        </Reveal>

        <div className="relative mt-20">
          {/* The thread — horizontal on desktop, vertical on mobile. */}
          <svg
            className="step-thread pointer-events-none absolute left-0 right-0 top-[7px] hidden h-px w-full md:block"
            preserveAspectRatio="none"
            viewBox="0 0 1000 2"
            aria-hidden="true"
          >
            <line
              x1="60"
              y1="1"
              x2="940"
              y2="1"
              stroke="var(--gold)"
              strokeWidth="1.5"
              strokeDasharray="1000"
              strokeDashoffset="1000"
              opacity="0.55"
            />
          </svg>
          <svg
            className="step-thread pointer-events-none absolute bottom-6 left-[7px] top-2 w-px md:hidden"
            preserveAspectRatio="none"
            viewBox="0 0 2 1000"
            aria-hidden="true"
          >
            <line
              x1="1"
              y1="10"
              x2="1"
              y2="990"
              stroke="var(--gold)"
              strokeWidth="1.5"
              strokeDasharray="1000"
              strokeDashoffset="1000"
              opacity="0.55"
            />
          </svg>

          <ol className="grid gap-14 md:grid-cols-3 md:gap-10">
            {STEPS.map((step) => (
              <li key={step.title} className="relative pl-10 md:pl-0">
                <span className="step-diamond absolute left-0 top-1 md:relative md:left-auto md:top-auto md:mb-7 md:block md:w-fit">
                  <svg viewBox="0 0 16 16" className="h-4 w-4 fill-gold" aria-hidden="true">
                    <path d="M8 0 L16 8 L8 16 L0 8 Z" />
                  </svg>
                </span>
                <h3 className="font-cinzel text-[1.05rem] font-semibold uppercase tracking-[0.24em] text-ink">
                  {step.title}
                </h3>
                <p className="mt-4 max-w-[38ch] font-body text-[1.12rem] leading-relaxed text-ink-soft">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
