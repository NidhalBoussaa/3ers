"use client";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Reveal } from "@/components/reveal";

/**
 * "What we do", told the way the product tells it: as a programme in five
 * acts. On desktop a sticky pane performs each act live — a still from the
 * real film, the blessing typeset in Amiri, a countdown actually counting,
 * the RSVP module you can touch. No screenshots, no mock dashboards.
 */

// ─── Act panes ────────────────────────────────────────────────────────────────

function EntrancePane() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-night">
      <Image
        src="/Landing.jpg"
        alt="Le film d'entrée d'une invitation 3ers : une allée de jardin illuminée à la tombée de la nuit"
        fill
        sizes="(min-width: 1024px) 460px, 90vw"
        className="film-drift object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/20 to-night/40" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 pb-10">
        <span className="gold-text-night font-deco text-[1.65rem] font-bold uppercase tracking-wide">
          Fahmi &amp; Esmiralda
        </span>
        <span className="h-px w-14 bg-gold/60" />
        <span className="lbl text-[9px] text-gold-soft">Le film s&rsquo;ouvre</span>
      </div>
    </div>
  );
}

function BlessingPane() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-7 bg-night px-8 text-center">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(201,164,76,0.12)_0%,transparent_60%)]"
        aria-hidden="true"
      />
      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 fill-gold" aria-hidden="true">
        <path d="M6 0 L12 6 L6 12 L0 6 Z" />
      </svg>
      <p lang="ar" dir="rtl" className="font-amiri text-[clamp(1.6rem,2.4vw,2.1rem)] leading-[2] text-gold-soft">
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </p>
      <p className="max-w-[30ch] font-body text-[1.05rem] italic leading-relaxed text-champagne/80">
        Au nom de Dieu, le Tout Mis&eacute;ricordieux, le Tr&egrave;s Mis&eacute;ricordieux
      </p>
    </div>
  );
}

/** Live countdown to a sample date — it really counts. */
const SAMPLE_DATE = new Date("2026-09-12T17:00:00+01:00");
const UNITS = [
  ["jours", 86400],
  ["heures", 3600],
  ["minutes", 60],
  ["secondes", 1],
] as const;

function CountdownPane() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  let rest = Math.max(0, Math.floor((SAMPLE_DATE.getTime() - (now?.getTime() ?? SAMPLE_DATE.getTime())) / 1000));
  const values = UNITS.map(([, secs]) => {
    const v = Math.floor(rest / secs);
    rest -= v * secs;
    return v;
  });

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-10 bg-cream px-6">
      <p className="lbl text-[10px] text-gold-deep">Encore quelques nuits</p>
      <div
        className={`grid grid-cols-4 gap-5 transition-opacity duration-700 ${now ? "opacity-100" : "opacity-0"}`}
      >
        {UNITS.map(([label], i) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <span className="font-cinzel text-[clamp(1.7rem,3vw,2.4rem)] font-semibold tabular-nums text-ink">
              {String(values[i]).padStart(2, "0")}
            </span>
            <span className="font-cinzel text-[9px] uppercase tracking-[0.3em] text-ink-soft">
              {label}
            </span>
          </div>
        ))}
      </div>
      <p className="font-body text-[1.02rem] italic text-ink-soft">
        Samedi 12 septembre 2026, il compte vraiment.
      </p>
    </div>
  );
}

