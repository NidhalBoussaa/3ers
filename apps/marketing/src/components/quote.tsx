import Image from "next/image";
import { Reveal } from "@/components/reveal";

/**
 * One voice, at full width. The arch echoes the invitation's photo frames.
 * TODO: replace with the couple's verbatim words once collected — the layout
 * expects a quote of three short lines at most.
 */
export function Quote() {
  return (
    <section className="bg-champagne py-28 md:py-36">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <Reveal variant="soft">
          <div className="overflow-hidden rounded-t-full border border-gold/40 p-2">
            <Image
              src="/Esmiralda.jpg"
              alt="L'enveloppe gaufrée de l'invitation de Fahmi et Esmiralda"
              width={176}
              height={224}
              className="h-52 w-40 rounded-t-full object-cover"
            />
          </div>
        </Reveal>
        <Reveal variant="rise" delay={1}>
          <blockquote className="mt-12 font-body text-[clamp(1.6rem,3.6vw,2.5rem)] italic leading-[1.35] text-ink">
            «&nbsp;Des mois apr&egrave;s la f&ecirc;te, on nous demande encore qui
            avait fait notre invitation.&nbsp;»
          </blockquote>
        </Reveal>
        <Reveal variant="rise" delay={2}>
          <p className="mt-8 font-cinzel text-[11px] font-semibold uppercase tracking-[0.32em] text-gold-deep">
            Fahmi &amp; Esmiralda, mari&eacute;s en octobre 2025
          </p>
        </Reveal>
      </div>
    </section>
  );
}
