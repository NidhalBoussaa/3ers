"use client";

import { useState, useTransition } from "react";
import { updateSlug } from "./actions";
import { Link } from "lucide-react";

// Bare host of the invite domain, e.g. "celebrio-digital.com" — shown as the
// URL prefix so the slug reads as its real, shareable address.
const INVITE_HOST = (process.env.NEXT_PUBLIC_INVITE_URL ?? "https://celebrio-digital.com")
  .replace(/^https?:\/\//, "")
  .replace(/\/$/, "");

export function SlugEditor({
  orderId,
  current,
}: {
  orderId: string;
  current: string | null;
}) {
  const [value, setValue] = useState(current ?? "");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSave() {
    setError("");
    setSaved(false);
    startTransition(async () => {
      const res = await updateSlug(orderId, value);
      if (res.ok) {
        setValue(res.message);
        setSaved(true);
      } else {
        setError(res.message);
      }
    });
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-3">
      <div className="flex items-center gap-2">
        <Link size={14} className="text-zinc-400" />
        <h2 className="text-sm font-medium text-zinc-500">URL de l&apos;invitation</h2>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-400 shrink-0">{INVITE_HOST}/</span>
        <input
          value={value}
          onChange={(e) => { setValue(e.target.value); setSaved(false); }}
          placeholder="fatima-ahmed-2025"
          className="flex-1 px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
        />
        <button
          onClick={handleSave}
          disabled={pending || !value.trim()}
          className="px-4 py-2 text-xs font-medium text-white rounded-lg disabled:opacity-40 transition whitespace-nowrap"
          style={{ backgroundColor: "#c9a44c" }}
        >
          {pending ? "…" : "Enregistrer"}
        </button>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
      {saved && (
        <p className="text-xs text-green-600">
          Lien actif : <span className="font-mono">{INVITE_HOST}/{value}</span>
        </p>
      )}
    </div>
  );
}
