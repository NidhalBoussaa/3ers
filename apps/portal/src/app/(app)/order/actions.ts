"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@3ers/db/client";
import { orders, assets, templates } from "@3ers/db/schema";
import { eq, and } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { getUploadUrl, getObjectSize, ALLOWED_MIME_TYPES } from "@3ers/db/storage";

async function requireOwnOrder(userId: string, orderId: string) {
  const [order] = await db
    .select({ id: orders.id, status: orders.status, templateId: orders.templateId })
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.clientId, userId)))
    .limit(1);
  if (!order) throw new Error("Unauthorized");
  return order;
}

export async function saveContentDraft(
  orderId: string,
  values: Record<string, string>
) {
  const session = await auth();
  if (!session || session.user.role !== "client") throw new Error("Unauthorized");

  const order = await requireOwnOrder(session.user.id, orderId);

  // Build an allowlist from the template's config_schema so clients
  // can only write schema-defined keys and cannot wipe admin-set fields.
  let allowedKeys: Set<string> = new Set();
  if (order.templateId) {
    const [tmpl] = await db
      .select({ configSchema: templates.configSchema })
      .from(templates)
      .where(eq(templates.id, order.templateId))
      .limit(1);
    if (tmpl) {
      // Exclude adminOnly fields (media paths, computed dates) so a client
      // can't inject them by POSTing keys the UI hides from them.
      const schema = tmpl.configSchema as Array<{ key: string; adminOnly?: boolean }>;
      allowedKeys = new Set(schema.filter((f) => !f.adminOnly).map((f) => f.key));
    }
  }

  // Reject entirely when no template is assigned — there are no safe keys to write.
  if (allowedKeys.size === 0) throw new Error("No template assigned to this order");

  const sanitized: Record<string, string> = Object.fromEntries(
    Object.entries(values)
      .filter(([k]) => allowedKeys.has(k))
      .map(([k, v]) => [k, String(v).slice(0, 2000)])
  );

  // Merge into existing configDraft rather than replacing wholesale,
  // so admin-injected keys are preserved.
  await db
    .update(orders)
    .set({
      configDraft: sql`COALESCE(config_draft, '{}'::jsonb) || ${JSON.stringify(sanitized)}::jsonb`,
    })
    .where(eq(orders.id, orderId));

  revalidatePath("/order");
}

export async function getPresignedUploadUrl(
  orderId: string,
  fileName: string,
  contentType: string
) {
  const session = await auth();
  if (!session || session.user.role !== "client") throw new Error("Unauthorized");

  // Fix 1: verify orderId belongs to this specific client (not just any client)
  await requireOwnOrder(session.user.id, orderId);

  // Fix 4: MIME type validated server-side inside getUploadUrl
  if (!ALLOWED_MIME_TYPES.has(contentType)) {
    throw new Error("File type not allowed");
  }

  const safe = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const objectKey = `orders/${orderId}/${Date.now()}_${safe}`;
  const url = await getUploadUrl(objectKey, contentType);
  return { url, objectKey };
}

export async function recordAsset(
  orderId: string,
  objectKey: string,
  originalName: string,
  contentType: string,
) {
  const session = await auth();
  if (!session || session.user.role !== "client") throw new Error("Unauthorized");

  await requireOwnOrder(session.user.id, orderId);

  // Validate objectKey is under this order's prefix to prevent spoofed keys
  if (!objectKey.startsWith(`orders/${orderId}/`)) {
    throw new Error("Invalid object key");
  }

  // Fix 5: get authoritative size from MinIO, not from browser
  const sizeBytes = await getObjectSize(objectKey);

  const type = contentType.startsWith("image/") ? "couple_photo" : "other";

  // Unique constraint on (orderId, objectKey) prevents duplicate records
  await db.insert(assets).values({
    orderId,
    type,
    bucket: "3ers-assets",
    objectKey,
    originalName,
    sizeBytes,
  });

  revalidatePath("/order");
}
