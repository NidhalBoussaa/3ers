-- Bootstrap schema — idempotent (safe to re-run)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── users ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email       text UNIQUE NOT NULL,
  password    text,                        -- hashed; null for magic-link clients
  role        text NOT NULL,               -- 'admin' | 'client'
  created_at  timestamptz DEFAULT now()
);

-- ─── templates ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS templates (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  version         text NOT NULL DEFAULT '1.0.0',
  preview_url     text,
  config_schema   jsonb NOT NULL,          -- field definitions + defaults
  active          boolean DEFAULT true,
  created_at      timestamptz DEFAULT now()
);

-- ─── orders ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS orders (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id         uuid REFERENCES users(id),
  status            text NOT NULL DEFAULT 'new',
  template_id       uuid REFERENCES templates(id),
  config_draft      jsonb,
  config_live       jsonb,
  partner1_name     text,
  partner2_name     text,
  wedding_date      date,
  language          text DEFAULT 'fr',
  showcase_opt_in   boolean DEFAULT false,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

-- ─── rsvp_responses ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS rsvp_responses (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    uuid REFERENCES orders(id),
  guest_name  text NOT NULL,
  attending   boolean NOT NULL,
  meal_pref   text,
  message     text,
  created_at  timestamptz DEFAULT now()
);

-- ─── guestbook_entries ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS guestbook_entries (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    uuid REFERENCES orders(id),
  name        text NOT NULL,
  message     text NOT NULL,
  created_at  timestamptz DEFAULT now()
);

-- ─── messages ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    uuid REFERENCES orders(id),
  from_role   text NOT NULL,               -- 'admin' | 'client'
  body        text NOT NULL,
  read        boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

-- ─── invoices ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS invoices (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id              uuid REFERENCES orders(id),
  amount_cents          integer NOT NULL,
  currency              text DEFAULT 'eur',
  status                text DEFAULT 'unpaid', -- 'unpaid' | 'paid' | 'refunded'
  stripe_payment_link   text,
  stripe_session_id     text,
  paid_at               timestamptz,
  created_at            timestamptz DEFAULT now()
);

-- ─── assets ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS assets (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        uuid REFERENCES orders(id),
  type            text NOT NULL,           -- 'couple_photo' | 'venue_photo' | 'other'
  bucket          text NOT NULL,
  object_key      text NOT NULL,
  original_name   text,
  size_bytes      bigint,
  uploaded_at     timestamptz DEFAULT now()
);

-- ─── updated_at trigger ──────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_set_updated_at ON orders;
CREATE TRIGGER orders_set_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── indexes ─────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS orders_client_id_idx       ON orders(client_id);
CREATE INDEX IF NOT EXISTS orders_status_idx          ON orders(status);
CREATE INDEX IF NOT EXISTS rsvp_order_id_idx          ON rsvp_responses(order_id);
CREATE INDEX IF NOT EXISTS guestbook_order_id_idx     ON guestbook_entries(order_id);
CREATE INDEX IF NOT EXISTS messages_order_id_idx      ON messages(order_id);
CREATE INDEX IF NOT EXISTS assets_order_id_idx        ON assets(order_id);
CREATE INDEX IF NOT EXISTS invoices_order_id_idx      ON invoices(order_id);
