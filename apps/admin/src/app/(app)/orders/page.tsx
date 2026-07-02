export const dynamic = "force-dynamic";

import Link from "next/link";
import { db } from "@3ers/db/client";
import { orders, users } from "@3ers/db/schema";
import { eq } from "drizzle-orm";
import { formatDate } from "@/lib/utils";
import { createOrder } from "./actions";

const STATUS_BADGE: Record<string, string> = {
  new: "bg-zinc-100 text-zinc-600",
  in_review: "bg-blue-50 text-blue-700",
  config_sent: "bg-amber-50 text-amber-700",
  live: "bg-green-50 text-green-700",
  archived: "bg-zinc-100 text-zinc-400",
};

const STATUS_LABEL: Record<string, string> = {
  new: "Nouveau",
  in_review: "En cours",
  config_sent: "Config envoyée",
  live: "En ligne",
  archived: "Archivé",
};

async function getOrders() {
  return db
    .select({
      id: orders.id,
      status: orders.status,
      partner1Name: orders.partner1Name,
      partner2Name: orders.partner2Name,
      weddingDate: orders.weddingDate,
      createdAt: orders.createdAt,
      clientEmail: users.email,
    })
    .from(orders)
    .leftJoin(users, eq(orders.clientId, users.id))
    .orderBy(orders.createdAt);
}

export default async function OrdersPage() {
  const rows = await getOrders();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Commandes</h1>
        <form action={createOrder}>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 transition-colors"
          >
            + Nouvelle commande
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 text-zinc-500 text-left">
              <th className="px-4 py-3 font-medium">Couple</th>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Date mariage</th>
              <th className="px-4 py-3 font-medium">Créée</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-400">
                  Aucune commande pour l&apos;instant.
                </td>
              </tr>
            )}
            {rows.map((order) => (
              <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
                <td className="px-4 py-3 font-medium text-zinc-900">
                  {order.partner1Name && order.partner2Name
                    ? `${order.partner1Name} & ${order.partner2Name}`
                    : "—"}
                </td>
                <td className="px-4 py-3 text-zinc-600">{order.clientEmail ?? "—"}</td>
                <td className="px-4 py-3 text-zinc-600">
                  {order.weddingDate ? formatDate(order.weddingDate) : "—"}
                </td>
                <td className="px-4 py-3 text-zinc-400 text-xs">
                  {formatDate(order.createdAt ?? null)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[order.status] ?? "bg-zinc-100 text-zinc-600"}`}
                  >
                    {STATUS_LABEL[order.status] ?? order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-xs text-amber-600 hover:text-amber-800 font-medium"
                  >
                    Voir →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
