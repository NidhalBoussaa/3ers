"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Lang, Localized, WeddingConfig } from "./schema";
import { LANGS, pick } from "./schema";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  available: readonly Lang[];
  config: WeddingConfig;
  t: (loc: Localized) => string;
  introDone: boolean;
  markIntroDone: () => void;
  userTapped: boolean;          // set when the orb is tapped — the first user gesture
  markUserTapped: () => void;
};

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({
  config,
  children,
}: {
  config: WeddingConfig;
  children: ReactNode;
}) {
  const initial = (config.i18n.default ?? "fr") as Lang;
  const available = (config.i18n.available?.length
    ? config.i18n.available
    : LANGS) as readonly Lang[];
  const [lang, setLangState] = useState<Lang>(initial);
  const [introDone, setIntroDone] = useState(false);
  const [userTapped, setUserTapped] = useState(false);

  // hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`lang_${config.couple.monogram}`) as Lang | null;
      if (saved && available.includes(saved)) setLangState(saved);
    } catch {}
  }, [available, config.couple.monogram]);

  // reflect into <html> and <body>
  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === "ar" ? "rtl" : "ltr";
    const body = document.body;
    body.classList.remove("lang-fr", "lang-ar", "lang-en");
    body.classList.add(`lang-${lang}`);
  }, [lang]);

  const markIntroDone = useCallback(() => setIntroDone(true), []);
  const markUserTapped = useCallback(() => setUserTapped(true), []);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      available,
      config,
      setLang: (l) => {
        setLangState(l);
        try { localStorage.setItem(`lang_${config.couple.monogram}`, l); } catch {}
      },
      t: (loc) => pick(loc, lang),
      introDone,
      markIntroDone,
      userTapped,
      markUserTapped,
    }),
    [lang, available, config, introDone, markIntroDone, userTapped, markUserTapped],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
