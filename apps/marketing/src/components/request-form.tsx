"use client";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import { OrderRequestSchema } from "@/lib/order-schema";
import { Reveal } from "@/components/reveal";

type Status = "idle" | "sending" | "sealed" | "error";

const LANGS = [
  ["fr", "Français"],
  ["ar", "Arabe"],
  ["en", "Anglais"],
  ["all", "Les trois"],
] as const;

const TIERS = [
  ["essentiel", "Essentiel"],
  ["prestige", "Prestige"],
  ["indecis", "Conseillez-nous"],
] as const;

/**
 * The commission. Two names around a script ampersand — the form already
 * looks like the invitation it will become. On success, the house seal.
 */
export function RequestForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const parsed = OrderRequestSchema.safeParse(data);
    if (!parsed.success) {
      const map: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!map[key]) map[key] = issue.message;
      }
      setErrors(map);
      return;
    }

    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error(`orders POST failed: ${res.status}`);
      setStatus("sealed");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="demande" className="relative scroll-mt-20 overflow-hidden bg-night py-28 md:py-40">
      {/* Candlelight from beneath — the closing scene. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[420px] bg-[radial-gradient(ellipse_at_bottom,rgba(201,164,76,0.14)_0%,transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-2xl px-6">
        {status === "sealed" ? (
          <div className="flex flex-col items-center py-16 text-center">
            <Image
              src="/wax.png"
              alt=""
              width={132}
              height={132}
              className="seal-press h-32 w-32 object-contain drop-shadow-[0_16px_30px_rgba(201,164,76,0.35)]"
            />
            <h2 className="mt-10 font-body text-[clamp(1.9rem,4vw,2.8rem)] italic leading-tight text-cream">
              Votre demande est scell&eacute;e.
            </h2>
            <p className="mt-6 max-w-[44ch] font-body text-[1.14rem] leading-relaxed text-champagne/85">
              Nous vous &eacute;crivons sous 24 heures avec un aper&ccedil;u &agrave; vos
              pr&eacute;noms. Pensez &agrave; regarder vos ind&eacute;sirables.
            </p>
          </div>
        ) : (
          <>
            <Reveal variant="rise" className="text-center">
              <h2 className="font-body text-[clamp(2.1rem,5vw,3.5rem)] leading-[1.1] text-cream">
                Commencez <em className="text-gold-soft">votre histoire</em>
              </h2>
              <p className="mx-auto mt-6 max-w-[50ch] font-body text-[1.14rem] leading-relaxed text-champagne/85">
                Dites-nous qui vous &ecirc;tes. Sous 24 heures, vous recevez un
                aper&ccedil;u &agrave; vos pr&eacute;noms ; rien &agrave; payer
                aujourd&rsquo;hui.
              </p>
            </Reveal>

            <Reveal variant="soft" delay={1}>
              <form onSubmit={onSubmit} noValidate className="mt-14 flex flex-col gap-8">
                {/* The two names — already typeset like the invitation. */}
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-5">
                  <div className="w-full flex-1">
                    <label htmlFor="partner1" className="lbl mb-2 block text-[9.5px] text-gold-soft">
                      Premier pr&eacute;nom
                    </label>
                    <input id="partner1" name="partner1" type="text" autoComplete="given-name" placeholder="Yassine" className="field" />
                    {errors.partner1 && <FieldError msg={errors.partner1} />}
                  </div>
                  <span className="font-vibes text-4xl leading-none text-gold-soft sm:mt-5" aria-hidden="true">
                    &amp;
                  </span>
                  <div className="w-full flex-1">
                    <label htmlFor="partner2" className="lbl mb-2 block text-[9.5px] text-gold-soft">
                      Second pr&eacute;nom
                    </label>
                    <input id="partner2" name="partner2" type="text" placeholder="Mariem" className="field" />
                    {errors.partner2 && <FieldError msg={errors.partner2} />}
                  </div>
                </div>

                <div className="grid gap-8 sm:grid-cols-2">
                  <div>
                    <label htmlFor="weddingDate" className="lbl mb-2 block text-[9.5px] text-gold-soft">
                      Date du mariage
                    </label>
                    <input id="weddingDate" name="weddingDate" type="date" className="field" />
                    {errors.weddingDate && <FieldError msg={errors.weddingDate} />}
                  </div>
                  <div>
                    <label htmlFor="email" className="lbl mb-2 block text-[9.5px] text-gold-soft">
                      Votre email
                    </label>
                    <input id="email" name="email" type="email" autoComplete="email" placeholder="vous@exemple.com" className="field" />
                    {errors.email && <FieldError msg={errors.email} />}
                  </div>
                </div>

                <fieldset>
                  <legend className="lbl mb-3 block text-[9.5px] text-gold-soft">
                    Langue de l&rsquo;invitation
                  </legend>
                  <div className="flex flex-wrap gap-3">
                    {LANGS.map(([value, label], i) => (
                      <span key={value}>
                        <input
                          type="radio"
                          name="language"
                          id={`lang-${value}`}
                          value={value}
                          defaultChecked={i === 0}
                          className="sr-only"
                        />
                        <label htmlFor={`lang-${value}`} className="seg">
                          {label}
                        </label>
                      </span>
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="lbl mb-3 block text-[9.5px] text-gold-soft">Formule</legend>
                  <div className="flex flex-wrap gap-3">
                    {TIERS.map(([value, label], i) => (
                      <span key={value}>
                        <input
                          type="radio"
                          name="tier"
                          id={`tier-${value}`}
                          value={value}
                          defaultChecked={i === 2}
                          className="sr-only"
                        />
                        <label htmlFor={`tier-${value}`} className="seg">
                          {label}
                        </label>
                      </span>
                    ))}
                  </div>
                </fieldset>

                <div>
                  <label htmlFor="message" className="lbl mb-2 block text-[9.5px] text-gold-soft">
                    Un mot sur votre soir&eacute;e{" "}
                    <span className="normal-case tracking-normal opacity-70">(facultatif)</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Le lieu, l'ambiance, ce qui compte pour vous…"
                    className="field"
                  />
                </div>

                {/* Honeypot — visually nowhere, semantically ignored. */}
                <div className="absolute left-[-9999px] top-auto" aria-hidden="true">
                  <label htmlFor="website">Site web</label>
                  <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="mt-2 flex flex-col items-center gap-5">
                  <button type="submit" disabled={status === "sending"} className="btn-seal">
                    {status === "sending" ? "Envoi en cours…" : "Envoyer la demande"}
                  </button>
                  {status === "error" && (
                    <p role="alert" className="font-body text-[1.05rem] italic text-[#f2b8ab]">
                      L&rsquo;envoi a &eacute;chou&eacute;. R&eacute;essayez dans un instant,
                      ou &eacute;crivez-nous sur Instagram.
                    </p>
                  )}
                </div>
              </form>
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}

function FieldError({ msg }: { msg: string }) {
  return (
    <p role="alert" className="mt-2 font-body text-[0.98rem] italic text-[#f2b8ab]">
      {msg}
    </p>
  );
}
