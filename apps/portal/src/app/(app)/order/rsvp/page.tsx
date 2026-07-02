export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { getClientOrder, getRsvps } from "@/lib/order";
import { formatDate } from "@/lib/utils";
import { Check, X } from "lucide-react";

export default async function RsvpPage() {
  const session = await auth();
  if (!session) return null;

  const order = await getClientOrder(session.user.id);
  if (!order) return null;

  const rsvps = await getRsvps(order.id);
  const attending = rsvps.filter((r) => r.attending);
  const declined = rsvps.filter((r) => !r.attending);
  const seats = attending.length; // one seat per confirmed response

  const tiles = [
    { label: "Réponses", value: rsvps.length },
    { label: "Présents", value: seats, tone: "ok" as const },
    { label: "Excusés", value: declined.length },
  ];

  return (
    <div className="flex flex-col gap-7">
      <header>
        <p className="lbl mb-2 text-[10px] text-gold-deep">Vos invités</p>
        <h1 className="font-body text-[clamp(1.7rem,4.5vw,2.4rem)] leading-tight text-ink">
          Les réponses à votre invitation
        </h1>
        <p className="mt-3 max-w-prose font-body text-[1.1rem] leading-relaxed text-ink-soft">
          Chaque confirmation arrive ici en direct, dès que vos invités répondent.
        </p>
      </header>

      {/* Summary tiles */}
      <div className="grid grid-cols-3 gap-3">
        {tiles.map((t) => (
          <div key={t.label} className="card flex flex-col items-center gap-1.5 px-3 py-6">
            <span
              className={`font-cinzel text-[clamp(1.8rem,6vw,2.6rem)] font-semibold tabular-nums ${
                t.tone === "ok" ? "text-[var(--ok)]" : "text-gold-deep"
              }`}
            >
              {t.value}
            </span>
            <span className="font-cinzel text-[9px] uppercase tracking-[0.2em] text-ink-soft">
              {t.label}
            </span>
          </div>
        ))}
      </div>

      {/* Response list */}
      {rsvps.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="font-body text-[1.12rem] italic text-ink-soft">
            Aucune réponse pour l&rsquo;instant. Elles s&rsquo;afficheront ici dès que vos
            invités ouvriront le lien.
          </p>
        </div>
      ) : (
        <ul className="card divide-y divide-gold/15 overflow-hidden">
          {rsvps.map((r) => (
            <li key={r.id} className="flex items-start gap-4 px-5 py-4">
              <span
                className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full ${
                  r.attending
                    ? "bg-[color-mix(in_srgb,var(--ok)_16%,transparent)] text-[var(--ok)]"
                    : "bg-gold/10 text-ink-soft"
                }`}
                aria-hidden="true"
              >
                {r.attending ? <Check size={15} strokeWidth={2} /> : <X size={15} strokeWidth={2} />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <p className="font-body text-[1.16rem] font-medium text-ink">{r.guestName}</p>
                  <p className="font-cinzel text-[9px] uppercase tracking-[0.14em] text-ink-soft/70">
                    {formatDate(r.createdAt)}
                  </p>
                </div>
                <p className="font-body text-[1.02rem] italic text-ink-soft">
                  {r.attending ? "Sera présent(e)" : "Ne pourra pas venir"}
                  {r.mealPref ? ` · ${r.mealPref}` : ""}
                </p>
                {r.message && (
                  <p className="mt-1.5 border-l border-gold/30 pl-3 font-body text-[1.05rem] leading-relaxed text-ink-soft">
                    {r.message}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
