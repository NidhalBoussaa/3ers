import type { WeddingConfig, Lang } from "@/lib/schema";
import { Reveal } from "@/components/reveal";

const LANGS: Lang[] = ["fr", "ar", "en"];

export function ProgramSection({ config }: { config: WeddingConfig }) {
  const lbl = config.i18n.labels;
  return (
    <>
      <Reveal variant="rise">
        <div className="font-cinzel text-[11px] tracking-[5px] text-gold-deep/80 mb-3">
          {LANGS.map((l) => (
            <span key={l} data-lang={l}>{lbl.program[l]}</span>
          ))}
        </div>
      </Reveal>

      {/* cards become direct children of the wrapper so they stagger individually */}
      <Reveal
        variant="cards"
        delay={1}
        stagger
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto"
      >
        {config.program.map((p, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-gold/30 bg-white/40 text-start"
          >
            <div className="font-cinzel text-xl text-gold-deep tabular-nums">{p.time}</div>
            {LANGS.map((l) => (
              <div key={l} data-lang={l} className="text-base text-[#4a3e2c] mt-0.5">
                {p.name[l]}
              </div>
            ))}
          </div>
        ))}
      </Reveal>

      <Reveal variant="rise" delay={2}>
        <div className="mt-5">
          <div className="font-cinzel text-[11px] tracking-[5px] text-gold-deep/80">
            {LANGS.map((l) => (
              <span key={l} data-lang={l}>{lbl.dressCode[l]}</span>
            ))}
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
