"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { loadThread, sendMessage, type ThreadMessage } from "./actions";
import { relativeTime } from "@/lib/utils";
import { Send } from "lucide-react";

export function Thread({ initial }: { initial: ThreadMessage[] }) {
  const [messages, setMessages] = useState<ThreadMessage[]>(initial);
  const [draft, setDraft] = useState("");
  const [pending, startTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Poll for admin replies every 20s (matches plan's real-time-ish approach).
  useEffect(() => {
    const id = setInterval(() => {
      loadThread()
        .then((fresh) => {
          setMessages((prev) => (fresh.length !== prev.length ? fresh : prev));
        })
        .catch(() => {});
    }, 20_000);
    return () => clearInterval(id);
  }, []);

  // Keep the newest message in view.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    if (!body || pending) return;

    // Optimistic append.
    const optimistic: ThreadMessage = {
      id: `tmp-${messages.length}`,
      fromRole: "client",
      body,
      createdAt: new Date().toISOString(),
    };
    setMessages((m) => [...m, optimistic]);
    setDraft("");

    startTransition(async () => {
      const saved = await sendMessage(body);
      if (saved) {
        setMessages((m) => m.map((msg) => (msg.id === optimistic.id ? saved : msg)));
      }
    });
  }

  return (
    <div className="card flex h-[62dvh] min-h-[420px] flex-col overflow-hidden lg:h-[58vh]">
      {/* Transcript */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
        {messages.length === 0 ? (
          <div className="grid h-full place-items-center text-center">
            <p className="max-w-xs font-body text-[1.08rem] italic text-ink-soft">
              Aucun message pour l&rsquo;instant. Dites-nous bonjour, ou posez votre
              première question.
            </p>
          </div>
        ) : (
          messages.map((m) => {
            const mine = m.fromRole === "client";
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[80%]">
                  <div
                    className={`rounded-2xl px-4 py-2.5 font-body text-[1.08rem] leading-relaxed ${
                      mine
                        ? "rounded-br-md bg-gold/15 text-ink"
                        : "rounded-bl-md border border-gold/25 bg-white/70 text-ink"
                    }`}
                  >
                    {!mine && (
                      <span className="mb-0.5 block font-cinzel text-[8.5px] uppercase tracking-[0.2em] text-gold-deep">
                        L&rsquo;atelier
                      </span>
                    )}
                    {m.body}
                  </div>
                  <p
                    className={`mt-1 font-cinzel text-[8.5px] uppercase tracking-[0.12em] text-ink-soft/60 ${mine ? "text-right" : "text-left"}`}
                  >
                    {relativeTime(m.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <form
        onSubmit={handleSend}
        className="flex items-end gap-3 border-t border-gold/20 bg-white/40 p-3"
      >
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          }}
          rows={1}
          placeholder="Écrire un message…"
          className="field max-h-32 min-h-[48px] flex-1 resize-none py-3"
          aria-label="Votre message"
        />
        <button
          type="submit"
          disabled={pending || !draft.trim()}
          className="btn aspect-square !min-h-[48px] !w-12 !p-0"
          aria-label="Envoyer"
        >
          <Send size={16} strokeWidth={1.8} />
        </button>
      </form>
    </div>
  );
}
