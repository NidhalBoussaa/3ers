"use client";

import { useMemo, useState, useTransition } from "react";
import { saveContentDraft } from "../actions";
import { Check, Lock } from "lucide-react";

type SchemaField = {
  key: string;
  type: "text" | "date" | "select" | "textarea";
  label: string;
  required: boolean;
  options?: string[];
  group?: string;
  lang?: "ar";
};

const DEFAULT_GROUP = "Détails";

export function ContentForm({
  orderId,
  schema,
  draft,
  live,
  canEdit,
}: {
  orderId: string;
  schema: SchemaField[];
  draft: Record<string, string>;
  live: Record<string, string>;
  canEdit: boolean;
}) {
  const [values, setValues] = useState<Record<string, string>>(draft);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  // Group fields into sections by their `group` (falls back to one section).
  const sections = useMemo(() => {
    const map = new Map<string, SchemaField[]>();
    for (const f of schema) {
      const g = f.group ?? DEFAULT_GROUP;
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(f);
    }
    return Array.from(map.entries());
  }, [schema]);

  // "X champs modifiés depuis la dernière validation" — compare current values to live.
  const changedCount = useMemo(() => {
    return schema.reduce((n, f) => {
      const cur = (values[f.key] ?? "").trim();
      const pub = (live[f.key] ?? "").trim();
      return cur !== pub ? n + 1 : n;
    }, 0);
  }, [values, live, schema]);

  function set(key: string, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    setSaved(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await saveContentDraft(orderId, values);
      setSaved(true);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {sections.map(([group, fields], si) => (
        <fieldset
          key={group}
          className="card rise p-6 sm:p-7"
          style={{ "--i": si } as React.CSSProperties}
        >
          <legend className="lbl float-none mb-5 block text-[10px] text-gold-deep">
            {group}
          </legend>
          <div className="flex flex-col gap-5">
            {fields.map((field) => {
              const rtl = field.lang === "ar";
              const id = `f-${field.key}`;
              return (
                <div key={field.key}>
                  <label
                    htmlFor={id}
                    className="mb-2 flex items-center gap-1 font-body text-[1.05rem] text-ink"
                  >
                    {field.label}
                    {field.required && <span className="text-gold-deep">*</span>}
                  </label>

                  {field.type === "textarea" ? (
                    <textarea
                      id={id}
                      dir={rtl ? "rtl" : undefined}
                      lang={rtl ? "ar" : undefined}
                      value={values[field.key] ?? ""}
                      onChange={(e) => set(field.key, e.target.value)}
                      required={field.required}
                      disabled={!canEdit}
                      rows={4}
                      className="field"
                    />
                  ) : field.type === "select" ? (
                    <select
                      id={id}
                      value={values[field.key] ?? ""}
                      onChange={(e) => set(field.key, e.target.value)}
                      required={field.required}
                      disabled={!canEdit}
                      className="field"
                    >
                      <option value="">— Choisir —</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={id}
                      type={field.type}
                      dir={rtl ? "rtl" : undefined}
                      value={values[field.key] ?? ""}
                      onChange={(e) => set(field.key, e.target.value)}
                      required={field.required}
                      disabled={!canEdit}
                      className="field"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </fieldset>
      ))}

      {/* Action bar. In-flow on mobile (sticky would cover fields); sticky on desktop. */}
      {canEdit ? (
        <div className="lg:sticky lg:bottom-6 lg:z-10">
          <div className="card flex flex-wrap items-center justify-between gap-4 p-4 sm:px-6">
            <p className="font-body text-[1.02rem] italic text-ink-soft">
              {changedCount > 0 ? (
                <>
                  <span className="not-italic font-cinzel text-[11px] font-semibold tracking-[0.1em] text-gold-deep">
                    {changedCount}
                  </span>{" "}
                  {changedCount > 1 ? "champs modifiés" : "champ modifié"} depuis la
                  dernière validation
                </>
              ) : (
                "Aucune modification à valider"
              )}
            </p>
            <div className="flex items-center gap-3">
              {saved && (
                <span className="toast flex items-center gap-1.5 font-body text-[1.02rem] italic text-[var(--ok)]">
                  <Check size={15} strokeWidth={2} /> Enregistré
                </span>
              )}
              <button type="submit" disabled={pending} className="btn">
                {pending ? "Enregistrement…" : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="card flex items-start gap-3 p-5">
          <Lock size={17} strokeWidth={1.6} className="mt-0.5 shrink-0 text-gold-deep" />
          <p className="font-body text-[1.06rem] leading-relaxed text-ink-soft">
            Vos informations sont en cours de validation par l&rsquo;atelier. Écrivez-nous
            depuis l&rsquo;onglet Messages pour toute modification.
          </p>
        </div>
      )}
    </form>
  );
}
