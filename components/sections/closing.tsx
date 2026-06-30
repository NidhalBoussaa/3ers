import type { WeddingConfig, Lang } from "@/lib/schema";
import Image from "next/image";
import { Reveal } from "@/components/reveal";

const LANGS: Lang[] = ["fr", "ar", "en"];

export function ClosingSection({ config }: { config: WeddingConfig }) {
  const lbl = config.i18n.labels;
  const c = config.couple;
  const year = new Date(config.date.iso).getFullYear();
  return (
    <>
      <Reveal variant="rise">
        <div className="font-vibes text-gold-deep leading-tight text-[clamp(24px,6.5vw,34px)]">
          {LANGS.map((l) => (
            <span key={l} data-lang={l} dangerouslySetInnerHTML={{ __html: lbl.closing[l] }} />
          ))}
        </div>
      </Reveal>
      <Reveal variant="bloom" delay={1}>
        <Image
          src={config.assets.logoGold}
          alt=""
          width={140}
          height={140}
          className="w-[clamp(96px,26vw,140px)] h-auto mx-auto mt-7 drop-shadow-md"
        />
      </Reveal>
      <Reveal delay={2}>
        <div className="font-cinzel text-[10px] tracking-[4px] text-gold-deep/80 mt-2">
          {c.groom.first.toUpperCase()} &amp; {c.bride.first.toUpperCase()} · {year}
        </div>
      </Reveal>
    </>
  );
}
