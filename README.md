# 3ers — Wedding invitation template

Next.js 16 + TypeScript + Tailwind 4 + shadcn/ui + Zod.
Trilingual (FR / AR / EN) one-page invitation, fully responsive, driven by a single typed config.

## Run

```bash
npm install
npm run dev
```

Open <http://127.0.0.1:3900>.

Useful URL flags:

- `?preview=1` — skip the entrance video, show the invitation immediately (used by the SaaS preview pane).

## Where data lives

The whole invitation renders from **one** file: `data/wedding.json`.
Per-couple customisation = swap that file. The shape is enforced by Zod at build time (`lib/schema.ts`).

```
data/wedding.json          ← per-couple data (names, date, story, theme, etc.)
lib/schema.ts              ← Zod schema; the source of truth for shape
lib/i18n.tsx               ← client i18n context (language + intro state)
app/layout.tsx             ← html lang/dir, fonts, JSON-LD
app/page.tsx               ← composes all sections from the parsed config
components/                ← sections + interactive bits
public/                    ← Esmiralda.mp4 + logo + poster
_legacy/                   ← the old single-file HTML template (kept for reference)
```

## Adding a couple (for the SaaS)

1. Generate a `wedding.json` matching `WeddingConfigSchema`.
2. Drop the assets (`introVideo`, `introPoster`, `photo`, `music`, `logoGold`) into `public/`.
3. Deploy. Done.

The schema parser runs in `app/page.tsx`; malformed JSON gets caught at the page-render boundary.

## Where each section lives

| Section | File |
|--|--|
| Intro orb → video → fade | `components/intro.tsx` |
| Names, surnames, monogram | `components/sections/names.tsx` |
| Bismillah + Quran verse | `components/sections/bismillah.tsx` |
| Countdown (live, hydration-safe) | `components/countdown.tsx` |
| Date / Venue / Time cards | `components/sections/detail-cards.tsx` |
| Add to Calendar + Directions | `components/calendar-button.tsx` |
| Couple photo (auto-hides if missing) | `components/sections/couple-photo.tsx` |
| Love-story timeline | `components/sections/story-timeline.tsx` |
| Photo gallery + lightbox | `components/gallery.tsx` |
| Program + dress code | `components/sections/program.tsx` |
| RSVP form | `components/rsvp-form.tsx` |
| Guestbook (localStorage) | `components/guestbook.tsx` |
| Closing words + monogram | `components/sections/closing.tsx` |
| Music + Share floaters | `components/floating-dock.tsx` |
| Language toggle | `components/lang-switcher.tsx` |
| Falling petals | `components/petals.tsx` |
| Background dust | `components/dust-canvas.tsx` |

## Theming

The `theme` block in `wedding.json` becomes CSS variables (`--gold`, `--cream`, …) injected per-page in `app/page.tsx`. Tailwind classes like `text-gold` and `bg-night` resolve to those variables — so a different couple with a different palette just changes the JSON.

## Wiring the RSVP / guestbook to a real backend

Both currently persist to `localStorage` (one bucket per `couple.monogram`). To wire to your SaaS:

- `components/rsvp-form.tsx` → replace the `localStorage.setItem` block with a `fetch('/api/rsvp', { method: 'POST', ... })`.
- `components/guestbook.tsx` → swap the `localStorage` reads for a `fetch('/api/wishes')`.

The form fields are already validated client-side and the language is available via `useI18n()`.

## Known issues

- Headless Chrome screenshots position the intro orb right-of-center; verified to render correctly in real Chrome. Use `?preview=1` to skip the intro if you only want to see the rest.
- Music auto-play is best-effort — browsers will block it without a user gesture; the music button stays paused so the user can tap to start.
