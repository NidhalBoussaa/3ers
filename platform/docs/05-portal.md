# Client Portal (CMS)

`apps/portal` · Next.js App Router · Port 3902

---

## Purpose

Private workspace for each couple. They see their invitation, submit/edit their content, track order status, view RSVP responses, upload photos, and pay their invoice.

All config edits go to `config_draft` — admin reviews and approves before they go live. This keeps quality control in admin hands.

---

## Auth

- NextAuth.js, magic link (email) — low friction for couples
- Each session scoped to a single order (couples don't have multiple invitations)
- All `/portal/**` routes protected — redirect to `/portal/login` if unauthenticated
- After login, middleware checks that user has an associated order; if not, shows "awaiting setup" screen

---

## Routes

| Route | Page |
|---|---|
| `/portal/login` | Magic link request form |
| `/portal/login/verify` | "Check your email" confirmation |
| `/portal` | Dashboard / status overview |
| `/portal/invitation` | Live preview of their invitation |
| `/portal/content` | Content form — fill/edit all invitation fields |
| `/portal/rsvp` | RSVP response viewer |
| `/portal/photos` | Upload couple + venue photos |
| `/portal/messages` | Thread with admin |
| `/portal/billing` | Invoice status + payment link |

---

## Modules

### Dashboard (`/portal`)

Status banner — prominently shows current order status:
- `new` → "We received your request. We'll be in touch shortly."
- `in_review` → "We're reviewing your details."
- `config_sent` → "Your invitation is ready to personalise."
- `live` → "Your invitation is live. Share the link with your guests."

Countdown to wedding date (same component as in the invitation itself).

Quick links: Preview · Edit Content · Share Link (copies URL to clipboard).

Unread message indicator if admin has sent a new message.

### Live preview (`/portal/invitation`)

Full-page iframe of the invitation with `config_live`. Shows the approved, deployed version.

"This is what your guests see" caption.

If `config_live` is null (not yet approved), shows draft preview with "Preview (pending approval)" label.

### Content form (`/portal/content`)

Structured form fields derived from `templates.config_schema` for their assigned template.

Field groups:
1. **Names** — partner 1 name, partner 2 name (all three languages if applicable)
2. **Date & time** — wedding date, ceremony time, reception time
3. **Venue** — ceremony venue name + address, reception venue name + address
4. **Quranic blessing** — pre-filled, editable (Arabic text)
5. **Program** — list of program items (ceremony, dinner, dancing etc.) — add/remove
6. **RSVP settings** — deadline, meal preference options, max guests
7. **Language** — which language(s) to show

On submit: writes to `config_draft`, sets order status to `in_review` if it was `config_sent`.

Shows diff badge: "X fields changed since last approval" if draft differs from live.

Admin must approve before changes go live — shown as a notice.

### RSVP viewer (`/portal/rsvp`)

Read-only table: guest name, attending (yes/no), meal preference, message, submitted at.

Summary card: total responses, attending count, not attending count.

No export (admin-only).

### Photos (`/portal/photos`)

Two upload slots: Couple photo, Venue/ceremony photo.

Drag-and-drop or file picker. Max 10MB each, JPEG/PNG/WEBP.

Upload goes to MinIO at `3ers-assets/orders/{orderId}/{type}.{ext}`.

On upload: updates `assets` table row for this order + type. Admin sees it immediately in order detail.

Shows existing uploaded photo as thumbnail with "Replace" option.

### Messages (`/portal/messages`)

Simple threaded list. Client can send a new message.

Admin replies appear in real time (polling every 30s, or Server-Sent Events if complexity allows).

Unread messages highlighted.

### Billing (`/portal/billing`)

Invoice card: amount, currency, status (unpaid / paid).

If `status: 'unpaid'` and `stripe_payment_link` is set: "Pay now →" button.

If paid: "Paid on [date]" with receipt link.

If no invoice yet: "Your invoice will appear here once your order is confirmed."

---

## API routes (portal — require client session, scoped to their order)

| Method | Route | Action |
|---|---|---|
| `GET` | `/api/portal/order` | Get own order + config |
| `PATCH` | `/api/portal/order/content` | Update `config_draft` |
| `GET` | `/api/portal/rsvp` | Get RSVP responses for own order |
| `GET` | `/api/portal/messages` | Get message thread |
| `POST` | `/api/portal/messages` | Send message to admin |
| `GET` | `/api/portal/assets` | List uploaded assets |
| `POST` | `/api/portal/assets/upload` | Get MinIO presigned upload URL |
| `DELETE` | `/api/portal/assets/[id]` | Delete asset |
| `GET` | `/api/portal/invoice` | Get invoice status |

---

## Design

Carries the brand. Same design tokens as the invitation: night background header, cream content area, Cinzel wordmark, Cormorant body text, gold accents.

Not as cinematic as the invitation — this is a functional workspace. But it should feel like a private atelier, not a SaaS dashboard.

Status banner uses gold border-left and Cinzel for the status label. Forms use the `input` and `card` tokens from DESIGN.md.
