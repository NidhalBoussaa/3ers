"use client";
import { useEffect, useState } from "react";

const UNITS = [
  ["jours", 86400],
  ["heures", 3600],
  ["minutes", 60],
] as const;

/** Live countdown to the wedding — the invitation's own motif, quieted for the desk. */
export function Countdown({ isoDate }: { isoDate: string | null }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (!isoDate) return null;
  const target = new Date(isoDate).getTime();
  if (Number.isNaN(target)) return null;

  let rest = Math.max(0, Math.floor((target - (now ?? target)) / 1000));
  const values = UNITS.map(([, secs]) => {
    const v = Math.floor(rest / secs);
    rest -= v * secs;
    return v;
  });
  const past = now !== null && target < now;

  if (past) {
    return (
      <p className="font-body text-[1.05rem] italic text-ink-soft">
        Le grand jour est passé. Félicitations !
      </p>
    );
  }

  return (
    <div
      className={`flex items-end gap-5 transition-opacity duration-500 ${now ? "opacity-100" : "opacity-0"}`}
    >
      {UNITS.map(([label], i) => (
        <div key={label} className="flex flex-col items-center gap-1.5">
          <span className="font-cinzel text-[clamp(1.8rem,7vw,2.4rem)] font-semibold tabular-nums text-gold-deep">
            {String(values[i]).padStart(2, "0")}
          </span>
          <span className="font-cinzel text-[9px] uppercase tracking-[0.28em] text-ink-soft">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
