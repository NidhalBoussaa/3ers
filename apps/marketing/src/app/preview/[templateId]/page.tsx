import Link from "next/link";
import type { Metadata } from "next";

// The root domain is this marketing site itself, so the viewing room shows
// the showcase invitation (a real, live order) rather than the bare root.
const SHOWCASE_URL =
  process.env.NEXT_PUBLIC_SHOWCASE_INVITE_URL ??
  `${(process.env.NEXT_PUBLIC_INVITE_URL ?? "https://celebrio-digital.com").replace(/\/$/, "")}/fahmi-esmiralda`;

export const metadata: Metadata = {
  title: "Aperçu en direct — 3ers",
  robots: { index: false },
};

/**
 * The viewing room: the real invitation, full-bleed, with its entrance film
 * intact. One quiet bar of chrome; the artifact does the talking.
 */
export default async function PreviewPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  // Single template today, so every templateId shows the showcase invitation.
  const src = SHOWCASE_URL;

  return (
    <div className="flex h-dvh flex-col bg-night">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-gold/20 px-5">
        <Link
          href="/"
          className="font-cinzel text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-soft transition-colors hover:text-gold-bright"
        >
          ← Retour
        </Link>
        <span className="lbl hidden text-[9px] text-champagne/60 sm:block">
          Aper&ccedil;u en direct
        </span>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="font-cinzel text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-soft transition-colors hover:text-gold-bright"
        >
          Plein &eacute;cran ↗
        </a>
      </div>
      <iframe
        src={src}
        title={`Invitation ${templateId} — aperçu en direct`}
        className="h-full w-full flex-1 border-0"
      />
    </div>
  );
}
