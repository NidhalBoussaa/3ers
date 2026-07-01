"use client";
import { useI18n } from "@/lib/i18n";
import type { Lang } from "@/lib/schema";

const LABEL: Record<Lang, string> = { fr: "FR", ar: "عربي", en: "EN" };

export function LangSwitcher() {
  const { lang, setLang, available } = useI18n();
  return (
    <div
      role="group"
      aria-label="Language"
      className="fixed top-4 right-4 z-40 flex gap-1 rounded-full border border-gold/50 bg-cream/85 p-1 backdrop-blur-md shadow-lg"
      style={{ top: `calc(1rem + var(--safe-top))` }}
    >
      {available.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`px-3 py-1.5 text-[10px] tracking-widest rounded-full font-cinzel transition ${
            lang === l
              ? "bg-gold text-white"
              : "text-gold-deep hover:bg-gold/10"
          }`}
        >
          {LABEL[l]}
        </button>
      ))}
    </div>
  );
}
