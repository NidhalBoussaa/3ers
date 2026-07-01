"use client";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { gsap } from "@/lib/gsap";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Wish = { name: string; msg: string; t: number };

export function Guestbook() {
  const { config, lang, t } = useI18n();
  const lbl = config.i18n.labels;
  const key = `wishes_${config.couple.monogram}`;
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [list, setList] = useState<Wish[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const justPosted = useRef(false);

  useEffect(() => {
    try {
      setList(JSON.parse(localStorage.getItem(key) ?? "[]"));
    } catch {
      setList([]);
    }
  }, [key]);

  // Animate the newest wish (rendered first) in after a post.
  useEffect(() => {
    if (!justPosted.current) return;
    justPosted.current = false;
    const first = listRef.current?.firstElementChild;
    if (!first) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      first,
      { opacity: 0, y: -16, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.6)" },
    );
  }, [list]);

  function post() {
    if (!name.trim() || !msg.trim()) return;
    const next = [...list, { name: name.trim(), msg: msg.trim(), t: Date.now() }];
    justPosted.current = true;
    setList(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
    setName(""); setMsg("");
  }

  return (
    <div className="max-w-md mx-auto mt-4 grid gap-3">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={lbl.yourName[lang]}
        className="bg-white/60 border-gold/40 h-12 text-base"
      />
      <Textarea
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder={lbl.yourWish[lang]}
        className="bg-white/60 border-gold/40 text-base min-h-[80px]"
      />
      <Button
        type="button"
        onClick={post}
        className="h-12 rounded-full text-white font-cinzel tracking-[3px] text-xs"
        style={{
          background: "linear-gradient(120deg, var(--gold-deep), var(--gold), var(--gold-bright))",
        }}
      >
        {t(lbl.postWish)}
      </Button>

      <div ref={listRef} className="mt-3 grid gap-2.5">
        {list.length === 0 ? (
          <div className="text-base italic text-gold-deep/70 p-3 text-center">{lbl.emptyWishes[lang]}</div>
        ) : (
          [...list].reverse().map((w, i) => (
            <div
              key={i}
              className="px-4 py-3.5 rounded-xl bg-white/50 border border-gold/30 text-start"
              dir="auto"
            >
              <div className="font-cinzel text-xs tracking-wider text-gold-deep mb-1">{w.name}</div>
              <div className="text-lg text-[#4a3e2c] italic leading-snug">« {w.msg} »</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
