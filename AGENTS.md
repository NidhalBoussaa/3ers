# AGENTS.md

3ers — a trilingual (FR / AR / EN), single-page, immersive wedding invitation. Next.js 16 (App Router) + TypeScript + Tailwind 4 + shadcn/ui + Zod. The whole invitation renders from one typed config (`data/wedding.json`); per-couple customisation swaps that file.

See [README.md](README.md) for run instructions, file map, and where each section lives.

## Design Context

This project has design context that any agent making UI changes should respect:

- **[PRODUCT.md](PRODUCT.md)** — strategic: register, users, brand personality, anti-references, design principles.
- **[DESIGN.md](DESIGN.md)** — visual: color tokens, typography, components, motion. (Tokens are normative.)

**Register: `brand`** — the design *is* the product. This is a couture-house-luxury invitation (Dior/Chanel reference), built to feel expensive and bespoke for affluent couples, never templated.

The six design principles, in short:

1. **The experience is the gift** — cinematic, slow, intentional motion; luxury is felt through timing and atmosphere.
2. **Gold is jewelry, not paint** — one gleam reads as precious; a coat reads as cheap. Richness comes from night tones, cream, space, and serif type.
3. **Space is the status symbol** — generous margins and unhurried rhythm; crowding reads as a free template.
4. **Reverence before decoration** — the blessing, names, and date are the emotional spine; decoration never competes with the ceremony.
5. **Trilingual is first-class** — Arabic gets a true Arabic face and correct RTL, not a Latin layout with translated strings.
6. **Phone-first, heirloom-grade** — born on a phone for an older guest list; scales up to large screens.

**Avoid** (PRODUCT.md anti-references): generic free e-invite sites (Canva/Zola clip-art), corporate/SaaS-landing patterns, over-the-top gold kitsch, and cold minimalism.

When designing or editing UI, read PRODUCT.md and DESIGN.md first.
