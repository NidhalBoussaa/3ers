import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const INVITE_BASE = (
  process.env.NEXT_PUBLIC_INVITE_URL ?? "https://celebrio-digital.com"
).replace(/\/$/, "");

// The current invite deployment is single-tenant: it serves one couple at the
// root ("/") and 404s on /{slug}. Only append the slug once a multi-tenant
// invite that routes by slug is deployed (flip NEXT_PUBLIC_INVITE_SLUG_ROUTING).
const SLUG_ROUTING = process.env.NEXT_PUBLIC_INVITE_SLUG_ROUTING === "true";

/** Public guest URL for an order's invitation. */
export function inviteUrl(slug: string | null): string {
  return SLUG_ROUTING && slug ? `${INVITE_BASE}/${slug}` : INVITE_BASE;
}

/** Same URL with the entrance gate skipped — for in-app preview frames. */
export function invitePreviewUrl(slug: string | null): string {
  const base = inviteUrl(slug);
  return `${base}${base.includes("?") ? "&" : "?"}preview=1`;
}

export function formatDate(date: Date | string | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(
    new Date(date)
  );
}

export function formatCents(cents: number, currency = "eur") {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

/** Short, warm relative time for message timestamps ("il y a 3 h", "hier"). */
export function relativeTime(date: Date | string | null) {
  if (!date) return "";
  const then = new Date(date).getTime();
  const diff = Date.now() - then;
  const min = Math.round(diff / 60000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `il y a ${h} h`;
  const d = Math.round(h / 24);
  if (d === 1) return "hier";
  if (d < 7) return `il y a ${d} j`;
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" }).format(
    new Date(date),
  );
}
