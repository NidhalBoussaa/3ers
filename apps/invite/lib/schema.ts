import { z } from "zod";

export const LANGS = ["fr", "ar", "en"] as const;
export type Lang = (typeof LANGS)[number];

const localized = z.object({
  fr: z.string(),
  ar: z.string(),
  en: z.string(),
});
export type Localized = z.infer<typeof localized>;

const partial = z.object({
  fr: z.string().optional(),
  ar: z.string().optional(),
  en: z.string().optional(),
});

const personName = z.object({
  first: z.string().min(1),
  last: z.string().min(1),
});

const story = z.object({
  icon: z.enum(["heart", "ring", "star"]),
  title: localized,
  text: localized,
});

const programItem = z.object({
  time: z.string().regex(/^\d{1,2}:\d{2}$/, "HH:MM"),
  name: localized,
});

const venue = z.object({
  name: localized,
  city: localized,
  mapsQuery: z.string().min(1),
});

const couple = z.object({
  groom: personName,
  bride: personName,
  monogram: z.string().min(1).default("F&E"),
});

const dates = z.object({
  iso: z.string().datetime({ offset: true }),
  endIso: z.string().datetime({ offset: true }),
  display: localized,
  short: z.string(),
  timeDisplay: localized,
});

const CSS_COLOR = z
  .string()
  .regex(/^#[0-9a-fA-F]{3,8}$|^rgb\(|^rgba\(|^hsl\(|^hsla\(/, "Invalid CSS color");

const theme = z.object({
  gold: CSS_COLOR.default("#c9a44c"),
  goldBright: CSS_COLOR.default("#f1d894"),
  goldSoft: CSS_COLOR.default("#e7cf8e"),
  goldDeep: CSS_COLOR.default("#8c6d2a"),
  cream: CSS_COLOR.default("#faf6ec"),
  night: CSS_COLOR.default("#0b0805"),
});

const features = z.object({
  music: z.boolean().default(true),
  video: z.boolean().default(true),
  guestbook: z.boolean().default(true),
  rsvp: z.boolean().default(true),
  gallery: z.boolean().default(true),
  share: z.boolean().default(true),
  photo: z.boolean().default(true),
  calendar: z.boolean().default(true),
});

const assets = z.object({
  introVideo: z.string().default("/Esmiralda.mp4"),
  introVideoWebm: z.string().optional(),
  introPoster: z.string().optional(),
  landingVideo: z.string().optional(),
  landingVideoWebm: z.string().optional(),
  landingPoster: z.string().optional(),
  music: z.string().default("/music.mp3"),
  photo: z.string().optional(),
  venuePhoto: z.string().optional(),
  venuePhotoWebp: z.string().optional(),
  logoGold: z.string().default("/logo-gold.png"),
});

const labels = z.object({
  greeting: localized,
  invitedTo: localized,
  verse: z.string(),
  verseSign: z.string(),
  withGodsBlessing: localized,
  inviteLead: localized,
  ceremonyLead: localized,
  daysLeft: localized,
  cdLabels: z.object({
    fr: z.tuple([z.string(), z.string(), z.string(), z.string()]),
    ar: z.tuple([z.string(), z.string(), z.string(), z.string()]),
    en: z.tuple([z.string(), z.string(), z.string(), z.string()]),
  }),
  addToCalendar: localized,
  directions: localized,
  viewMap: localized,
  venueLabel: localized.optional(),
  ourStory: localized,
  ourMoments: localized,
  program: localized,
  dressCode: localized,
  rsvp: localized,
  confirmAttendance: localized,
  fullName: localized,
  willAttend: localized,
  wontAttend: localized,
  person: localized,
  people: localized,
  messagePlaceholder: localized,
  send: localized,
  thanksAttend: localized,   // contains {name}
  thanksNoAttend: localized, // contains {name}
  guestbook: localized,
  yourName: localized,
  yourWish: localized,
  postWish: localized,
  emptyWishes: localized,
  closing: localized,         // may contain <br>
  share: localized,
  copy: localized,
});

export const WeddingConfigSchema = z.object({
  couple,
  date: dates,
  venue,
  theme,
  i18n: z.object({
    default: z.enum(LANGS).default("fr"),
    available: z.array(z.enum(LANGS)).default([...LANGS]),
    labels,
  }),
  story: z.array(story),
  program: z.array(programItem),
  dressCode: z.array(z.string()),
  gallery: z.array(z.string()).default([]),
  features,
  contact: z.object({ email: z.email().or(z.string()) }),
  /** The invitation studio behind the site — "build your own" contact block. */
  studio: z.object({
    name: z.string().default("استوديو الدعوات"),
    tagline: localized.default({
      fr: "Créez votre propre invitation de mariage",
      ar: "صمّم دعوة زفافك الخاصة",
       en: "Design your own wedding invitation",
    }),
    instagram: z.string().default("@your_studio"),
    email: z.string().default("celebriocontact@gmail.com"),
  }),
  assets,
  shareText: localized,
});

export type WeddingConfig = z.infer<typeof WeddingConfigSchema>;

/** Pick a localized string with sensible fallback. */
export function pick(loc: Localized, lang: Lang): string {
  return loc[lang] || loc.fr || loc.en || loc.ar || "";
}
