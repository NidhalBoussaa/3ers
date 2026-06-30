---
name: 3ers — Wedding Invitation
description: A couture-house luxury, trilingual wedding invitation. Night, cream, and a single gleam of gold.
colors:
  gold: "#c9a44c"
  gold-bright: "#f1d894"
  gold-soft: "#e7cf8e"
  gold-deep: "#8c6d2a"
  champagne: "#f7f1e3"
  cream: "#faf6ec"
  ink: "#2c2114"
  ink-soft: "#5b4e3a"
  night: "#0b0805"
typography:
  display:
    fontFamily: "Cinzel Decorative, serif"
    fontSize: "clamp(34px, 11vw, 72px)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.01em"
  script:
    fontFamily: "Great Vibes, cursive"
    fontSize: "clamp(26px, 7vw, 38px)"
    fontWeight: 400
    lineHeight: 1.1
  headline:
    fontFamily: "Cinzel, serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "5px"
  arabic:
    fontFamily: "Amiri, serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.9
  body:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  card: "1rem"
  field: "0.75rem"
  pill: "9999px"
spacing:
  xs: "8px"
  sm: "14px"
  md: "20px"
  lg: "28px"
  xl: "70px"
components:
  button-gold:
    backgroundColor: "transparent"
    textColor: "{colors.gold-deep}"
    rounded: "{rounded.pill}"
    padding: "13px 26px"
  button-gold-hover:
    backgroundColor: "{colors.gold}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "13px 26px"
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "48px"
  card:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "24px"
  input:
    backgroundColor: "#ffffff99"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "0 14px"
    height: "48px"
---

# Design System: 3ers — Wedding Invitation

## 1. Overview

**Creative North Star: "The Gilded Envelope"**

This is a hand-pressed invitation sealed in gold — a single, continuous, cinematic scroll that opens like an object rather than loads like a page. The world is **night and candlelight**: a deep near-black entrance gives way to a warm cream "stage," lit from the edges by faint gold radial glows and framed by two hairline gold rails. Onto that warm field, ceremonial serif type, a Quranic blessing, the couple's names rendered as gold leaf, and a live countdown are revealed slowly as the reader scrolls. The design *is* the product; its job is to make the guest feel invited to something rare.

The personality is **couture, ceremonial, intimate** — the voice of a fashion house's invitation (Dior/Chanel), not a vendor's product page. Confidence is carried by **space and timing**, not ornament density. Gold is treated as a precious metal: it appears as a name, a hairline rule, a single seal — never as a coat. Warmth comes from the cream field, the candlelit glows, and the serif type; it is never manufactured by tinting everything beige. The system is trilingual at its core — French, Arabic (true RTL, set in Amiri), and English each get type and rhythm worthy of the language.

This system **explicitly rejects**: the clip-art, sticker-confetti look of free e-invite makers (Canva/Zola/Greenvelope); corporate / SaaS-landing patterns (hero-metric blocks, identical icon-card grids, gradient feature heroes, navy-and-gold fintech palettes); over-the-top gold kitsch (glitter overload, heavy bevels, gold-on-gold-on-gold); and cold Scandinavian minimalism that would read as emotionless for a Maghrebi celebration.

**Key Characteristics:**
- Night-to-cream cinematic arc; candlelight, not fluorescence.
- Gold as jewelry — a single gleam, never a surface.
- Generous vertical rhythm; space is the status symbol.
- Centered, framed editorial column (max ~720px) on a warm stage.
- Trilingual first-class typography (Latin serif + Amiri Arabic).
- Slow, choreographed reveal motion with full reduced-motion fallbacks.

## 2. Colors

A warm, candlelit palette built on a deep night anchor and a cream field, with a four-step gold ramp doing all the precious-metal work.

