# Marketing — Landing Page

`apps/marketing` · Next.js App Router · Port 3001

---

## Purpose

Convert affluent Tunisian/Maghrebi couples into paying clients. The page must carry the same brand register as the invitation itself — couture, cinematic, restrained. No SaaS-landing patterns.

---

## Routes

| Route | Page |
|---|---|
| `/` | Main landing page |
| `/preview/[templateId]` | Live invitation preview for a given template |
| `/legal/privacy` | Privacy policy |
| `/legal/terms` | Terms of service |

---

## Page sections (scroll order)

### 1. Hero
- Full-bleed dark entrance — same night tone as the invitation (`#0b0805`)
- Animated couple name placeholder fades in (Cinzel Decorative)
- Subline in Cormorant Garamond, quiet, one line
- Single CTA: **"Request Your Invitation"** → scrolls to contact form or `/portal/request`
- No nav bar on load — appears on first scroll (transparent → ink background)

### 2. Experience reel
- Looping video or live iframe of the invitation scrolling
- No caption, no feature bullets — the product speaks
- "See it live →" link opens a full-page preview in a modal or new tab

### 3. How it works
- 3 steps, typographic, numbered — no icons
  1. Request your invitation
  2. Personalise your details
  3. Share one link with your guests
- Horizontal on desktop, vertical stack on mobile

### 4. Showcase / past couples
- Grid of couple name + wedding date cards (with their permission)
- Each card links to `/preview/[templateId]` or a static live link
- Blank state if no couples yet: show template demo

### 5. Pricing
- Clean, two-tier: **Essentiel** / **Prestige**
- Price visible — signals confidence and filters clients
- Short bullet list of what's included per tier
- No toggle, no enterprise tier

| | Essentiel | Prestige |
|---|---|---|
| Languages | FR or AR | FR + AR + EN |
| RSVP | Basic | Full + Guestbook |
| Photo uploads | 1 | 2 |
| Revisions | 1 round | 3 rounds |
| Delivery | 5 days | 2 days |
| Price | €149 | €249 |

### 6. Testimonials
- 2–3 real couple quotes
- Name + wedding date, no avatar, no stars
- Typeset as pull-quotes, large Cormorant Garamond italic

### 7. FAQ
- Accordion, plain text answers
- Topics: delivery time, languages, RSVP data/privacy, what happens after purchase, custom photos, how to share the link

### 8. Request form / CTA
- Full-width section, dark background
- Fields: partner names (×2), wedding date, preferred language, email, message (optional)
- On submit: creates an `orders` row with `status: 'new'`, sends admin notification email, redirects to "thank you" page
- No Stripe yet at this step — payment comes after admin configures the order

### 9. Footer
- Logo wordmark
- Nav: Showcase · Pricing · FAQ · Contact
- Instagram link
- Legal links (Privacy · Terms)
- `© 2026 3ers`

---

## Component plan

| Component | Notes |
|---|---|
| `<NavBar>` | Transparent → ink on scroll, sticky |
| `<HeroSection>` | Video background, GSAP name reveal |
| `<ExperienceReel>` | Lazy-loaded iframe or `<video>` |
| `<HowItWorks>` | Numbered steps, no icons |
| `<ShowcaseGrid>` | `orders` filtered by `status: live` + client opt-in flag |
| `<PricingCards>` | Static, no DB query |
| `<TestimonialsBlock>` | Static MDX or hardcoded |
| `<FAQAccordion>` | Radix Accordion |
| `<RequestForm>` | React Hook Form + Zod, POST to `/api/orders` |
| `<Footer>` | Static |

---

## API routes

| Method | Route | Action |
|---|---|---|
| `POST` | `/api/orders` | Create new order, send admin email |

---

## Design notes

- Palette from DESIGN.md: `night #0b0805`, `cream #faf6ec`, `gold #c9a44c`
- No hero metric blocks, no gradient cards, no icon grids
- All CTAs use `button-gold` variant (transparent border, gold text, fills on hover)
- Body copy: Cormorant Garamond 18px, ink-soft on cream
- Section spacing: generous — 120px+ vertical gaps on desktop
