"use client";

import { useRef, useState, useTransition } from "react";
import { sendMessage } from "./actions";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  fromRole: string;
  body: string;
  read: boolean | null;
  createdAt: Date | null;
};

export function MessageThread({
  orderId,
  messages,
}: {
  orderId: string;
  messages: Message[];
}) {
  const [body, setBody] = useState("");
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLTextAreaElement>(null);

  function handleSend() {
    if (!body.trim()) return;
    startTransition(async () => {
      await sendMessage(orderId, body.trim());
      setBody("");
    });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-sm text-zinc-400">Aucun message.</p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "flex",
              m.fromRole === "admin" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-sm px-4 py-2.5 rounded-2xl text-sm",
                m.fromRole === "admin"
                  ? "bg-amber-50 text-amber-900 rounded-br-sm"
                  : "bg-zinc-100 text-zinc-800 rounded-bl-sm"
              )}
            >
              {m.body}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <textarea
          ref={ref}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={2}
          placeholder="Message…"
          className="flex-1 text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          onClick={handleSend}
          disabled={pending || !body.trim()}
          className="px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-40 self-end transition"
          style={{ backgroundColor: "#c9a44c" }}
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}
