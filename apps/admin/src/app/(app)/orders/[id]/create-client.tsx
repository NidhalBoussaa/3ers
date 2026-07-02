"use client";

import { useState, useTransition } from "react";
import { createClientAccount } from "./actions";
import { UserPlus } from "lucide-react";

export function CreateClientButton({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    startTransition(async () => {
      const res = await createClientAccount(orderId, email, password);
      setResult(res);
      if (res.ok) {
        setEmail("");
        setPassword("");
        setOpen(false);
      }
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-zinc-200 rounded-lg text-zinc-600 hover:bg-zinc-50 transition"
      >
        <UserPlus size={13} />
        Créer compte client
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-3">
      <h3 className="text-sm font-medium text-zinc-800">Créer un compte client</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email du client"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <input
          type="password"
          placeholder="Mot de passe temporaire"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        {result && !result.ok && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {result.message}
          </p>
        )}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={pending}
            className="px-4 py-2 text-xs font-medium text-white rounded-lg disabled:opacity-50 transition"
            style={{ backgroundColor: "#c9a44c" }}
          >
            {pending ? "Création…" : "Créer et lier"}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-4 py-2 text-xs text-zinc-500 hover:text-zinc-800 transition"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
