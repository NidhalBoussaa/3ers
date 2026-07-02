/**
 * The order's journey as a drawn gold thread. The couple always sees where
 * they are and what comes next — the single most reassuring thing in the portal.
 */
export const STAGES = [
  { key: "new", label: "Reçue" },
  { key: "in_review", label: "En création" },
  { key: "config_sent", label: "À personnaliser" },
  { key: "live", label: "En ligne" },
] as const;

export type StageKey = (typeof STAGES)[number]["key"];

export function StatusThread({ status }: { status: string }) {
  // Archived orders sit outside the linear thread; treat as "live-complete".
  const normalized = status === "archived" ? "live" : status;
  const activeIndex = Math.max(
    0,
    STAGES.findIndex((s) => s.key === normalized),
  );

  return (
    <ol className="flex items-start justify-between gap-1">
      {STAGES.map((stage, i) => {
        const done = i < activeIndex;
        const active = i === activeIndex;
        return (
          <li key={stage.key} className="relative flex flex-1 flex-col items-center gap-2.5">
            {/* Connector to the previous node */}
            {i > 0 && (
              <span
                className="absolute right-1/2 top-[7px] -z-0 h-px w-full"
                style={{
                  background:
                    i <= activeIndex
                      ? "var(--gold)"
                      : "color-mix(in srgb, var(--gold) 22%, transparent)",
                }}
                aria-hidden="true"
              />
            )}
            {/* Node */}
            <span
              className={`relative z-10 grid h-3.5 w-3.5 place-items-center rounded-full transition-colors ${
                done
                  ? "bg-gold"
                  : active
                    ? "bg-cream ring-2 ring-gold"
                    : "bg-cream ring-1 ring-gold/35"
              }`}
              aria-hidden="true"
            >
              {active && <span className="h-1.5 w-1.5 rounded-full bg-gold" />}
            </span>
            <span
              className={`text-center font-cinzel text-[8.5px] uppercase leading-tight tracking-[0.14em] sm:text-[9.5px] ${
                i <= activeIndex ? "text-gold-deep" : "text-ink-soft/55"
              }`}
            >
              {stage.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
