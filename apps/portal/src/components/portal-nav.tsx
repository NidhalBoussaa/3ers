"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  PenLine,
  Images,
  Users,
  MessageCircle,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutGrid;
  exact?: boolean;
};

const ITEMS: NavItem[] = [
  { href: "/order", label: "Tableau", icon: LayoutGrid, exact: true },
  { href: "/order/content", label: "Contenu", icon: PenLine },
  { href: "/order/photos", label: "Photos", icon: Images },
  { href: "/order/rsvp", label: "Invités", icon: Users },
  { href: "/order/messages", label: "Messages", icon: MessageCircle },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname.startsWith(href);
}

/** Desktop: vertical side rail. Rendered inside the app layout's aside. */
export function SideRail({ unread }: { unread: number }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1" aria-label="Navigation">
      {ITEMS.map((item) => {
        const active = isActive(pathname, item.href, item.exact);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
              active
                ? "bg-gold/12 text-gold-deep"
                : "text-ink-soft hover:bg-gold/6 hover:text-ink"
            }`}
          >
            <span
              className={`absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-gold transition-opacity ${
                active ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden="true"
            />
            <Icon size={18} strokeWidth={1.6} className="shrink-0" />
            <span className="font-cinzel text-[11px] font-semibold uppercase tracking-[0.16em]">
              {item.label}
            </span>
            {item.label === "Messages" && unread > 0 && (
              <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1.5 font-cinzel text-[10px] font-semibold text-[#241a05]">
                {unread}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

/** Mobile: fixed bottom tab bar — thumb-reachable, safe-area aware. */
export function BottomTabs({ unread }: { unread: number }) {
  const pathname = usePathname();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/20 bg-cream/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "var(--safe-bot)" }}
      aria-label="Navigation"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-2">
        {ITEMS.map((item) => {
          const active = isActive(pathname, item.href, item.exact);
          const Icon = item.icon;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex flex-col items-center gap-1 py-2.5 transition-colors ${
                  active ? "text-gold-deep" : "text-ink-soft/70"
                }`}
              >
                <span className="relative">
                  <Icon size={21} strokeWidth={active ? 2 : 1.5} />
                  {item.label === "Messages" && unread > 0 && (
                    <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 font-cinzel text-[9px] font-semibold text-[#241a05]">
                      {unread}
                    </span>
                  )}
                </span>
                <span className="font-cinzel text-[8.5px] font-semibold uppercase tracking-[0.12em]">
                  {item.label}
                </span>
                <span
                  className={`absolute -top-px h-[2px] w-8 rounded-full bg-gold transition-opacity ${
                    active ? "opacity-100" : "opacity-0"
                  }`}
                  aria-hidden="true"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