### Primary
- **Wedding Gold** (#c9a44c): The signature metal. Hairline rails and borders, ornament strokes, icon strokes, active states, the seal. The single gleam.
- **Gold Bright** (#f1d894): The catch-light. Top stop of gold gradients, focus-ring outlines, glow highlights. Used sparingly as the brightest point.
- **Gold Soft** (#e7cf8e): Mid gold for the script ampersand and soft gradient transitions.
- **Gold Deep** (#8c6d2a): The *readable* gold — all gold-colored text, labels, links, and quiet UI sit here, not on bright gold, so they hold contrast on cream.

### Neutral
- **Night** (#0b0805): The page background and the entrance. The deep candlelit dark the experience opens and closes in.
- **Cream** (#faf6ec): The stage. The warm body field the invitation is read on.
- **Champagne** (#f7f1e3): A slightly warmer cream for subtle layering within the stage gradient.
- **Ink** (#2c2114) / **Ink Soft** (#5b4e3a): Warm near-black and warm brown for body and secondary text on cream. Detail copy commonly uses #3a3020 (primary detail) and #6a5c44 (Arabic/secondary detail).

### Named Rules
**The "Gold Is Jewelry, Not Paint" Rule.** Gold appears as a highlight, a hairline, a name, or a seal — never as a fill across a surface. One gleam reads as precious; a coat reads as cheap. If a viewport has more than one element wearing the full gold gradient, you are painting, not setting a jewel — pull back.

**The Readable-Gold Rule.** Gold *text* is always **Gold Deep (#8c6d2a)**, never bright gold. Bright gold is for light (glows, focus rings, gradient catch-lights), never for words on cream — it fails contrast.

## 3. Typography

**Display Font:** Cinzel Decorative (serif) — the couple's names, set as gold leaf.
**Secondary Display:** Cinzel (serif) — all caps labels, eyebrows, buttons.
**Script Font:** Great Vibes (cursive) — the ampersand and intimate connective phrases ("vous convient à…").
**Body Font:** Cormorant Garamond (serif, with Georgia fallback) — running invitation prose, italic for warmth.
**Arabic Font:** Amiri (serif) — all Arabic text, set RTL at generous line-height (1.9).

**Character:** A stack of refined serifs and one script — engraved-invitation elegance, never a sans in sight. Cinzel's Roman-inscriptional capitals carry the ceremony; Cormorant's old-style italics carry the warmth; Great Vibes carries the intimacy; Amiri gives Arabic equal billing. The pairing reads as *printed and pressed*, not typed.

### Hierarchy
- **Display / Names** (Cinzel Decorative 700, clamp(34px,11vw,72px), line-height 1, uppercase, gold-leaf): the couple's first names, the emotional peak. Letter-spacing stays loose (≈ -0.01em / tight, never below -0.04em).
- **Script** (Great Vibes 400, clamp(26px,7vw,38px)): the ampersand and connective ceremony phrases, in Gold Deep.
- **Body** (Cormorant Garamond 400, ~1.125–1.5rem, often italic): invitation prose on cream, color #4a3e2c / Ink. Cap measure at 65–75ch (the centered column already enforces this at ~720px).
- **Label / Eyebrow** (Cinzel 500, 11px, letter-spacing 5px, uppercase, Gold Deep at ~80% opacity): section labels ("RSVP", "OUR STORY", "DAYS LEFT"), surname line, button text.
- **Arabic** (Amiri 400/700, RTL, line-height 1.9, color #6a5c44 / Ink Soft): every Arabic string, never a Latin font with translated text.

### Named Rules
**The No-Sans Rule.** This invitation has no sans-serif. Every face is a serif or a script. A sans anywhere reads as "app," and this is not an app.

**The Equal-Billing Rule.** Arabic is never an afterthought. It gets a true Arabic typeface (Amiri), correct RTL direction and mirroring, and its own line-height — not a Latin layout with the strings swapped.

## 4. Elevation

Mostly **flat and tonal**, with shadows used only as warm, diffuse candlelight under liftable cards — never as hard UI drop shadows. Depth is carried by the night-to-cream arc, the edge glows on the stage, and translucency (cards over the warm field), not by stacking gray shadows. The gold rails and ornament dividers do the structural separating that borders-and-boxes would do in a product UI.

### Shadow Vocabulary
- **Card rest** (`box-shadow: 0 10px 30px -18px rgba(140,109,42,.6)`): a soft, warm gold-brown glow beneath detail cards — looks like candlelight pooling under the card, not a gray drop shadow.
- **Card hover** (`box-shadow: 0 18px 40px -18px rgba(140,109,42,.65)` + `translateY(-6px)`): the card lifts toward the light on hover.
- **Floating controls** (`shadow-lg` on the lang pill / dock): just enough to detach floaters from the scroll.

### Named Rules
**The Candlelight-Shadow Rule.** Shadows are warm (gold-brown `rgba(140,109,42,…)`), tightly negative-spread, and soft. A neutral-gray or hard-edged shadow is forbidden — it would read as a generic web card and break the candlelit world.

## 5. Components

### Buttons
- **Shape:** Full pill (`9999px`) for all primary actions; tags and toggles also pill.
- **Gold outline button (`.btn-gold`)** — calendar / directions: transparent with a 1px gold border, Cinzel 11px text in Gold Deep, 2px letter-spacing. **Signature behavior:** on hover, a gold fill *sweeps in from the left* (`::before` translateX) and the text turns white. Focus-visible: 2px Gold Bright outline, 3px offset.
- **Primary gradient button** (RSVP send): a left-to-right `gold-deep → gold → gold-bright` gradient fill, white Cinzel text, 3px tracking, 48px tall, pill. This is the one place gold fills a control — it's the commit action, the single allowed gleam in its viewport.
- **Hover/Focus:** transitions are slow (~0.4s) and eased; tracking sometimes opens slightly on hover (links). Never bounce or elastic.

### Cards (Detail cards: Date / Venue / Time)
- **Corner Style:** `rounded-2xl` (1rem / 16px). Cards top out here — never the 24px+ over-rounding that reads as a template.
- **Background:** translucent vertical gradient `from-white/55 to-cream/25` over the warm stage — the card is a pane of light, not an opaque box.
- **Border:** 1px Gold at ~35% opacity (`border-gold/35`) — a hairline, not a frame.
- **Shadow:** the warm "Card rest" candlelight glow; lifts on hover (see Elevation).
- **Internal Padding:** ~20–24px. Centered content, gold stroke icon (40px) on top.
- **Rule:** cards are used *only* for the three at-a-glance facts (date/venue/time). They are not the page's structural reflex; the rest of the invitation is open, framed column — not a grid of boxes.

### Inputs / Fields (RSVP)
- **Style:** translucent white (`bg-white/60`), 1px Gold border at ~40% opacity, `rounded-xl`/`rounded-2xl`, 48px tall, serif (Cormorant) text. Placeholders in Gold Deep at ~50%.
- **Attendance toggle:** segmented pill radios — unselected is gold-outline Cinzel text; **selected fills with solid Gold and white text**. Focus-visible: 2px Gold Bright outline.
- **Select (seats):** same translucent-white + gold-border field treatment.

### Navigation (Language switcher)
- **Style:** a fixed top-right **pill toggle** — gold-bordered, `bg-cream/85` with `backdrop-blur`, three segments (FR / عربي / EN) in Cinzel 10px.
- **States:** active segment fills solid Gold with white text; inactive is Gold Deep text with a faint `gold/10` hover wash. Respects the safe-area inset.

### Ornament Divider (signature)
A centered gold SVG rule (~200px) between sections whose **strokes draw themselves** on reveal (`stroke-dasharray` animation, 1.6s), with a small gold diamond that fades in after. This is the system's structural separator in place of borders or background bands — pure gold linework on cream.

### Atmosphere layers (signature)
- **Gold vertical rails:** two hairline gold gradients down either side of the centered column — the "envelope" frame.
- **Ambient motion:** falling petals, a low-opacity dust canvas, and the night-to-cream entrance arc. All decorative, all behind content, all reduced-motion aware.

## 6. Do's and Don'ts

### Do:
- **Do** keep gold as a single gleam per viewport — a name, a hairline, a seal, one filled commit button. ("Gold Is Jewelry, Not Paint.")
- **Do** set all gold *text* in **Gold Deep (#8c6d2a)**; reserve bright gold for light (glows, focus rings, gradient catch-lights).
- **Do** give every language a real typeface — Latin serifs for FR/EN, **Amiri + RTL** for Arabic. Never swap strings into a Latin layout.
- **Do** keep shadows warm and candlelit (`rgba(140,109,42,…)`), soft, and tightly negative-spread.
- **Do** lean on space and slow, choreographed reveals to carry luxury; protect generous vertical rhythm and the ~720px centered column.
- **Do** keep cards at `rounded-2xl` (16px) and reserve them for the three at-a-glance facts only.
- **Do** ship a calm static fallback for every animation under `prefers-reduced-motion`.

### Don't:
- **Don't** make it look like a free e-invite maker — no clip-art florals, sticker confetti, cartoon hearts, or drag-and-drop stock layouts. This is the single biggest tell to avoid.
- **Don't** import corporate / SaaS-landing patterns — no hero-metric blocks, no identical icon-heading-text card grids, no gradient feature heroes, no navy-and-gold fintech palette. This is a celebration, not a product page.
- **Don't** drift into gold kitsch — no glitter overload, heavy bevels, hard drop shadows, or gold-on-gold-on-gold. Gold is precious *because* it's rare.
- **Don't** go cold-minimalist — restraint is not absence of feeling; keep the Maghrebi warmth and ceremony alive.
- **Don't** introduce a sans-serif anywhere ("The No-Sans Rule"). A sans reads as "app."
- **Don't** over-round (no 24px+ card radii) or use neutral-gray / hard-edged shadows — both read as a generic web template.
- **Don't** set gold text on bright gold or muted gold-on-cream below 4.5:1; readability is part of the luxury, and the guest list skews older.
