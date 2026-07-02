"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { LayoutDashboard, ShoppingBag, LogOut } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/orders", label: "Commandes", icon: ShoppingBag },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <aside className="w-56 shrink-0 flex flex-col border-r border-zinc-200 bg-white h-screen sticky top-0">
      <div className="px-6 py-5 border-b border-zinc-100">
        <span className="font-semibold tracking-tight text-zinc-900">3ers</span>
        <span className="ml-2 text-xs text-zinc-400 font-medium uppercase tracking-wider">
          admin
        </span>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors",
              pathname.startsWith(href)
                ? "bg-amber-50 text-amber-700 font-medium"
                : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-zinc-100">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
