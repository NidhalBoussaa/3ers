export const dynamic = "force-dynamic";

import { db } from "@3ers/db/client";
import { orders, users, invoices } from "@3ers/db/schema";
import { sql, eq } from "drizzle-orm";
import { formatCents } from "@/lib/utils";

async function getStats() {
  const [orderCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(orders);

  const [clientCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users)
    .where(eq(users.role, "client"));

  const [revenue] = await db
    .select({ total: sql<number>`coalesce(sum(amount_cents), 0)::int` })
    .from(invoices)
    .where(eq(invoices.status, "paid"));

  const statusRows = await db
    .select({ status: orders.status, count: sql<number>`count(*)::int` })
    .from(orders)
    .groupBy(orders.status);

  return { orderCount: orderCount.count, clientCount: clientCount.count, revenue: revenue.total, statusRows };
}

const STATUS_LABEL: Record<string, string> = {
  new: "Nouveau",
  in_review: "En cours",
  config_sent: "Config envoyée",
  live: "En ligne",
  archived: "Archivé",
};

export default async function DashboardPage() {
  const { orderCount, clientCount, revenue, statusRows } = await getStats();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Commandes totales" value={String(orderCount)} />
        <StatCard label="Clients" value={String(clientCount)} />
        <StatCard label="Revenus (payés)" value={formatCents(revenue)} />
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 p-6">
        <h2 className="text-sm font-medium text-zinc-500 mb-4">Par statut</h2>
        <div className="space-y-2">
          {statusRows.map((row) => (
            <div key={row.status} className="flex justify-between text-sm">
              <span className="text-zinc-700">{STATUS_LABEL[row.status] ?? row.status}</span>
              <span className="font-medium text-zinc-900">{row.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-zinc-900">{value}</p>
    </div>
  );
}
