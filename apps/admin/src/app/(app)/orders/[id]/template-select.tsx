"use client";

import { useTransition } from "react";
import { assignTemplate } from "./actions";

export function TemplateSelect({
  orderId,
  currentTemplateId,
  currentTemplateName,
  templates,
}: {
  orderId: string;
  currentTemplateId: string | null;
  currentTemplateName: string | null;
  templates: { id: string; name: string }[];
}) {
  const [pending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const templateId = e.target.value;
    if (!templateId) return;
    startTransition(() => assignTemplate(orderId, templateId));
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6">
      <h2 className="text-sm font-medium text-zinc-500 mb-3">Template</h2>
      <div className="flex items-center gap-3">
        <select
          defaultValue={currentTemplateId ?? ""}
          onChange={handleChange}
          disabled={pending}
          className="text-sm border border-zinc-200 rounded-lg px-3 py-2 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50"
        >
          <option value="">— Choisir un template —</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        {pending && <span className="text-xs text-zinc-400">Enregistrement…</span>}
        {currentTemplateName && !pending && (
          <span className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5">
            {currentTemplateName}
          </span>
        )}
      </div>
    </div>
  );
}
