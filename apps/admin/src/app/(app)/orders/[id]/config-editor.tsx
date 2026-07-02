"use client";

import { useState, useTransition } from "react";
import { publishConfig, saveConfigDraft } from "./actions";

type SchemaField = {
  key: string;
  type: "text" | "date" | "textarea";
  label: string;
  required: boolean;
  /** Fields only the admin edits (media paths, computed dates); hidden in the client portal. */
  adminOnly?: boolean;
};

export function ConfigEditor({
  orderId,
  configDraft,
  configLive,
  templateSchema,
}: {
  orderId: string;
  configDraft: Record<string, unknown> | null;
  configLive: Record<string, unknown> | null;
  templateSchema: SchemaField[] | null;
}) {
  const draft = (configDraft ?? {}) as Record<string, string>;
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries((templateSchema ?? []).map((f) => [f.key, draft[f.key] ?? ""]))
  );
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function set(key: string, val: string) {
    setValues((v) => ({ ...v, [key]: val }));
    setSaved(false);
  }

  function handleSave() {
    setError("");
    startTransition(async () => {
      await saveConfigDraft(orderId, values);
      setSaved(true);
    });
  }

  function handlePublish() {
    setError("");
    const missing = (templateSchema ?? []).filter((f) => f.required && !values[f.key]?.trim());
    if (missing.length) {
      setError(`Champs requis manquants : ${missing.map((f) => f.label).join(", ")}`);
      return;
    }
    startTransition(() => publishConfig(orderId, buildConfigLive(values)));
  }

  if (!templateSchema || templateSchema.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-zinc-200 p-6">
        <h2 className="text-sm font-medium text-zinc-500 mb-3">Configuration</h2>
        <p className="text-sm text-zinc-400">Aucun template assigné à cette commande.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-zinc-500">Configuration</h2>
        <div className="flex items-center gap-2">
          {configLive && (
            <span className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5">
              Live publié
            </span>
          )}
          {saved && (
            <span className="text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-2.5 py-0.5">
              Brouillon sauvegardé
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={pending}
            className="text-xs px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 font-medium hover:bg-zinc-50 disabled:opacity-50 transition"
          >
            Sauvegarder
          </button>
          <button
            onClick={handlePublish}
            disabled={pending}
            className="text-xs px-3 py-1.5 rounded-lg text-white font-medium disabled:opacity-50 transition"
            style={{ backgroundColor: "#c9a44c" }}
          >
            {pending ? "Publication…" : "Publier"}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        {templateSchema.map((field) => (
          <div key={field.key} className={field.type === "textarea" ? "col-span-2" : ""}>
            <label className="block text-xs font-medium text-zinc-500 mb-1">
              {field.label}
              {field.required && <span className="text-red-400 ml-0.5">*</span>}
              {field.adminOnly && (
                <span className="ml-1.5 text-[10px] uppercase tracking-wide text-zinc-400 bg-zinc-100 rounded px-1 py-0.5 align-middle">
                  admin
                </span>
              )}
            </label>
            {field.type === "textarea" ? (
              <textarea
                value={values[field.key] ?? ""}
                onChange={(e) => set(field.key, e.target.value)}
                rows={3}
                className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-zinc-50 resize-none"
              />
            ) : (
              <input
                type="text"
                value={values[field.key] ?? ""}
                onChange={(e) => set(field.key, e.target.value)}
                className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-zinc-50"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Build the full WeddingConfig by merging couple/date/venue overrides into the base template.
// Everything else (theme, i18n, story, program, features, assets, etc.) comes from the base.
const BASE_CONFIG: Record<string, unknown> = {
  theme: { gold: "#c9a44c", goldBright: "#f1d894", goldSoft: "#e7cf8e", goldDeep: "#8c6d2a", cream: "#faf6ec", night: "#0b0805" },
  i18n: {
    default: "ar",
    available: ["ar"],
    labels: {
      greeting: { fr: "Bonjour", ar: "أهلاً", en: "Hi" },
      invitedTo: { fr: "VOUS ÊTES CONVIÉS AU MARIAGE DE", ar: "تتشرفون بحضور حفل زفاف", en: "YOU ARE INVITED TO THE WEDDING OF" },
      verse: "﴿ وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ﴾",
      verseSign: "صدق الله العظيم",
      withGodsBlessing: { fr: "— AVEC L'AGRÉMENT DE DIEU —", ar: "— بإذن الله تعالى —", en: "— WITH GOD'S BLESSING —" },
      inviteLead: { fr: "Nous avons la joie et l'honneur de vous inviter à célébrer notre union", ar: "يسرّنا ويشرّفنا حضوركم لمشاركتنا أجمل لحظات حياتنا", en: "We joyfully invite you to celebrate our union" },
      ceremonyLead: { fr: "vous convient à leur cérémonie de mariage", ar: "ويدعوانكم لحضور حفل زفافهما", en: "request the honour of your presence at their wedding" },
      daysLeft: { fr: "JOURS RESTANTS", ar: "الأيام المتبقية", en: "DAYS LEFT" },
      cdLabels: { fr: ["JOURS","HEURES","MIN","SEC"], ar: ["أيام","ساعات","دقائق","ثواني"], en: ["DAYS","HOURS","MIN","SEC"] },
      addToCalendar: { fr: "AJOUTER AU CALENDRIER", ar: "أضف إلى التقويم", en: "ADD TO CALENDAR" },
      directions: { fr: "ITINÉRAIRE", ar: "الاتجاهات", en: "DIRECTIONS" },
      viewMap: { fr: "VOIR LA CARTE", ar: "عرض الخريطة", en: "VIEW MAP" },
      venueLabel: { fr: "LE LIEU", ar: "قاعة الحفل", en: "THE VENUE" },
      ourStory: { fr: "NOTRE HISTOIRE", ar: "قصتنا", en: "OUR STORY" },
      ourMoments: { fr: "NOS PLUS BEAUX MOMENTS", ar: "أجمل لحظاتنا", en: "OUR FAVOURITE MOMENTS" },
      program: { fr: "DÉROULEMENT DE LA SOIRÉE", ar: "برنامج الحفل", en: "EVENING PROGRAM" },
      dressCode: { fr: "CODE VESTIMENTAIRE · ÉLÉGANT", ar: "الزي · أنيق", en: "DRESS CODE · ELEGANT" },
      rsvp: { fr: "RSVP", ar: "تأكيد الحضور", en: "RSVP" },
      confirmAttendance: { fr: "Confirmez votre présence", ar: "أكّدوا حضوركم", en: "Confirm your attendance" },
      fullName: { fr: "Nom complet", ar: "الاسم الكامل", en: "Full name" },
      willAttend: { fr: "JE SERAI PRÉSENT(E)", ar: "سأحضر", en: "I WILL ATTEND" },
      wontAttend: { fr: "EMPÊCHÉ(E)", ar: "معتذر", en: "CAN'T MAKE IT" },
      person: { fr: "personne", ar: "شخص", en: "person" },
      people: { fr: "personnes", ar: "أشخاص", en: "people" },
      messagePlaceholder: { fr: "Un petit mot (optionnel)", ar: "كلمة جميلة (اختياري)", en: "A short message (optional)" },
      send: { fr: "ENVOYER", ar: "إرسال", en: "SEND" },
      thanksAttend: { fr: "Merci {name} ! On a hâte 💛", ar: "شكرًا {name}! في انتظاركم 💛", en: "Thank you {name}! Can't wait 💛" },
      thanksNoAttend: { fr: "Merci {name}, vous nous manquerez", ar: "شكرًا {name}، ستفتقدكم", en: "Thank you {name}, you'll be missed" },
      guestbook: { fr: "LIVRE D'OR · VOS VŒUX", ar: "سجل التهاني", en: "GUESTBOOK · WISHES" },
      yourName: { fr: "Votre nom", ar: "اسمك", en: "Your name" },
      yourWish: { fr: "Votre vœu", ar: "دعاؤكم وتهانيكم", en: "Your wish" },
      postWish: { fr: "PUBLIER MON VŒU", ar: "انشر تهنئتك", en: "POST WISH" },
      emptyWishes: { fr: "Soyez le premier à laisser un vœu ✨", ar: "كن أول من يكتب تهنئة ✨", en: "Be the first to leave a wish ✨" },
      closing: { fr: "Votre présence sera le plus beau<br/>des cadeaux", ar: "حضوركم أجمل هدية لنا", en: "Your presence is the<br/>greatest gift" },
      share: { fr: "Partager l'invitation", ar: "شارك الدعوة", en: "Share the invitation" },
      copy: { fr: "Copier", ar: "نسخ", en: "Copy" },
    },
  },
  story: [
    { icon: "heart", title: { fr: "LA RENCONTRE", ar: "اللقاء", en: "WE MET" }, text: { fr: "Le jour où tout a commencé", ar: "اليوم الذي بدأ فيه كل شيء", en: "The day it all began" } },
    { icon: "ring", title: { fr: "LES FIANÇAILLES", ar: "الخطوبة", en: "ENGAGEMENT" }, text: { fr: "Une promesse pour la vie", ar: "وعدٌ مدى الحياة", en: "A promise for life" } },
    { icon: "star", title: { fr: "LE GRAND JOUR", ar: "اليوم الكبير", en: "THE BIG DAY" }, text: { fr: "", ar: "", en: "" } },
  ],
  program: [
    { time: "21:00", name: { fr: "Réception", ar: "الاستقبال", en: "Reception" } },
    { time: "22:00", name: { fr: "Dîner", ar: "العشاء", en: "Dinner" } },
    { time: "23:00", name: { fr: "Cérémonie & Gâteau", ar: "المراسم والكعكة", en: "Ceremony & Cake" } },
    { time: "00:00", name: { fr: "Soirée dansante", ar: "سهرة ورقص", en: "Dancing" } },
  ],
  dressCode: ["#1c2433", "#6b4f2a", "#c9a44c", "#e7dcc4"],
  gallery: [],
  features: { music: true, video: true, guestbook: true, rsvp: true, gallery: true, share: true, photo: false, calendar: true },
  contact: { email: "celebriocontact@gmail.com" },
  studio: {
    name: "استوديو الدعوات",
    tagline: { fr: "Créez votre propre invitation de mariage", ar: "صمّم دعوة زفافك الخاصة", en: "Design your own wedding invitation" },
    instagram: "https://www.instagram.com/celebriodigital/",
    email: "celebriocontact@gmail.com",
  },
  assets: {
    introVideo: "/Esmiralda.mp4", introVideoWebm: "/Esmiralda.webm", introPoster: "/Esmiralda.jpg",
    landingVideo: "/Landing.mp4", landingVideoWebm: "/Landing.webm", landingPoster: "/Landing.jpg",
    music: "/music.mp3", venuePhoto: "/mawazine.jpg", venuePhotoWebp: "/mawazine.webp", logoGold: "/logo-gold.png",
  },
  shareText: { fr: "", ar: "", en: "" },
};

// Normalize whatever the admin typed into a full offset datetime that satisfies
// the invite schema's `z.string().datetime({ offset: true })`. Accepts:
//   "2026-07-17"                  (bare date)        + optional "21:30" time
//   "2026-07-17T21:30"            (local datetime)
//   "2026-07-17T21:30:00+01:00"   (already valid)    → passed through
// Returns "" if the input isn't a parseable date, so callers can fall back.
// TUNISIA_OFFSET is +01:00 (no DST); adjust if you localize elsewhere.
const TUNISIA_OFFSET = "+01:00";

function toOffsetIso(raw: string, timeHint = ""): string {
  const value = raw.trim();
  if (!value) return "";

  // Already a full offset datetime (ends in Z or ±HH:MM after a T)? Keep it.
  if (/T\d{2}:\d{2}.*(Z|[+-]\d{2}:\d{2})$/.test(value)) return value;

  // Split into date + time parts, tolerating "date", "dateThh:mm", "date hh:mm".
  const [datePart, timePartRaw] = value.includes("T")
    ? value.split("T")
    : value.split(/\s+/);
  const dateMatch = /^\d{4}-\d{2}-\d{2}$/.test(datePart);
  if (!dateMatch) {
    // Last resort: let Date try, then re-emit with offset.
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? "" : d.toISOString();
  }

  // Time: prefer an explicit time in the value, else the "Heure (FR)" hint, else noon.
  const time = (timePartRaw ?? "").trim() || extractTime(timeHint) || "12:00";
  const hhmm = /^\d{1,2}:\d{2}/.test(time) ? padTime(time) : "12:00:00";
  return `${datePart}T${hhmm}${TUNISIA_OFFSET}`;
}

// Pull a "HH:MM" out of a free-text time field like "21h30" or "21:30 · Bouhjar".
function extractTime(hint: string): string {
  const m = hint.match(/(\d{1,2})[h:](\d{2})/);
  return m ? `${m[1]}:${m[2]}` : "";
}

function padTime(t: string): string {
  const [h, m] = t.split(":");
  return `${h.padStart(2, "0")}:${(m ?? "00").slice(0, 2)}:00`;
}

// Add N whole days to an offset ISO datetime, preserving the time-of-day and offset.
// Returns "" if the start isn't a parseable date.
function addDaysIso(startIso: string, days: number): string {
  const d = new Date(startIso);
  if (Number.isNaN(d.getTime())) return "";
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function buildConfigLive(v: Record<string, string>): Record<string, unknown> {
  const gf = v.groom_first ?? "";
  const bf = v.bride_first ?? "";

  // Normalize the start into a full offset datetime (schema requires it).
  // A bare date gets its time from the "Heure (FR)" field.
  const start = toOffsetIso(v.wedding_date_iso ?? "", v.time_display_fr ?? "");

  // End of the celebration window (drives the calendar event span).
  // Priority: explicit end ISO → start + N days → start itself.
  const days = parseInt(v.wedding_days ?? "", 10);
  const endIso =
    toOffsetIso(v.wedding_end_iso ?? "", v.time_display_fr ?? "") ||
    (Number.isFinite(days) && days > 1 ? addDaysIso(start, days - 1) : "") ||
    start;

  // Only override an asset when the field is filled — blanks keep the bundled
  // defaults from BASE_CONFIG.assets. WebM/poster/webp variants are cleared so
  // the browser doesn't try to load a stale companion of a replaced file.
  const baseAssets = BASE_CONFIG.assets as Record<string, string>;
  const assets: Record<string, string | undefined> = { ...baseAssets };
  if (v.music_url?.trim()) assets.music = v.music_url.trim();
  if (v.intro_video_url?.trim()) {
    assets.introVideo = v.intro_video_url.trim();
    assets.introVideoWebm = undefined;
    assets.introPoster = undefined;
  }
  if (v.landing_video_url?.trim()) {
    assets.landingVideo = v.landing_video_url.trim();
    assets.landingVideoWebm = undefined;
    assets.landingPoster = undefined;
  }
  if (v.venue_photo_url?.trim()) {
    assets.venuePhoto = v.venue_photo_url.trim();
    assets.venuePhotoWebp = undefined;
  }

  return {
    ...BASE_CONFIG,
    assets,
    couple: {
      groom: { first: gf, last: v.groom_last ?? "" },
      bride: { first: bf, last: v.bride_last ?? "" },
      monogram: `${gf[0] ?? "?"}&${bf[0] ?? "?"}`,
    },
    date: {
      iso: start,
      endIso,
      display: {
        fr: v.date_display_fr ?? "",
        ar: v.date_display_ar ?? v.date_display_fr ?? "",
        en: v.date_display_en ?? v.date_display_fr ?? "",
      },
      short: v.date_short ?? "",
      timeDisplay: {
        fr: v.time_display_fr ?? "",
        ar: v.time_display_fr ?? "",
        en: v.time_display_fr ?? "",
      },
    },
    venue: {
      name: { fr: v.venue_name_fr ?? "", ar: v.venue_name_ar ?? v.venue_name_fr ?? "", en: v.venue_name_fr ?? "" },
      city: { fr: v.venue_city_fr ?? "", ar: v.venue_city_ar ?? v.venue_city_fr ?? "", en: v.venue_city_fr ?? "" },
      mapsQuery: v.venue_maps ?? "",
    },
    shareText: {
      fr: `Vous êtes invités au mariage de ${gf} & ${bf}`,
      ar: `أنتم مدعوون إلى حفل زفاف ${gf} و ${bf}`,
      en: `You're invited to the wedding of ${gf} & ${bf}`,
    },
  };
}
