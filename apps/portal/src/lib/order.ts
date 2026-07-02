import "server-only";
import { db } from "@3ers/db/client";
import {
  orders,
  templates,
  invoices,
  rsvpResponses,
  messages,
  assets,
} from "@3ers/db/schema";
import { getReadUrl } from "@3ers/db/storage";
import { eq, and, desc, sql } from "drizzle-orm";

export type SchemaField = {
  key: string;
  type: "text" | "date" | "select" | "textarea";
  label: string;
  required: boolean;
  options?: string[];
  group?: string;
  lang?: "ar";
  adminOnly?: boolean;
};

/** The client's single order + its template schema. Null when none assigned yet. */
export async function getClientOrder(userId: string) {
  const [order] = await db
    .select({
      id: orders.id,
      slug: orders.slug,
      status: orders.status,
      partner1Name: orders.partner1Name,
      partner2Name: orders.partner2Name,
      weddingDate: orders.weddingDate,
      language: orders.language,
      configDraft: orders.configDraft,
      configLive: orders.configLive,
      templateSchema: templates.configSchema,
    })
    .from(orders)
    .leftJoin(templates, eq(orders.templateId, templates.id))
    .where(eq(orders.clientId, userId))
    .limit(1);
  return order ?? null;
}

/** Small counters for the dashboard tiles + nav badges. One round-trip each. */
export async function getOrderStats(orderId: string) {
  const [[rsvp], [unread]] = await Promise.all([
    db
      .select({
        total: sql<number>`count(*)::int`,
        attending: sql<number>`count(*) filter (where ${rsvpResponses.attending})::int`,
      })
      .from(rsvpResponses)
      .where(eq(rsvpResponses.orderId, orderId)),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(messages)
      .where(
        and(
          eq(messages.orderId, orderId),
          eq(messages.fromRole, "admin"),
          eq(messages.read, false),
        ),
      ),
  ]);
  return {
    rsvpTotal: rsvp?.total ?? 0,
    rsvpAttending: rsvp?.attending ?? 0,
    unreadMessages: unread?.count ?? 0,
  };
}

export async function getRsvps(orderId: string) {
  return db
    .select()
    .from(rsvpResponses)
    .where(eq(rsvpResponses.orderId, orderId))
    .orderBy(desc(rsvpResponses.createdAt));
}

export async function getThread(orderId: string) {
  return db
    .select()
    .from(messages)
    .where(eq(messages.orderId, orderId))
    .orderBy(messages.createdAt);
}

export async function getInvoices(orderId: string) {
  return db.select().from(invoices).where(eq(invoices.orderId, orderId));
}

/** Uploaded photos with fresh presigned read URLs for thumbnails. */
export async function getPhotos(orderId: string) {
  const rows = await db
    .select()
    .from(assets)
    .where(eq(assets.orderId, orderId))
    .orderBy(desc(assets.uploadedAt));

  return Promise.all(
    rows.map(async (a) => ({
      id: a.id,
      type: a.type,
      originalName: a.originalName,
      sizeBytes: a.sizeBytes,
      url: await getReadUrl(a.objectKey).catch(() => null),
    })),
  );
}
