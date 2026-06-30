"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useI18n } from "@/lib/i18n";
import { gsap } from "@/lib/gsap";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function RsvpForm() {
  const { config, lang, t } = useI18n();
  const lbl = config.i18n.labels;
  const [submitted, setSubmitted] = useState<null | { name: string; att: string }>(null);
  const [seats, setSeats] = useState("1");
  const formRef = useRef<HTMLFormElement | null>(null);

  // Stagger the fields up as the form scrolls into view.
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(form, { opacity: 1 });
        gsap.fromTo(
          form.children,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.07,
            scrollTrigger: { trigger: form, start: "top 85%", once: true },
          },
        );
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(form, { opacity: 1, clearProps: "all" });
      });
    }, form);
    return () => ctx.revert();
  }, []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = (data.get("name") as string).trim();
    if (!name) return;
    const att = (data.get("att") as string) ?? "oui";
    const msg = ((data.get("msg") as string) ?? "").trim();

    const key = `rsvp_${config.couple.monogram}`;
    try {
      const list: unknown[] = JSON.parse(localStorage.getItem(key) ?? "[]");
      list.push({ name, att, seats, msg, t: Date.now() });
      localStorage.setItem(key, JSON.stringify(list));
    } catch {}

    if (config.contact.email?.includes("@")) {
      const sub = encodeURIComponent(`RSVP Mariage — ${name}`);
      const body = encodeURIComponent(
        `Nom: ${name}\nPrésence: ${att === "oui" ? "Oui" : "Non"}\nPersonnes: ${seats}\nMessage: ${msg}`,
      );
      const a = document.createElement("a");
      a.href = `mailto:${config.contact.email}?subject=${sub}&body=${body}`;
      a.click();
    }

    setSubmitted({ name, att });
  }

  if (submitted) {
    const tpl = submitted.att === "oui" ? lbl.thanksAttend[lang] : lbl.thanksNoAttend[lang];
    return (
      <div className="max-w-md mx-auto py-6 text-center font-vibes text-3xl text-gold-deep leading-tight">
        {tpl.replace("{name}", submitted.name)}
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      autoComplete="off"
      className="anim-init max-w-md mx-auto mt-4 grid gap-3 text-center"
    >
      <Input
        name="name"
        type="text"
        required
        placeholder={lbl.fullName[lang]}
        className="bg-white/60 border-gold/40 placeholder:text-gold-deep/50 font-sans text-base h-12"
      />

      <fieldset className="grid grid-cols-2 gap-2">
        <legend className="sr-only">Attendance</legend>
        <AttendRadio name="att" value="oui" defaultChecked>{lbl.willAttend[lang]}</AttendRadio>
        <AttendRadio name="att" value="non">{lbl.wontAttend[lang]}</AttendRadio>
      </fieldset>

      <Select value={seats} onValueChange={setSeats} name="seats">
        <SelectTrigger className="bg-white/60 border-gold/40 h-12 text-base font-sans">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {[1, 2, 3, 4, 5].map((n) => (
            <SelectItem key={n} value={String(n)}>
              {n === 5 ? "5+" : n} {n === 1 ? lbl.person[lang] : lbl.people[lang]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Textarea
        name="msg"
        placeholder={lbl.messagePlaceholder[lang]}
        className="bg-white/60 border-gold/40 font-sans text-base min-h-[80px]"
      />

      <Button
        type="submit"
        className="h-12 rounded-full text-white font-cinzel tracking-[3px] text-xs"
        style={{
          background: "linear-gradient(120deg, var(--gold-deep), var(--gold), var(--gold-bright))",
        }}
      >
        {t(lbl.send)}
      </Button>
    </form>
  );
}

function AttendRadio({
  name,
  value,
  defaultChecked,
  children,
}: {
  name: string;
  value: string;
  defaultChecked?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="cursor-pointer block">
      <input
        type="radio"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />
      <span className="block h-12 leading-[2.85rem] rounded-xl border border-gold/40 font-cinzel text-[11px] tracking-widest text-gold-deep text-center transition peer-checked:bg-gold peer-checked:text-white peer-checked:border-gold peer-focus-visible:outline-2 peer-focus-visible:outline-gold-bright peer-focus-visible:outline-offset-2">
        {children}
      </span>
    </label>
  );
}
