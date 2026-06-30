import type { WeddingConfig } from "@/lib/schema";
import { Reveal } from "@/components/reveal";
import { Ornament } from "@/components/ornament";

export function BismillahSection({ config }: { config: WeddingConfig }) {
  return (
    <>
      <Reveal variant="soft">
        <div className="font-amiri text-2xl sm:text-3xl text-gold-deep" dir="rtl" style={{ lineHeight: 1.6 }}>
          بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ
        </div>
      </Reveal>
      <Ornament />
      <Reveal variant="soft">
        <div
          className="font-amiri text-base sm:text-lg text-[#6a5c44] max-w-xl mx-auto"
          dir="rtl"
          style={{ lineHeight: 2.05 }}
        >
          {config.i18n.labels.verse}
        </div>
      </Reveal>
      <Reveal variant="soft" delay={1}>
        <div className="font-amiri text-sm text-gold-deep tracking-wide" dir="rtl">
          {config.i18n.labels.verseSign}
        </div>
      </Reveal>
      <Ornament />
    </>
  );
}
