# Product

## Register

brand

## Users

Affluent couples — primarily Tunisian / Maghrebi — commissioning a wedding invitation that signals taste and means. They send a single link to family and guests, many of whom open it on a phone, at a glance, often older and less tech-fluent than the couple. The couple is the buyer; the guest is the audience. The invitation is sold as a per-couple SaaS template: the whole experience renders from one typed config (`data/wedding.json`), so winning one couple means the artifact has to feel bespoke, not templated.

The job to be done: make the guest feel *invited to something rare* the moment the link opens — and make the couple feel the invitation is worthy of the wedding they're paying for. It must read flawlessly in French, Arabic (RTL), and English, and hold its composure on a small screen as well as a large one.

## Product Purpose

A trilingual (FR / AR / EN), single-page, immersive wedding invitation — the design *is* the product. It exists to replace the generic free e-invite with something that feels like a couture house sent it: an entrance film, ceremonial typography, a Quranic blessing, a live countdown, the venue and program, RSVP, and a guestbook, composed as one continuous cinematic scroll.

Success: a guest's first reaction is "this is beautiful / this looks expensive," not "this is an app." The couple forwards it with pride. Nothing on screen reads as a stock template, a SaaS landing page, or a free invite-maker. The artifact carries the wedding's prestige before a single word is read.

## Brand Personality

**Couture, ceremonial, intimate.** The voice of a fashion house's invitation, not a vendor's product page: quiet confidence, generous negative space, a single gleam of gold rather than a coat of it. Warm where a Maghrebi celebration should be warm — candlelight, not fluorescent — but never loud. Reverent (the blessing is sacred, treated with weight, not decoration) and personal (these two names, this one night).

Emotional goals, in order: **reverence → anticipation → belonging → delight.** The reader should feel honored to be included, drawn toward the date, part of something, and quietly charmed by the craft — in that sequence as they scroll.

Reference feel: a Dior or Chanel invitation — serif wordmarks, cinematic film, restrained metallics, confidence carried by space and timing rather than ornament density.

## Anti-references

- **Generic free e-invite sites** (Canva / Zola / Greenvelope template look): clip-art florals, sticker confetti, cartoon hearts, drag-and-drop stock layouts. The single biggest tell to avoid — it cheapens everything.
- **Corporate / SaaS-landing patterns**: hero-metric blocks, identical icon-heading-text card grids, gradient feature heroes, navy-and-gold fintech palettes, "dashboard" energy. This is a celebration, not a product page.
- **Over-the-top gold kitsch**: gaudy maximalist gold — glitter overload, heavy bevels and drop shadows, gold-on-gold-on-gold, Vegas-wedding-chapel ornamentation. Gold is a precious accent, used sparingly; it is never the whole surface.
- **Cold minimalism**: sterile Scandinavian wedding-card emptiness that reads as emotionless. The warmth and ceremony of a Maghrebi wedding must come through; restraint is not the same as absence of feeling.

## Design Principles

1. **The experience is the gift.** Treat the invitation as a cinematic event, not a document. Entrance, pacing, reveals, and ambient motion are the product — luxury is *felt* through timing and atmosphere, not declared in copy. Every transition should feel slow, intentional, and expensive.

2. **Gold is jewelry, not paint.** One gleam reads as precious; a coat reads as cheap. Carry richness through deep night tones, warm cream, generous space, and refined serif type — let gold appear as a highlight, a rule, a name, a single thread. Restraint is what separates couture from kitsch.

3. **Space is the status symbol.** Confidence is shown by what's left out. Generous margins, room around the names, unhurried vertical rhythm. Crowding reads as a free template; breathing room reads as means.

4. **Reverence before decoration.** The sacred elements (the blessing, the names, the date) are the emotional spine and are treated with weight and stillness — never dressed up as ornaments. Decoration serves the ceremony; it never competes with it.

5. **Trilingual is first-class, not bolted on.** French, Arabic, and English each get type and rhythm worthy of the language — Arabic is set in a proper Arabic face with correct RTL, not a Latin layout with translated strings. The invitation must look intentional in all three, on the first paint.

6. **Phone-first, heirloom-grade.** Most guests open the link on a phone; many are older. The first paint must be composed, legible, and beautiful on a small screen, and degrade gracefully — large tap targets, readable type, no reliance on hover. It scales *up* to a large screen, but it is born on a phone.

## Accessibility & Inclusion

Best-effort, not a strict formal bar — but craft-led, because legibility and care are part of the luxury, and the guest list skews older.

- **Contrast**: keep body text comfortably readable against its background (aim ≥4.5:1); gold-on-cream and muted-on-tinted backgrounds are the watch-outs. Never sacrifice readability for "elegance."
- **Motion**: honor `prefers-reduced-motion` everywhere — every reveal, particle, and film has a calm, static fallback (already in place; keep it).
- **RTL & language**: Arabic must render correctly right-to-left with a true Arabic typeface; the layout, not just the text, flips where it should.
- **Touch & elders**: comfortable tap targets and readable type sizes; no interaction that depends on hover or fine pointing.
- **Resilience**: the invitation must still read if video, music, or images fail to load — the core (names, date, venue, blessing) is always legible.
