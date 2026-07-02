"use client";

import { useState, useTransition } from "react";
import { createInvoice } from "./actions";
import { formatCents } from "@/lib/utils";

type Invoice = {
  id: string;
  amountCents: number;
  currency: string | null;
  status: string | null;
  stripePaymentLink: string | null;
  paidAt: Date | null;
};

export function InvoicePanel({
  orderId,
  invoices,
}: {
  orderId: string;
  invoices: Invoice[];
}) {
  const [amountEur, setAmountEur] = useState("");
  const [pending, startTransition] = useTransition();

  function handleCreate() {
    const cents = Math.round(parseFloat(amountEur) * 100);
    if (isNaN(cents) || cents <= 0) return;
    startTransition(() => createInvoice(orderId, cents));
    setAmountEur("");
  }

  return (
    <div className="space-y-4">
      {invoices.length === 0 ? (
        <p className="text-sm text-zinc-400">Aucune facture.</p>
      ) : (
        <div className="space-y-2">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="flex items-center justify-between text-sm"
            >
              <div>
                <span className="font-medium text-zinc-800">
                  {formatCents(inv.amountCents, inv.currency ?? "eur")}
                </span>
                <span className="ml-2 text-xs text-zinc-400">{inv.status}</span>
              </div>
              {inv.stripePaymentLink && (
                <a
                  href={inv.stripePaymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-600 hover:text-amber-800 font-medium"
                >
                  Lien Stripe →
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 pt-2 border-t border-zinc-100">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">
            €
          </span>
          <input
            type="number"
            min="1"
            step="0.01"
            placeholder="0.00"
            value={amountEur}
            onChange={(e) => setAmountEur(e.target.value)}
            className="w-full pl-7 pr-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <button
          onClick={handleCreate}
          disabled={pending || !amountEur}
          className="px-3 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-40 transition whitespace-nowrap"
          style={{ backgroundColor: "#c9a44c" }}
        >
          Créer facture
        </button>
      </div>
    </div>
  );
}
