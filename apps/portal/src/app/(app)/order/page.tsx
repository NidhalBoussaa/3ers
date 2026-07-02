export const dynamic = "force-dynamic";

import Link from "next/link";
import { auth } from "@/lib/auth";
import { getClientOrder, getOrderStats, getInvoices } from "@/lib/order";
import { formatDate, inviteUrl } from "@/lib/utils";
import { Countdown } from "@/components/countdown";
import { StatusThread } from "@/components/status-thread";
import { ShareLink } from "@/components/share-link";
import { BillingCard } from "@/components/billing-card";
import { Ornament } from "@/components/ornament";
import { PenLine, Images, Users, MessageCircle, ArrowUpRight } from "lucide-react";

const STATUS_MESSAGE: Record<string, { title: string; body: string }> = {
  new: {
    title: "Votre demande est bien arrivée",
    body: "Nous préparons votre atelier. Vous serez prévenu dès qu'il est prêt à personnaliser.",
  },
  in_review: {
    title: "Nous cousons votre invitation",
    body: "Notre équipe travaille sur votre film et vos détails. Complétez vos informations quand vous voulez.",
  },
  config_sent: {
    title: "Votre invitation vous attend",
    body: "Renseignez vos détails, ajoutez vos photos, puis soumettez-les pour validation.",
  },
  live: {
    title: "Votre invitation est en ligne",
    body: "Tout est prêt. Il ne reste qu'à partager le lien avec vos invités.",
  },
  archived: {
    title: "Invitation archivée",
    body: "Cette invitation a été archivée. Écrivez-nous pour la réactiver.",
  },
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session) return null;

  const order = await getClientOrder(session.user.id);

  if (!order) {
    return (
      <div className="card mx-auto max-w-md p-10 text-center">
        <Ornament className="mb-6" />
        <h1 className="font-body text-2xl italic text-ink">Votre atelier se prépare</h1>
        <p className="mt-4 font-body text-[1.08rem] leading-relaxed text-ink-soft">
          Aucune invitation n&rsquo;est encore rattachée à votre compte. Écrivez-nous si
          vous pensez qu&rsquo;il s&rsquo;agit d&rsquo;une erreur.
        </p>
      </div>
    );
  }

  const [stats, invs] = await Promise.all([getOrderStats(order.id), getInvoices(order.id)]);
  const msg = STATUS_MESSAGE[order.status] ?? STATUS_MESSAGE.new;
  const isLive = order.status === "live";
  const guestUrl = inviteUrl(order.slug);
  const isoDate = order.weddingDate ? new Date(order.weddingDate).toISOString() : null;

  const quickLinks: Array<{
    href: string;
    label: string;
    icon: typeof PenLine;
    badge?: number;
  }> = [
    { href: "/order/content", label: "Compléter le contenu", icon: PenLine },
    { href: "/order/photos", label: "Ajouter des photos", icon: Images },
    { href: "/order/rsvp", label: "Voir les réponses", icon: Users, badge: stats.rsvpTotal },
    {
      href: "/order/messages",
      label: "Écrire à l'atelier",
      icon: MessageCircle,
      badge: stats.unreadMessages,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Status card — where you are, and the thread of what's next. */}
      <section className="card rise p-6 sm:p-8" style={{ "--i": 0 } as React.CSSProperties}>
        <p className="lbl mb-3 text-[10px] text-gold-deep">Votre invitation</p>
        <h1 className="font-body text-[clamp(1.5rem,4vw,2rem)] leading-tight text-ink">
          {msg.title}
        </h1>
        <p className="mt-3 max-w-prose font-body text-[1.1rem] leading-relaxed text-ink-soft">
          {msg.body}
        </p>

        <div className="mt-8 border-t border-gold/20 pt-7">
          <StatusThread status={order.status} />
        </div>
      </section>

      {/* Countdown + share, side by side on desktop. */}
      <div className="grid gap-6 sm:grid-cols-2">
        {isoDate && (
          <section
            className="card rise flex flex-col gap-5 p-6 sm:p-7"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            <div className="flex items-baseline justify-between gap-3">
              <p className="lbl text-[10px] text-gold-deep">Le grand jour</p>
              <p className="font-body text-[1rem] italic text-ink-soft">
                {formatDate(order.weddingDate)}
              </p>
            </div>
            <Countdown isoDate={isoDate} />
          </section>
        )}

        <section
          className="card rise flex flex-col gap-4 p-6 sm:p-7"
          style={{ "--i": 2 } as React.CSSProperties}
        >
          <div className="flex items-center justify-between gap-3">
            <p className="lbl text-[10px] text-gold-deep">Le lien de vos invités</p>
            {isLive ? (
              <span className="lbl rounded-full bg-gold/15 px-2.5 py-1 text-[8.5px] text-gold-deep">
                En ligne
              </span>
            ) : (
              <span className="lbl rounded-full border border-gold/30 px-2.5 py-1 text-[8.5px] text-ink-soft">
                Bientôt
              </span>
            )}
          </div>
          {isLive ? (
            <ShareLink url={guestUrl} />
          ) : (
            <p className="font-body text-[1.06rem] leading-relaxed text-ink-soft">
              Votre lien apparaîtra ici dès que votre invitation sera validée et mise en
              ligne.
            </p>
          )}
          <Link
            href="/order/preview"
            className="mt-1 inline-flex items-center gap-1.5 font-cinzel text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-deep transition-colors hover:text-gold"
          >
            Aperçu de l&rsquo;invitation
            <ArrowUpRight size={13} strokeWidth={1.8} />
          </Link>
        </section>
      </div>

      {/* Quick actions — the four things a couple actually does here. */}
      <section
        className="rise"
        style={{ "--i": 3 } as React.CSSProperties}
        aria-label="Actions rapides"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {quickLinks.map(({ href, label, icon: Icon, badge }) => (
            <Link
              key={href}
              href={href}
              className="card group flex items-center gap-4 p-5 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/35 bg-gold/8 text-gold-deep">
                <Icon size={18} strokeWidth={1.6} />
              </span>
              <span className="flex-1 font-body text-[1.14rem] text-ink">{label}</span>
              {typeof badge === "number" && badge > 0 && (
                <span className="grid h-6 min-w-6 place-items-center rounded-full bg-gold px-2 font-cinzel text-[10px] font-semibold text-[#241a05]">
                  {badge}
                </span>
              )}
              <ArrowUpRight
                size={16}
                strokeWidth={1.6}
                className="text-gold-deep/50 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          ))}
        </div>
      </section>

      <BillingCard invoices={invs} />
    </div>
  );
}
