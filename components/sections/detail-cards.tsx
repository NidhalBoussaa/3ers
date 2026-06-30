import type { WeddingConfig } from "@/lib/schema";
import { LuxeCard } from "@/components/luxe-card";

/** The date card — rendered above the venue photo. */
export function DateCard({ config }: { config: WeddingConfig }) {
  return (
    <div className="my-6 max-w-lg mx-auto" dir="rtl">
      <LuxeCard index={0} className="text-center">
        <Cal />
        <div className="font-amiri text-lg text-[#3a3020] leading-snug">
          {config.date.display.ar}
        </div>
      </LuxeCard>
    </div>
  );
}

/** The time card — rendered below the venue photo. */
export function TimeCard({ config }: { config: WeddingConfig }) {
  return (
    <div className="my-6 max-w-lg mx-auto" dir="rtl">
      <LuxeCard index={0} className="text-center">
        <Clock />
        <div className="font-amiri text-lg text-[#3a3020] leading-snug">
          {config.date.timeDisplay.ar}
        </div>
      </LuxeCard>
    </div>
  );
}

/** Gold-foil medallion that frames each card's icon like a piece of jewelry. */
function Medallion({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="relative mx-auto mb-4 grid size-14 place-items-center rounded-full bg-linear-to-b from-[#fbf4e2] to-[#f1e6c9] shadow-[0_1px_0_rgba(255,255,255,.8)_inset,0_8px_18px_-10px_rgba(140,109,42,.55)] ring-1 ring-gold/40"
      aria-hidden="true"
    >
      <span className="pointer-events-none absolute inset-1 rounded-full border border-gold/20" />
      {children}
    </span>
  );
}
function Cal() {
  return (
    <Medallion>
      <svg viewBox="0 0 24 24" className="size-6 fill-none stroke-gold-deep" strokeWidth={1.4}>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="16" y1="2" x2="16" y2="6" />
      </svg>
    </Medallion>
  );
}
function Clock() {
  return (
    <Medallion>
      <svg viewBox="0 0 24 24" className="size-6 fill-none stroke-gold-deep" strokeWidth={1.4}>
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 16 14" />
      </svg>
    </Medallion>
  );
}
