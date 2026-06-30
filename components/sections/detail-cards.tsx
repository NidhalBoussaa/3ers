import type { WeddingConfig, Lang } from "@/lib/schema";
import { Reveal } from "@/components/reveal";

const LANGS: Lang[] = ["fr", "ar", "en"];

export function DetailCards({ config }: { config: WeddingConfig }) {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.venue.mapsQuery)}`;

  return (
    <Reveal variant="cards" stagger className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-5">
      <div>
        <Card>
          <Cal />
          {LANGS.map((l) =>
            l === "ar" ? null : (
              <div key={l} data-lang={l} className="text-base sm:text-lg text-[#3a3020] leading-snug font-medium">
                {config.date.display[l]}
              </div>
            ),
          )}
          <div data-lang="ar" className="font-amiri text-base text-[#6a5c44] mt-1.5" dir="rtl">
            {config.date.display.ar}
          </div>
        </Card>
      </div>

      <div>
        <Card>
          <Pin />
          {LANGS.map((l) =>
            l === "ar" ? null : (
              <div key={l} data-lang={l} className="text-base sm:text-lg text-[#3a3020] leading-snug font-medium">
                {config.venue.name[l]}
                <br />
                {config.venue.city[l]}
              </div>
            ),
          )}
          <div data-lang="ar" className="font-amiri text-base text-[#6a5c44] mt-1.5" dir="rtl">
            {config.venue.name.ar} · {config.venue.city.ar}
          </div>
          <a
            className="inline-block mt-2.5 font-cinzel text-[10px] tracking-widest text-gold-deep border-b border-gold pb-0.5 transition hover:tracking-[3px]"
            href={mapUrl}
            target="_blank"
            rel="noopener"
          >
            {LANGS.map((l) => (
              <span key={l} data-lang={l}>{config.i18n.labels.viewMap[l]}</span>
            ))}
          </a>
        </Card>
      </div>

      <div>
        <Card>
          <Clock />
          {LANGS.map((l) =>
            l === "ar" ? null : (
              <div key={l} data-lang={l} className="text-base sm:text-lg text-[#3a3020] font-medium">
                {config.date.timeDisplay[l]}
              </div>
            ),
          )}
          <div data-lang="ar" className="font-amiri text-base text-[#6a5c44]" dir="rtl">
            {config.date.timeDisplay.ar}
          </div>
        </Card>
      </div>
    </Reveal>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6 sm:p-5 rounded-2xl border border-gold/35 bg-gradient-to-b from-white/55 to-cream/25 shadow-[0_10px_30px_-18px_rgba(140,109,42,.6)] transition hover:-translate-y-1.5 hover:shadow-[0_18px_40px_-18px_rgba(140,109,42,.65)] text-center">
      {children}
    </div>
  );
}
function Cal() {
  return (
    <svg viewBox="0 0 24 24" className="size-10 mx-auto mb-3 fill-none stroke-gold" strokeWidth={1.4} aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="16" y1="2" x2="16" y2="6" />
    </svg>
  );
}
function Pin() {
  return (
    <svg viewBox="0 0 24 24" className="size-10 mx-auto mb-3 fill-none stroke-gold" strokeWidth={1.4} aria-hidden="true">
      <path d="M12 2c-3.9 0-7 3-7 6.9 0 5 7 12.1 7 12.1s7-7.1 7-12.1C19 5 15.9 2 12 2z" />
      <circle cx="12" cy="9" r="2.4" />
    </svg>
  );
}
function Clock() {
  return (
    <svg viewBox="0 0 24 24" className="size-10 mx-auto mb-3 fill-none stroke-gold" strokeWidth={1.4} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 16 14" />
    </svg>
  );
}
