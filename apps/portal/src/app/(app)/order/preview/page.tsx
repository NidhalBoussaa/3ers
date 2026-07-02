export const dynamic = "force-dynamic";

import Link from "next/link";
import { auth } from "@/lib/auth";
import { getClientOrder } from "@/lib/order";
import { invitePreviewUrl } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export default async function PreviewPage() {
  const session = await auth();
  if (!session) return null;

  const order = await getClientOrder(session.user.id);
  if (!order) return null;

  const isLive = order.status === "live";
  const src = invitePreviewUrl(order.slug);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/order"
            className="mb-2 inline-flex items-center gap-1.5 font-cinzel text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-deep transition-colors hover:text-gold"
          >
            <ArrowLeft size={13} strokeWidth={1.8} /> Tableau
          </Link>
          <h1 className="font-body text-[clamp(1.6rem,4.5vw,2.2rem)] leading-tight text-ink">
            {isLive ? "Ce que voient vos invités" : "Aperçu (en attente de validation)"}
          </h1>
        </div>
        <a href={src} target="_blank" rel="noopener noreferrer" className="btn-ghost">
          Plein écran
        </a>
      </div>

      {/* Phone-framed live invitation. */}
      <div className="flex justify-center">
        <div className="w-full max-w-[380px]">
          <div className="rounded-[2.6rem] border border-gold/30 bg-[#16110a] p-[9px] shadow-[0_30px_70px_-32px_rgba(140,109,42,0.5)]">
            <div className="relative aspect-[9/19] overflow-hidden rounded-[2.1rem] bg-night">
              <iframe
                src={src}
                title="Aperçu de votre invitation"
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
              />
            </div>
          </div>
          <p className="mt-5 text-center font-body text-[1.02rem] italic text-ink-soft">
            {isLive
              ? "La version publiée, telle que vos invités la découvrent."
              : "Version provisoire — les changements non validés n'y figurent pas encore."}
          </p>
        </div>
      </div>
    </div>
  );
}
