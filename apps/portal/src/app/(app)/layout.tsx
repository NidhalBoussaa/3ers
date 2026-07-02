export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getClientOrder, getOrderStats } from "@/lib/order";
import { signOutAction } from "./actions";
import { SideRail, BottomTabs } from "@/components/portal-nav";
import { LogOut } from "lucide-react";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  const order = await getClientOrder(session.user.id);
  const stats = order ? await getOrderStats(order.id) : { unreadMessages: 0 };
  const unread = stats.unreadMessages;

  const couple =
    order?.partner1Name && order?.partner2Name
      ? `${order.partner1Name} & ${order.partner2Name}`
      : "Votre mariage";

  return (
    <div className="min-h-dvh bg-cream">
      {/* Night header — the atelier's masthead. */}
      <header
        className="sticky top-0 z-30 border-b border-gold/20 bg-night"
        style={{ paddingTop: "var(--safe-top)" }}
      >
        <div className="mx-auto flex h-[62px] max-w-6xl items-center justify-between gap-4 px-5">
          <div className="flex items-baseline gap-3 overflow-hidden">
            <span className="font-deco text-lg font-bold tracking-[0.12em] text-gold-soft">
              3ers
            </span>
            <span className="hidden h-3.5 w-px bg-gold/40 sm:block" aria-hidden="true" />
            <span className="truncate font-body text-[1.05rem] italic text-champagne/85">
              {couple}
            </span>
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              className="flex items-center gap-1.5 font-cinzel text-[10px] uppercase tracking-[0.18em] text-champagne/70 transition-colors hover:text-gold-bright"
            >
              <LogOut size={13} strokeWidth={1.6} />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </form>
        </div>
      </header>

      {/* Two-column on desktop: side rail + content. Single column on mobile. */}
      <div className="mx-auto flex max-w-6xl gap-10 px-5 lg:px-8">
        <aside className="hidden w-56 shrink-0 pt-10 lg:block">
          <div className="sticky top-[86px]">
            <SideRail unread={unread} />
          </div>
        </aside>

        <main className="min-w-0 flex-1 pb-28 pt-8 lg:pb-16 lg:pt-10">{children}</main>
      </div>

      <BottomTabs unread={unread} />
    </div>
  );
}
