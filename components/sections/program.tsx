import type { WeddingConfig } from "@/lib/schema";
import { Reveal } from "@/components/reveal";
import { LuxeCard } from "@/components/luxe-card";

export function ProgramSection({ config }: { config: WeddingConfig }) {
  const lbl = config.i18n.labels;
  return (
    <>
      <Reveal variant="rise">
        <div className="font-amiri text-base tracking-[2px] text-gold-deep/80 mb-5">
          {lbl.program.ar}
        </div>
      </Reveal>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-lg mx-auto"
        dir="rtl"
      >
        {config.program.map((p, i) => (
          <LuxeCard
            key={i}
            index={i}
            dense
            contentClassName="flex items-center gap-4 text-start"
          >
            <span
              aria-hidden
              className="font-cinzel text-2xl leading-none text-gold-deep tabular-nums"
            >
              {p.time}
            </span>
            {/* gold hairline divider — the single jewel line between hour and rite */}
            <span
              aria-hidden
              className="h-9 w-px shrink-0 bg-linear-to-b from-transparent via-gold/55 to-transparent"
            />
            <div className="font-amiri text-lg leading-snug text-[#3a3020]">
              {p.name.ar}
            </div>
          </LuxeCard>
        ))}
      </div>

      <Reveal variant="rise" delay={2}>
        <div className="mt-7">
          <div className="font-amiri text-base tracking-[2px] text-gold-deep/80">
            {lbl.dressCode.ar}
          </div>
        </div>
      </Reveal>
      {/* dress-code swatches pop in sequence */}
      <Reveal variant="swatch" stagger className="flex gap-2.5 justify-center mt-2.5">
        {config.dressCode.map((c, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="size-8 rounded-full border-2 border-white shadow"
            style={{ background: c }}
          />
        ))}
      </Reveal>
    </>
  );
}
