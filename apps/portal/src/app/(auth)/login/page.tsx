"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Ornament } from "@/components/ornament";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });

    setLoading(false);
    if (result?.error) {
      setError("Email ou mot de passe incorrect.");
      return;
    }
    router.push("/order");
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-night px-5">
      {/* Candlelight from below — the invitation's world at the door. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-[radial-gradient(ellipse_at_bottom,rgba(201,164,76,0.16)_0%,transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="lbl mb-4 text-[10px] text-gold-soft/80">Votre atelier privé</p>
          <p className="font-deco text-[2.6rem] font-bold tracking-[0.1em] text-gold-soft">3ers</p>
          <Ornament className="mt-5" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="email" className="lbl mb-2 block text-[9.5px] text-gold-soft">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="vous@exemple.com"
              className="field !bg-white/6 !text-cream placeholder:!text-champagne/50"
            />
          </div>
          <div>
            <label htmlFor="password" className="lbl mb-2 block text-[9.5px] text-gold-soft">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="field !bg-white/6 !text-cream"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-[#a15a4d]/40 bg-[#a15a4d]/10 px-4 py-3 font-body text-[1.04rem] italic text-[#f2b8ab]"
            >
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn mt-2 w-full">
            {loading ? "Connexion…" : "Accéder à mon espace"}
          </button>
        </form>

        <p className="mt-8 text-center font-body text-[1rem] italic text-champagne/60">
          Un souci pour vous connecter ? Écrivez-nous, nous vous ouvrons la porte.
        </p>
      </div>
    </div>
  );
}
