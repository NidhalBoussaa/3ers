/**
 * The trilingual thread: one slow gold band, the same sentence in the three
 * languages every invitation ships in. Statement, not decoration.
 */
const PHRASE = (
  <>
    <span className="font-body italic">Vous êtes invités</span>
    <Diamond />
    <span className="font-amiri not-italic" lang="ar" dir="rtl">
      أنتم مدعوون
    </span>
    <Diamond />
    <span className="font-body italic" lang="en">
      You are invited
    </span>
    <Diamond />
  </>
);

function Diamond() {
  return (
    <svg viewBox="0 0 12 12" className="mx-[3vw] h-2.5 w-2.5 shrink-0 fill-gold/60" aria-hidden="true">
      <path d="M6 0 L12 6 L6 12 L0 6 Z" />
    </svg>
  );
}

export function MarqueeBand() {
  return (
    <div
      className="relative overflow-hidden border-y border-gold/15 bg-night py-6"
      role="marquee"
      aria-label="Vous êtes invités — أنتم مدعوون — You are invited"
    >
      <div className="marquee-track items-center text-[clamp(1.1rem,2.2vw,1.5rem)] text-gold-soft">
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {PHRASE}
          {PHRASE}
          {PHRASE}
        </div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {PHRASE}
          {PHRASE}
          {PHRASE}
        </div>
      </div>
    </div>
  );
}
