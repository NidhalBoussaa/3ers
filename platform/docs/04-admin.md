# Admin Panel

`apps/admin` · Next.js App Router · Port 3002

---

## Purpose

Internal operations tool for Nidhal. Manage all orders end-to-end: receive requests, configure invitations, approve client edits, view RSVP data, manage invoices.

Single user. No multi-user, no team management needed now.

---

## Auth

- NextAuth.js, `credentials` provider (email + password)
- Single admin account seeded in `users` table with `role: 'admin'`
- All `/admin/**` routes protected by middleware — redirect to `/admin/login` if unauthenticated
- Session: JWT, 8h expiry

---

## Routes

| Route | Page |
|---|---|
| `/admin/login` | Login form |
| `/admin` | Dashboard — stats overview |
| `/admin/orders` | Orders list |
| `/admin/orders/[id]` | Order detail + config editor |
| `/admin/templates` | Template list |
| `/admin/templates/new` | Create template |
| `/admin/templates/[id]` | Edit template |
| `/admin/clients` | Client list |
| `/admin/clients/[id]` | Client profile |
| `/admin/settings` | Global settings |

---

## Modules

### Dashboard (`/admin`)

Stats cards (pulled from DB):
- Total orders by status (new / in_review / config_sent / live / archived)
- Orders created this month
- Total RSVPs received this month
- Invoices unpaid count + total amount

Recent activity feed: last 10 order status changes.

### Orders list (`/admin/orders`)

Table columns: `#`, Couple names, Wedding date, Status badge, Created at, Actions.

Filters: status dropdown, date range picker, search by name.

Status badge colours:
- `new` → amber
- `in_review` → blue
- `config_sent` → indigo
- `live` → green
- `archived` → grey

Bulk actions: mark archived.

### Order detail (`/admin/orders/[id]`)

**Left panel — order info:**
- Couple names, wedding date, language, template assigned
- Client email, link to client profile
- Status selector (dropdown) + "Save status" button
- Invoice section: amount, status, Stripe link generator

**Center panel — config editor:**
- Two tabs: `Draft` (client's submitted version) and `Live` (approved + deployed)
- JSON editor (Monaco or CodeMirror) with schema validation
- "Approve draft → deploy to live" button (writes `config_live`, pushes to invite app)
- Form-based editor as alternative view (fields derived from `templates.config_schema`)

**Right panel — preview:**
- Iframe rendering `/invite?orderId=[id]&config=live` (or draft)
- Toggle between draft / live preview

**Bottom tabs:**
- RSVP responses table (paginated, export CSV)
- Guestbook entries table
- Message thread with client
- Assets (uploaded photos) with MinIO direct links + delete

### Template manager (`/admin/templates`)

List of templates. Each has: name, version, preview URL, active toggle.

Create/edit form:
- Name, version
- Config schema editor (JSON) — defines all fields the couple can fill
- Preview URL (link to a live demo invitation)
- Active toggle

### Client list (`/admin/clients`)

Table of all users with `role: 'client'`. Columns: email, order count, last active, joined date.

Click through to client profile showing their order history.

### Settings (`/admin/settings`)

- Email notification toggles (new order received, RSVP milestone)
- Default template selection
- Pricing display (static, for reference — not editable here yet)

---

## API routes (admin — all require admin session)

| Method | Route | Action |
|---|---|---|
| `GET` | `/api/admin/orders` | List orders (filter/paginate) |
| `GET` | `/api/admin/orders/[id]` | Get order detail |
| `PATCH` | `/api/admin/orders/[id]` | Update status, config_live, template |
| `GET` | `/api/admin/orders/[id]/rsvp` | RSVP list for order |
| `GET` | `/api/admin/orders/[id]/rsvp.csv` | Export RSVP as CSV |
| `GET` | `/api/admin/orders/[id]/messages` | Message thread |
| `POST` | `/api/admin/orders/[id]/messages` | Send message to client |
| `GET` | `/api/admin/templates` | List templates |
| `POST` | `/api/admin/templates` | Create template |
| `PATCH` | `/api/admin/templates/[id]` | Update template |
| `DELETE` | `/api/admin/templates/[id]` | Soft-delete template |
| `GET` | `/api/admin/clients` | List clients |
| `POST` | `/api/admin/invoices` | Create invoice + Stripe payment link |

---

## Design

Admin panel is functional-first — not required to carry the couture brand. Clean dark sidebar, neutral typography (Inter or system font), shadcn components.

Colour: dark sidebar `#111`, white content area, status badge colours from Tailwind.

No gold, no Cinzel — this is an ops tool, not a showpiece.
