"use client";
import { useState } from "react";
import { Link2, Check } from "lucide-react";

/** Copy the guest link to clipboard — the couple's whole job is to share this. */
export function ShareLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard blocked — the visible URL is still selectable */
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <code className="min-w-0 flex-1 truncate rounded-xl border border-gold/30 bg-white/60 px-4 py-3 font-cinzel text-[12px] tracking-[0.08em] text-gold-deep">
        {url.replace(/^https?:\/\//, "")}
      </code>
      <button type="button" onClick={copy} className="btn-ghost shrink-0">
        {copied ? <Check size={14} strokeWidth={2} /> : <Link2 size={14} strokeWidth={1.8} />}
        {copied ? "Copié" : "Copier le lien"}
      </button>
    </div>
  );
}
