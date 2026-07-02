"use server";

import { revalidatePath } from "next/cache";
import { db } from "@3ers/db/client";
import { orders, messages, invoices, users } from "@3ers/db/schema";
import { eq, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { hash } from "bcryptjs";
import { z } from "zod";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}

const VALID_STATUSES = [
  "new",
  "in_review",
  "config_sent",
  "live",
  "archived",
] as const;

export async function updateOrderStatus(
  orderId: string,
  status: string,
): Promise<{ ok: boolean; message: string }> {
  await requireAdmin();
  if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    return { ok: false, message: "Statut invalide." };
  }
  try {
    const updated = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, orderId))
      .returning({ id: orders.id });
    if (updated.length === 0) {
      return { ok: false, message: "Commande introuvable." };
    }
  } catch (err) {
    console.error("updateOrderStatus failed:", err);
    return { ok: false, message: "Échec de la mise à jour. Réessayez." };
  }
  revalidatePath(`/orders/${orderId}`);
  return { ok: true, message: "Statut mis à jour." };
}

export async function assignTemplate(orderId: string, templateId: string) {
  await requireAdmin();
  await db.update(orders).set({ templateId }).where(eq(orders.id, orderId));
  revalidatePath(`/orders/${orderId}`);
}

export async function saveConfigDraft(
  orderId: string,
  values: Record<string, string>
) {
  await requireAdmin();
  await db
    .update(orders)
    .set({
      configDraft: sql`COALESCE(config_draft, '{}'::jsonb) || ${JSON.stringify(values)}::jsonb`,
    })
    .where(eq(orders.id, orderId));
  revalidatePath(`/orders/${orderId}`);
}

export async function publishConfig(
  orderId: string,
  config: Record<string, unknown>
) {
  await requireAdmin();
  await db
    .update(orders)
    .set({ configLive: config, status: "config_sent" })
    .where(eq(orders.id, orderId));
  revalidatePath(`/orders/${orderId}`);
}

export async function sendMessage(orderId: string, body: string) {
  await requireAdmin();
  const trimmed = body.trim();
  if (!trimmed) throw new Error("Message cannot be empty");
  await db.insert(messages).values({
    orderId,
    fromRole: "admin",
    body: trimmed,
    read: false,
  });
  revalidatePath(`/orders/${orderId}`);
}

export async function updateSlug(
  orderId: string,
  slug: string
): Promise<{ ok: boolean; message: string }> {
  await requireAdmin();
  const clean = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-{2,}/g, "-").replace(/^-|-$/g, "");
  if (!clean) return { ok: false, message: "Slug invalide." };

  try {
    const [existing] = await db
      .select({ id: orders.id })
      .from(orders)
      .where(eq(orders.slug, clean))
      .limit(1);
    if (existing && existing.id !== orderId) return { ok: false, message: "Ce slug est déjà utilisé." };

    await db.update(orders).set({ slug: clean }).where(eq(orders.id, orderId));
  } catch (err: unknown) {
    // Catch pg unique-violation (23505) from concurrent slug assignment
    if (typeof err === "object" && err !== null && "code" in err && (err as { code: string }).code === "23505") {
      return { ok: false, message: "Ce slug est déjà utilisé." };
    }
    throw err;
  }
  revalidatePath(`/orders/${orderId}`);
  return { ok: true, message: clean };
}

export async function createClientAccount(
  orderId: string,
  email: string,
  password: string
): Promise<{ ok: boolean; message: string }> {
  await requireAdmin();

  if (!z.string().email().safeParse(email).success) {
    return { ok: false, message: "Adresse email invalide." };
  }
  if (password.length < 8) return { ok: false, message: "Mot de passe trop court (8 caractères min)." };

  const hashed = await hash(password, 12);

  try {
    // Wrap insert + order-link in a transaction so we never get an orphaned user.
    await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({ email, password: hashed, role: "client" })
        .returning({ id: users.id });
      await tx.update(orders).set({ clientId: user.id }).where(eq(orders.id, orderId));
    });
  } catch (err: unknown) {
    if (typeof err === "object" && err !== null && "code" in err && (err as { code: string }).code === "23505") {
      return { ok: false, message: "Un compte avec cet email existe déjà." };
    }
    throw err;
  }

  revalidatePath(`/orders/${orderId}`);
  return { ok: true, message: "Compte créé." };
}

export async function createInvoice(orderId: string, amountCents: number) {
  await requireAdmin();
  if (
    !Number.isInteger(amountCents) ||
    amountCents <= 0 ||
    amountCents > 10_000_000
  ) {
    throw new Error("Invalid amount");
  }
  await db.insert(invoices).values({
    orderId,
    amountCents,
    currency: "eur",
    status: "unpaid",
  });
  revalidatePath(`/orders/${orderId}`);
}
