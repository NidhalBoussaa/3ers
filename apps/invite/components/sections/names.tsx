import type { WeddingConfig, Lang } from "@/lib/schema";
import { Reveal } from "@/components/reveal";

const LANGS: Lang[] = ["fr", "ar", "en"];

export function NamesSection({ config }: { config: WeddingConfig }) {
  const c = config.couple;
  const lbl = config.i18n.labels;

  return (
    <>
      <Reveal>
        <div className="font-cinzel text-[11px] tracking-[5px] text-gold-deep/80 mb-2.5">
          {LANGS.map((l) => (
            <span key={l} data-lang={l}>{lbl.withGodsBlessing[l]}</span>
          ))}
        </div>
      </Reveal>
      <Reveal delay={1}>
        <div className="italic font-sans text-lg sm:text-xl md:text-2xl text-[#4a3e2c] leading-snug">
          {LANGS.map((l) =>
            l === "ar" ? null : (
              <span key={l} data-lang={l}>{lbl.inviteLead[l]}</span>
            ),
          )}
        </div>
      </Reveal>
      <Reveal delay={2}>
        <div
          className="font-amiri text-base sm:text-lg text-[#6a5c44] mt-2"
          dir="rtl"
          data-lang="ar"
          style={{ lineHeight: 1.9 }}
        >
          {lbl.inviteLead.ar}
        </div>
      </Reveal>

      <div className="my-7 sm:my-8 relative">
        <Reveal variant="gold-leaf">
          <div className="font-cinzel-deco font-bold gold-text leading-[1] tracking-tight text-[clamp(34px,11vw,72px)]">
            {c.groom.first.toUpperCase()}
          </div>
        </Reveal>
        <Reveal variant="gold-leaf" delay={1}>
          <span className="font-vibes gold-text-soft text-[clamp(40px,12vw,82px)] leading-[.6] block my-1">
            &
          </span>
        </Reveal>
        <Reveal variant="gold-leaf" delay={2}>
          <div className="font-cinzel-deco font-bold gold-text leading-[1] tracking-tight text-[clamp(34px,11vw,72px)]">
            {c.bride.first.toUpperCase()}
          </div>
        </Reveal>
        <Reveal variant="rise" delay={3}>
          <div className="font-cinzel text-[11px] sm:text-[13px] tracking-[4px] text-[#8a7548] mt-3.5">
            {c.groom.last}&nbsp;&nbsp;·&nbsp;&nbsp;{c.bride.last}
          </div>
        </Reveal>
      </div>

      <Reveal>
        <div className="font-vibes text-gold-deep leading-tight text-[clamp(26px,7vw,38px)]">
          {LANGS.map((l) =>
            l === "ar" ? null : (
              <span key={l} data-lang={l}>{lbl.ceremonyLead[l]}</span>
            ),
          )}
        </div>
      </Reveal>
      <Reveal delay={1}>
        <div
          className="font-amiri text-base text-[#6a5c44] mt-1"
          dir="rtl"
          data-lang="ar"
        >
          {lbl.ceremonyLead.ar}
        </div>
      </Reveal>
    </>
  );
}
