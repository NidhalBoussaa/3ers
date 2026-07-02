"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@3ers/db/client";
import { orders, messages } from "@3ers/db/schema";
import { eq, and } from "drizzle-orm";

async function ownOrderId(userId: string) {
  const [order] = await db
    .select({ id: orders.id })
    .from(orders)
    .where(eq(orders.clientId, userId))
    .limit(1);
  return order?.id ?? null;
}

export type ThreadMessage = {
  id: string;
  fromRole: string;
  body: string;
  createdAt: string | null;
};

/** Fetch the thread and mark admin messages as read (client is viewing them). */
export async function loadThread(): Promise<ThreadMessage[]> {
  const session = await auth();
  if (!session || session.user.role !== "client") throw new Error("Unauthorized");

  const orderId = await ownOrderId(session.user.id);
  if (!orderId) return [];

  const rows = await db
    .select()
    .from(messages)
    .where(eq(messages.orderId, orderId))
    .orderBy(messages.createdAt);

  // Clear unread badge for admin-authored messages.
  await db
    .update(messages)
    .set({ read: true })
    .where(
      and(
        eq(messages.orderId, orderId),
        eq(messages.fromRole, "admin"),
        eq(messages.read, false),
      ),
    );

  return rows.map((m) => ({
    id: m.id,
    fromRole: m.fromRole,
    body: m.body,
    createdAt: m.createdAt ? new Date(m.createdAt).toISOString() : null,
  }));
}

export async function sendMessage(body: string): Promise<ThreadMessage | null> {
  const session = await auth();
  if (!session || session.user.role !== "client") throw new Error("Unauthorized");

  const trimmed = body.trim().slice(0, 2000);
  if (!trimmed) return null;

  const orderId = await ownOrderId(session.user.id);
  if (!orderId) throw new Error("No order");

  const [row] = await db
    .insert(messages)
    .values({ orderId, fromRole: "client", body: trimmed, read: false })
    .returning();

  revalidatePath("/order");

  return {
    id: row.id,
    fromRole: row.fromRole,
    body: row.body,
    createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : null,
  };
}
