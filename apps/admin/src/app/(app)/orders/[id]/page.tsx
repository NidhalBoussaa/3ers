export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { db } from "@3ers/db/client";
import {
  orders,
  users,
  rsvpResponses,
  guestbookEntries,
  messages,
  invoices,
  assets,
  templates,
} from "@3ers/db/schema";
import { eq } from "drizzle-orm";
import { formatDate, formatCents } from "@/lib/utils";
import { StatusSelect } from "./status-select";
import { ConfigEditor } from "./config-editor";
import { MessageThread } from "./message-thread";
import { InvoicePanel } from "./invoice-panel";
import { CreateClientButton } from "./create-client";
import { SlugEditor } from "./slug-editor";
import { TemplateSelect } from "./template-select";

async function getOrder(id: string) {
  const [order] = await db
    .select({
      id: orders.id,
      status: orders.status,
      partner1Name: orders.partner1Name,
      partner2Name: orders.partner2Name,
      weddingDate: orders.weddingDate,
      language: orders.language,
      showcaseOptIn: orders.showcaseOptIn,
      slug: orders.slug,
      templateId: orders.templateId,
      configDraft: orders.configDraft,
      configLive: orders.configLive,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
      clientEmail: users.email,
      clientId: users.id,
      templateSchema: templates.configSchema,
      templateName: templates.name,
    })
    .from(orders)
    .leftJoin(users, eq(orders.clientId, users.id))
    .leftJoin(templates, eq(orders.templateId, templates.id))
    .where(eq(orders.id, id))
    .limit(1);
  return order ?? null;
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  const allTemplates = await db.select({ id: templates.id, name: templates.name }).from(templates).where(eq(templates.active, true));

  const [rsvps, guestbook, msgs, invs, assetList] = await Promise.all([
    db.select().from(rsvpResponses).where(eq(rsvpResponses.orderId, id)),
    db.select().from(guestbookEntries).where(eq(guestbookEntries.orderId, id)),
    db.select().from(messages).where(eq(messages.orderId, id)).orderBy(messages.createdAt),
    db.select().from(invoices).where(eq(invoices.orderId, id)),
    db.select().from(assets).where(eq(assets.orderId, id)),
  ]);

  const attending = rsvps.filter((r) => r.attending).length;
  const notAttending = rsvps.filter((r) => !r.attending).length;

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">
            {order.partner1Name && order.partner2Name
              ? `${order.partner1Name} & ${order.partner2Name}`
              : "Commande sans nom"}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {order.clientEmail ?? "Aucun client lié"} · Mariage le {order.weddingDate ? formatDate(order.weddingDate) : "—"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!order.clientId && <CreateClientButton orderId={id} />}
          <StatusSelect orderId={id} current={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Slug / invite URL */}
        <div className="col-span-2">
          <SlugEditor orderId={id} current={order.slug} />
        </div>

        {/* Template */}
        <div className="col-span-2">
          <TemplateSelect
            orderId={id}
            currentTemplateId={order.templateId ?? null}
            currentTemplateName={order.templateName ?? null}
            templates={allTemplates}
          />
        </div>

        {/* Config editor */}
        <div className="col-span-2">
          <ConfigEditor
            orderId={id}
            configDraft={order.configDraft as Record<string, unknown> | null}
            configLive={order.configLive as Record<string, unknown> | null}
            templateSchema={order.templateSchema as Array<{ key: string; type: "text" | "date" | "textarea"; label: string; required: boolean; adminOnly?: boolean }> | null}
          />
        </div>

        {/* RSVP */}
        <Section title={`RSVPs (${rsvps.length})`}>
          <div className="flex gap-6 mb-4 text-sm">
            <span className="text-green-700 font-medium">✓ {attending} présents</span>
            <span className="text-red-600 font-medium">✗ {notAttending} absents</span>
          </div>
          {rsvps.length === 0 ? (
            <p className="text-sm text-zinc-400">Aucune réponse pour l&apos;instant.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-zinc-500 text-left border-b border-zinc-100">
                  <th className="pb-2 font-medium">Invité</th>
                  <th className="pb-2 font-medium">Présent</th>
                  <th className="pb-2 font-medium">Menu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {rsvps.map((r) => (
                  <tr key={r.id}>
                    <td className="py-2 text-zinc-800">{r.guestName}</td>
                    <td className="py-2">
                      {r.attending ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-red-500">✗</span>
                      )}
                    </td>
                    <td className="py-2 text-zinc-500">{r.mealPref ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Section>

        {/* Guestbook */}
        <Section title={`Livre d'or (${guestbook.length})`}>
          {guestbook.length === 0 ? (
            <p className="text-sm text-zinc-400">Vide pour l&apos;instant.</p>
          ) : (
            <div className="space-y-3">
              {guestbook.map((g) => (
                <div key={g.id} className="text-sm">
                  <p className="font-medium text-zinc-800">{g.name}</p>
                  <p className="text-zinc-500 mt-0.5">{g.message}</p>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Assets */}
        <Section title={`Fichiers (${assetList.length})`}>
          {assetList.length === 0 ? (
            <p className="text-sm text-zinc-400">Aucun fichier.</p>
          ) : (
            <ul className="text-sm space-y-1">
              {assetList.map((a) => (
                <li key={a.id} className="flex justify-between">
                  <span className="text-zinc-700">{a.originalName ?? a.objectKey}</span>
                  <span className="text-zinc-400 text-xs">{a.type}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        {/* Invoices */}
        <Section title="Facturation">
          <InvoicePanel orderId={id} invoices={invs} />
        </Section>
      </div>

      {/* Messages */}
      <Section title="Messages">
        <MessageThread orderId={id} messages={msgs} />
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6">
      <h2 className="text-sm font-medium text-zinc-500 mb-4">{title}</h2>
      {children}
    </div>
  );
}
