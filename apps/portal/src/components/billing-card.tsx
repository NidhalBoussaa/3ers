import { formatCents, formatDate } from "@/lib/utils";

type Invoice = {
  id: string;
  amountCents: number;
  currency: string | null;
  status: string | null;
  stripePaymentLink: string | null;
  paidAt: Date | null;
};

/** Rendered on the dashboard only when an invoice exists — no empty billing tab. */
export function BillingCard({ invoices }: { invoices: Invoice[] }) {
  if (invoices.length === 0) return null;

  return (
    <section className="card rise flex flex-col gap-4 p-6 sm:p-7" style={{ "--i": 4 } as React.CSSProperties}>
      <p className="lbl text-[10px] text-gold-deep">Votre règlement</p>
      <ul className="flex flex-col divide-y divide-gold/15">
        {invoices.map((inv) => {
          const paid = inv.status === "paid";
          return (
            <li key={inv.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div>
                <p className="font-cinzel text-[1.15rem] font-semibold text-ink">
                  {formatCents(inv.amountCents, inv.currency ?? "eur")}
                </p>
                <p className="font-body text-[1rem] italic text-ink-soft">
                  {paid && inv.paidAt ? `Réglé le ${formatDate(inv.paidAt)}` : "En attente de règlement"}
                </p>
              </div>
              {paid ? (
                <span className="lbl rounded-full bg-[color-mix(in_srgb,var(--ok)_14%,transparent)] px-3 py-1.5 text-[8.5px] text-[var(--ok)]">
                  Payé
                </span>
              ) : (
                inv.stripePaymentLink && (
                  <a
                    href={inv.stripePaymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn !min-h-[42px] !px-5 !text-[10px]"
                  >
                    Payer
                  </a>
                )
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
