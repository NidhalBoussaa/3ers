"use client";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

type Phase = "idle" | "playing" | "fading" | "gone";

export function Intro({ onDone }: { onDone: () => void }) {
  const { config, t, markUserTapped } = useI18n();
  const [phase, setPhase] = useState<Phase>("idle");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // skip the intro entirely on reduced motion, when video disabled, or with ?preview=1
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const preview = new URLSearchParams(window.location.search).get("preview") === "1";
    if (reduce || preview || !config.features.video) {
      setPhase("gone");
      onDone();
    }
  }, [config.features.video, onDone]);

  function start() {
    if (phase !== "idle") return;
    setPhase("playing");
    // Music starts on this same gesture so the soundtrack is continuous from tap → envelope → landing.
    // The envelope video stays MUTED so it doesn't fight the music.
    markUserTapped();
    const v = videoRef.current;
    if (!v) {
      finish();
      return;
    }
    v.muted = true;
    v.play().catch(() => {});
    const close = () => finish();
    v.addEventListener("ended", close, { once: true });
    const dur = isFinite(v.duration) && v.duration > 0 ? v.duration : 16;
    setTimeout(close, (dur + 0.6) * 1000);
  }

  function finish() {
    if (phase === "fading" || phase === "gone") return;
    setPhase("fading");
    onDone();
    setTimeout(() => setPhase("gone"), 1300);
  }

  if (phase === "gone") return null;

  return (
    <section
      aria-label="Wedding intro"
      className={`fixed inset-0 z-[60] bg-night overflow-hidden grid place-items-center transition-[opacity,visibility] duration-[1200ms] ease-in-out ${
        phase === "fading" ? "opacity-0 invisible pointer-events-none" : ""
      }`}
    >
      <video
        ref={videoRef}
        playsInline
        preload="auto"
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full object-cover bg-night transition-opacity duration-1000 ${
          phase === "playing" || phase === "fading" ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src={config.assets.introVideo} type="video/mp4" />
      </video>

      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background:
            "linear-gradient(180deg, rgba(11,8,5,.25) 0%, rgba(11,8,5,0) 28%, rgba(11,8,5,0) 65%, rgba(11,8,5,.55) 100%)",
        }}
      />

      <button
        type="button"
        onClick={start}
        aria-label="Open invitation"
        className={`relative z-[5] w-36 h-36 sm:w-40 sm:h-40 rounded-full border border-gold-bright text-[#f6ecd2] cursor-pointer backdrop-blur-md font-marcellus text-2xl tracking-[3px] transition-opacity duration-500 hover:scale-105 focus-visible:outline-2 focus-visible:outline-gold-bright focus-visible:outline-offset-[6px] ${
          phase !== "idle" ? "opacity-0 pointer-events-none" : ""
        }`}
        style={{
          background: "linear-gradient(165deg, rgba(241,216,148,.18), rgba(11,8,5,.4))",
          textShadow: "0 2px 14px rgba(0,0,0,.6)",
          animation: phase === "idle" ? "pulseGlow 2.4s ease-in-out infinite" : "none",
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-2 rounded-full border border-gold-bright/30"
          style={{ animation: "ringExpand 2.5s ease-out infinite" }}
        />
        <span className="relative">{t(config.i18n.labels.greeting)}</span>
      </button>
    </section>
  );
}