/** The RSVP module, touchable. A preview of the real thing, not a picture of it. */
function RsvpPane() {
  const [attending, setAttending] = useState<"oui" | "non" | null>("oui");
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-7 bg-cream px-8">
      <p className="lbl text-[10px] text-gold-deep">Confirmez votre pr&eacute;sence</p>
      <div className="flex w-full max-w-xs flex-col gap-4">
        <input
          type="text"
          placeholder="Votre nom"
          aria-label="Votre nom (démonstration)"
          className="h-12 w-full rounded-xl border border-gold/40 bg-white/70 px-4 font-body text-[1.05rem] text-ink placeholder:text-ink-soft/75 focus-visible:outline-2 focus-visible:outline-gold"
        />
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              ["oui", "Avec joie"],
              ["non", "À regret"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setAttending(value)}
              aria-pressed={attending === value}
              className={`h-11 rounded-full border font-cinzel text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors duration-300 ${
                attending === value
                  ? "border-gold bg-gold text-white"
                  : "border-gold/50 bg-transparent text-gold-deep hover:bg-gold/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <p className="font-body text-[0.98rem] italic text-ink-soft">
        Aper&ccedil;u du module, livr&eacute; avec chaque invitation.
      </p>
    </div>
  );
}

function LinkPane() {
  const [lang, setLang] = useState<"fr" | "ar" | "en">("fr");
  const langs = [
    ["fr", "FR"],
    ["ar", "عربي"],
    ["en", "EN"],
  ] as const;
  const lines = {
    fr: "Vous êtes invités",
    ar: "أنتم مدعوون",
    en: "You are invited",
  } as const;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-9 bg-night px-8">
      <div className="inline-flex rounded-full border border-gold/45 bg-night/60 p-1">
        {langs.map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setLang(value)}
            aria-pressed={lang === value}
            className={`rounded-full px-5 py-2 font-cinzel text-[10px] font-semibold tracking-[0.18em] transition-colors duration-300 ${
              lang === value ? "bg-gold text-[#241a05]" : "text-gold-soft hover:bg-gold/10"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <p
        lang={lang}
        dir={lang === "ar" ? "rtl" : "ltr"}
        className={`text-center text-[clamp(1.5rem,2.6vw,2rem)] text-champagne ${lang === "ar" ? "font-amiri leading-[1.9]" : "font-body italic"}`}
      >
        {lines[lang]}
      </p>
      <div className="flex items-center gap-3 border-t border-gold/25 pt-6">
        <svg viewBox="0 0 12 12" className="h-2 w-2 fill-gold/70" aria-hidden="true">
          <path d="M6 0 L12 6 L6 12 L0 6 Z" />
        </svg>
        <span className="font-cinzel text-[11px] tracking-[0.22em] text-gold-soft">
          celebrio-digital.com/fahmi-esmiralda
        </span>
        <svg viewBox="0 0 12 12" className="h-2 w-2 fill-gold/70" aria-hidden="true">
          <path d="M6 0 L12 6 L6 12 L0 6 Z" />
        </svg>
      </div>
    </div>
  );
}

// ─── The programme ────────────────────────────────────────────────────────────

type Act = {
  numeral: string;
  title: string;
  body: string;
  pane: ReactNode;
};

const ACTS: Act[] = [
  {
    numeral: "I",
    title: "L'entrée en scène",
    body: "La nuit s'ouvre sur un film. Vos prénoms se posent en feuille d'or, et vos invités comprennent, avant le premier mot, que ce soir ne ressemblera à aucun autre.",
    pane: <EntrancePane />,
  },
  {
    numeral: "II",
    title: "La bénédiction",
    body: "La basmala précède tout, posée avec révérence au seuil de l'invitation. Les mots sacrés ne décorent pas ; ils président.",
    pane: <BlessingPane />,
  },
  {
    numeral: "III",
    title: "Le compte à rebours",
    body: "Chaque seconde qui vous sépare du grand soir, comptée en direct sous vos noms. L'attente devient partie de la fête.",
    pane: <CountdownPane />,
  },
  {
    numeral: "IV",
    title: "La réponse",
    body: "Vos invités confirment d'un geste et laissent un mot au livre d'or. Vous voyez tout arriver, en temps réel, sans relancer personne.",
    pane: <RsvpPane />,
  },
  {
    numeral: "V",
    title: "Un seul lien",
    body: "Français, arabe, anglais : la même émotion dans la langue de chacun, l'arabe composé en vraie calligraphie, de droite à gauche. Un lien unique, prêt pour WhatsApp comme pour les aînés.",
    pane: <LinkPane />,
  },
];

export function Acts() {
  const root = useRef<HTMLElement | null>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const panes = gsap.utils.toArray<HTMLElement>(".act-pane");
        const items = gsap.utils.toArray<HTMLElement>(".act-item");
        gsap.set(panes, { opacity: 0, scale: 0.985 });
        gsap.set(panes[0], { opacity: 1, scale: 1 });

        const show = (i: number) => {
          setCurrent(i);
          panes.forEach((p, j) => {
            gsap.to(p, {
              opacity: j === i ? 1 : 0,
              scale: j === i ? 1 : 0.985,
              duration: 0.55,
              ease: "power2.out",
              overwrite: "auto",
            });
          });
        };

        items.forEach((item, i) => {
          ScrollTrigger.create({
            trigger: item,
            start: "top 55%",
            end: "bottom 55%",
            onEnter: () => show(i),
            onEnterBack: () => show(i),
          });
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="actes" className="relative scroll-mt-20 bg-champagne py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal variant="rise" className="mx-auto max-w-2xl text-center">
          <h2 className="font-body text-[clamp(2.1rem,5vw,3.6rem)] leading-[1.1] text-ink">
            Une invitation en <em className="text-gold-deep">cinq actes</em>
          </h2>
          <p className="mx-auto mt-7 max-w-[56ch] font-body text-[1.16rem] leading-relaxed text-ink-soft">
            3ers est un atelier, pas un g&eacute;n&eacute;rateur. Nous cousons chaque
            invitation &agrave; partir de votre histoire, puis nous la livrons comme un
            spectacle. Voici le programme.
          </p>
        </Reveal>

        <div className="mt-20 grid gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">
          {/* Sticky stage (desktop) — the panes perform here. */}
          <div className="hidden lg:block">
            <div className="sticky top-[calc(50vh-300px)]">
              <div className="relative h-[600px] overflow-hidden rounded-2xl border border-gold/35 shadow-[0_24px_60px_-30px_rgba(140,109,42,0.55)]">
                {ACTS.map((act, i) => (
                  <div key={act.numeral} className="act-pane absolute inset-0" aria-hidden={current !== i}>
                    {act.pane}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* The programme text */}
          <div>
            {ACTS.map((act, i) => (
              <article
                key={act.numeral}
                className={`act-item flex flex-col justify-center gap-6 py-16 lg:min-h-[430px] lg:py-10 ${
                  i > 0 ? "border-t border-gold/25" : ""
                }`}
              >
                <div className="flex items-baseline gap-5">
                  <span
                    className={`font-cinzel text-[15px] font-semibold tracking-[0.2em] transition-colors duration-500 ${
                      current === i ? "text-gold-deep" : "text-ink-soft/60"
                    }`}
                  >
                    Acte {act.numeral}
                  </span>
                  <span className="h-px flex-1 bg-gold/25" aria-hidden="true" />
                </div>
                <h3 className="font-body text-[clamp(1.6rem,3vw,2.2rem)] leading-tight text-ink">
                  {act.title}
                </h3>
                <p className="max-w-[54ch] font-body text-[1.14rem] leading-relaxed text-ink-soft">
                  {act.body}
                </p>

                {/* Inline pane (mobile / tablet) */}
                <div className="mt-2 overflow-hidden rounded-2xl border border-gold/35 shadow-[0_18px_44px_-24px_rgba(140,109,42,0.5)] lg:hidden">
                  <div className="h-[430px]">{act.pane}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
