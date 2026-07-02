"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "./actions";

const STATUSES = [
  { value: "new", label: "Nouveau" },
  { value: "in_review", label: "En cours" },
  { value: "config_sent", label: "Config envoyée" },
  { value: "live", label: "En ligne" },
  { value: "archived", label: "Archivé" },
];

export function StatusSelect({
  orderId,
  current,
}: {
  orderId: string;
  current: string;
}) {
  // Optimistic value shown in the select; reverts to `committed` on failure.
  const [committed, setCommitted] = useState(current);
  const [value, setValue] = useState(current);
  const [feedback, setFeedback] = useState<
    { kind: "error" | "ok"; text: string } | null
  >(null);
  const [pending, startTransition] = useTransition();

  function handleChange(next: string) {
    if (next === committed) return;
    setValue(next); // optimistic
    setFeedback(null);
    startTransition(async () => {
      try {
        const res = await updateOrderStatus(orderId, next);
        if (res.ok) {
          setCommitted(next);
          setFeedback({ kind: "ok", text: res.message });
        } else {
          setValue(committed); // revert
          setFeedback({ kind: "error", text: res.message });
        }
      } catch {
        // Network / stale-action failure — revert and inform, never crash.
        setValue(committed);
        setFeedback({
          kind: "error",
          text: "Connexion perdue. Rafraîchissez la page et réessayez.",
        });
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <select
        disabled={pending}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="text-sm border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 bg-white"
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      {feedback && (
        <p
          role="status"
          aria-live="polite"
          className={`text-xs ${feedback.kind === "error" ? "text-red-600" : "text-green-600"}`}
        >
          {feedback.text}
        </p>
      )}
    </div>
  );
}
