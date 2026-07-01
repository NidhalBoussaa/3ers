import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  bigint,
  date,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ─── users ───────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").unique().notNull(),
  password: text("password"), // hashed; null for magic-link-only clients
  role: text("role").notNull(), // 'admin' | 'client'
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ─── templates ───────────────────────────────────────────────────────────────

export const templates = pgTable("templates", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  version: text("version").notNull().default("1.0.0"),
  previewUrl: text("preview_url"),
  configSchema: jsonb("config_schema").notNull(), // field definitions + defaults
  active: boolean("active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ─── orders ──────────────────────────────────────────────────────────────────

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: uuid("client_id").references(() => users.id),
  status: text("status").notNull().default("new"),
  // 'new' | 'in_review' | 'config_sent' | 'live' | 'archived'
  templateId: uuid("template_id").references(() => templates.id),
  configDraft: jsonb("config_draft"), // editable by client, pending approval
  configLive: jsonb("config_live"), // admin-approved, read by invite app
  partner1Name: text("partner1_name"),
  partner2Name: text("partner2_name"),
  weddingDate: date("wedding_date"),
  language: text("language").default("fr"), // 'fr' | 'ar' | 'en' | 'all'
  showcaseOptIn: boolean("showcase_opt_in").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ─── rsvp_responses ──────────────────────────────────────────────────────────

export const rsvpResponses = pgTable("rsvp_responses", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: uuid("order_id").references(() => orders.id),
  guestName: text("guest_name").notNull(),
  attending: boolean("attending").notNull(),
  mealPref: text("meal_pref"),
  message: text("message"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ─── guestbook_entries ───────────────────────────────────────────────────────

export const guestbookEntries = pgTable("guestbook_entries", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: uuid("order_id").references(() => orders.id),
  name: text("name").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ─── messages ────────────────────────────────────────────────────────────────

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: uuid("order_id").references(() => orders.id),
  fromRole: text("from_role").notNull(), // 'admin' | 'client'
  body: text("body").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ─── invoices ────────────────────────────────────────────────────────────────

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: uuid("order_id").references(() => orders.id),
  amountCents: integer("amount_cents").notNull(),
  currency: text("currency").default("eur"),
  status: text("status").default("unpaid"), // 'unpaid' | 'paid' | 'refunded'
  stripePaymentLink: text("stripe_payment_link"),
  stripeSessionId: text("stripe_session_id"),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ─── assets ──────────────────────────────────────────────────────────────────

export const assets = pgTable("assets", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: uuid("order_id").references(() => orders.id),
  type: text("type").notNull(), // 'couple_photo' | 'venue_photo' | 'other'
  bucket: text("bucket").notNull(),
  objectKey: text("object_key").notNull(),
  originalName: text("original_name"),
  sizeBytes: bigint("size_bytes", { mode: "number" }),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true }).defaultNow(),
});
