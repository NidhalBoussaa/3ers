"use server";

import { redirect } from "next/navigation";
import { db } from "@3ers/db/client";
import { orders } from "@3ers/db/schema";
import { auth } from "@/lib/auth";

export async function createOrder() {
  const session = await auth();
  if (!session || session.user.role !== "admin") throw new Error("Unauthorized");

  const [order] = await db.insert(orders).values({}).returning({ id: orders.id });
  redirect(`/orders/${order.id}`);
}
