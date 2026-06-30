"use client";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ShareButton({ visible }: { visible: boolean }) {
  const { config, lang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href.split("?")[0]);
  }, []);

  if (!config.features.share || !visible) return null;

  const text = config.shareText[lang] || config.shareText.fr;

  async function handleShare() {
    if (typeof navigator !== "undefined" && (navigator as Navigator & { share?: unknown }).share) {
      try {
        await (navigator as Navigator).share({ title: document.title, text, url });
        return;
      } catch {/* fall through */}
    }
    setOpen(true);
  }

  function copy() {
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={handleShare}
        aria-label="Share invitation"
        className="size-12 rounded-full border border-gold bg-cream/90 text-gold-deep backdrop-blur-sm shadow-[0_6px_20px_-6px_rgba(0,0,0,.3)] flex items-center justify-center transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-gold-bright focus-visible:outline-offset-2"
      >
        <svg viewBox="0 0 24 24" className="size-5 stroke-current fill-none" strokeWidth={1.6} aria-hidden="true">
          <circle cx="6" cy="12" r="2.5" />
          <circle cx="18" cy="6" r="2.5" />
          <circle cx="18" cy="18" r="2.5" />
          <line x1="8.2" y1="10.9" x2="15.8" y2="7.1" />
          <line x1="8.2" y1="13.1" x2="15.8" y2="16.9" />
        </svg>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-cinzel text-sm tracking-widest text-gold-deep text-center">
              {t(config.i18n.labels.share)}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-3 py-2">
            <ShareTile
              label="WhatsApp"
              href={`https://wa.me/?text=${encodeURIComponent(`${text} — ${url}`)}`}
              icon={<WhatsappIcon />}
            />
            <ShareTile
              label="Telegram"
              href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`}
              icon={<TelegramIcon />}
            />
            <ShareTile
              label="SMS"
              href={`sms:?&body=${encodeURIComponent(`${text} ${url}`)}`}
              icon={<SmsIcon />}
            />
            <Button
              type="button"
              variant="ghost"
              onClick={copy}
              className="flex flex-col items-center gap-1.5 h-auto"
            >
              <span className="size-12 rounded-full border border-gold/40 bg-white flex items-center justify-center">
                <CopyIcon />
              </span>
              <span className="font-cinzel text-[10px] tracking-widest text-gold-deep">
                {copied ? "✓" : t(config.i18n.labels.copy)}
              </span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ShareTile({
  label,
  href,
  icon,
}: {
  label: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className="flex flex-col items-center gap-1.5 group"
    >
      <span className="size-12 rounded-full border border-gold/40 bg-white flex items-center justify-center transition group-hover:-translate-y-0.5 group-hover:shadow-[0_8px_18px_-10px_rgba(140,109,42,.6)]">
        {icon}
      </span>
      <span className="font-cinzel text-[10px] tracking-widest text-gold-deep">{label}</span>
    </a>
  );
}

function WhatsappIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="#25d366" aria-hidden="true">
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.7-.9-2.3-.2-.6-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2 0 1.3.9 2.5 1.1 2.7.1.2 1.8 2.7 4.3 3.8 1.5.6 2.1.7 2.8.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 1.7.5 3.3 1.3 4.7L2 22l5.4-1.3C8.8 21.5 10.3 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z" />
    </svg>
  );
}
function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="#0088cc" aria-hidden="true">
      <path d="M22 3L2 11l5.5 2 2 6.5L13 16l5.5 4L22 3z" />
    </svg>
  );
}
function SmsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 stroke-gold-deep fill-none" strokeWidth={1.6} aria-hidden="true">
      <path d="M21 11.5a8.4 8.4 0 0 1-1 4 8.5 8.5 0 0 1-7.6 4.6 8.4 8.4 0 0 1-4-1L3 21l1.9-5.4a8.4 8.4 0 0 1-1-4 8.5 8.5 0 0 1 4.6-7.6 8.4 8.4 0 0 1 4-1A8.5 8.5 0 0 1 21 11.5z" />
    </svg>
  );
}
function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 stroke-gold-deep fill-none" strokeWidth={1.6} aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
