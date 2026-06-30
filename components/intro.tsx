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
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const preview =
      new URLSearchParams(window.location.search).get("preview") === "1";
    if (reduce || preview || !config.features.video) {
      setPhase("gone");
      onDone();
    }
  }, [config.features.video, onDone]);

  // Seek to first frame so the video shows as a cinematic still on idle.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0.001;
  }, []);

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
    v.currentTime = 0;
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
      className={`fixed inset-0 z-60 bg-night overflow-hidden grid place-items-center transition-[opacity,visibility] duration-1200 ease-in-out ${
        phase === "fading" ? "opacity-0 invisible pointer-events-none" : ""
      }`}
    >
      {/* Video — visible from idle as a cinematic still, plays on seal tap */}
      <video
        ref={videoRef}
        playsInline
        preload="auto"
        muted
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover bg-night"
      >
        <source src={config.assets.introVideo} type="video/mp4" />
      </video>

      {/* Cinematic vignette — always present */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-2"
        style={{
          background:
            "linear-gradient(180deg, rgba(11,8,5,.35) 0%, rgba(11,8,5,0) 30%, rgba(11,8,5,0) 62%, rgba(11,8,5,.65) 100%)",
        }}
      />

      {/* ── Wax seal CTA — visible only on idle ── */}
      <div
        className={`relative z-5 flex flex-col items-center gap-5 transition-opacity duration-500 select-none ${
          phase !== "idle" ? "opacity-0 pointer-events-none" : ""
        }`}
      >
        {/* Couple names */}
        <p
          className="font-cinzel text-[10px] tracking-[7px] text-[#1a1108] uppercase"
          style={{ textShadow: "0 1px 0 rgba(255,255,255,.15)" }}
        >
          {config.couple.groom.first} &amp; {config.couple.bride.first}
        </p>

        {/* Wax seal button */}
        <button
          type="button"
          onClick={start}
          aria-label="Open invitation"
          className="group relative cursor-pointer focus-visible:outline-none"
        >
          {/* Slow breathing glow behind the seal */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              boxShadow: "0 0 0 0 rgba(201,164,76,.4)",
              animation: "pulseGlow 3s ease-in-out infinite",
            }}
          />
          {/* Expanding ring */}
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-4 rounded-full border border-[#c9a44c]/25"
            style={{ animation: "ringExpand 3s ease-out infinite" }}
          />
          {/* Second ring, offset phase */}
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-8 rounded-full border border-[#c9a44c]/12"
            style={{
              animation: "ringExpand 3s ease-out infinite",
              animationDelay: "1.2s",
            }}
          />

          {/* Seal image */}
          <img
            src="/wax.png"
            alt=""
            aria-hidden="true"
            draggable={false}
            className="relative block w-36 h-36 sm:w-44 sm:h-44 rounded-full object-cover transition-all duration-700 group-hover:scale-105"
            style={{
              filter:
                "drop-shadow(0 8px 32px rgba(0,0,0,.7)) drop-shadow(0 0 16px rgba(201,164,76,.35))",
            }}
          />
        </button>

        {/* Hint label */}
        <p
          className="font-amiri text-[15px] text-[#1a1108] tracking-wide"
          style={{ textShadow: "0 1px 0 rgba(255,255,255,.15)" }}
          dir="rtl"
        >
          افتح الدعوة
        </p>
      </div>

      {/* Skip — discreet, bottom corner. Jumps straight to the landing,
          whether the orb hasn't been tapped yet or the film is playing. */}
      <button
        type="button"
        onClick={finish}
        aria-label="Skip intro"
        className={`group absolute bottom-[max(28px,calc(env(safe-area-inset-bottom)+16px))] right-5 z-6 inline-flex items-center gap-3 cursor-pointer transition-all duration-500 focus-visible:outline-none ${
          phase !== "playing" ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {/* Label */}
        <span
          className="font-cinzel text-[9px] tracking-[3px] uppercase text-[#f6ecd2]/60 group-hover:text-[#f6ecd2]/90 transition-colors duration-300"
          style={{ textShadow: "0 1px 12px rgba(0,0,0,.7)" }}
        >
          تخطّي
        </span>

        {/* Icon circle */}
        <span className="relative flex size-9 items-center justify-center rounded-full border border-[#f1d894]/30 bg-black/20 backdrop-blur-sm transition-all duration-400 group-hover:border-[#f1d894]/70 group-hover:bg-black/30">
          {/* Pulse ring */}
          <span
            aria-hidden
            className="absolute inset-0 rounded-full border border-[#f1d894]/20 group-hover:border-[#f1d894]/50 transition-all duration-400 group-hover:scale-125 group-hover:opacity-0"
            style={{
              transition:
                "transform .5s ease, opacity .5s ease, border-color .4s",
            }}
          />
          {/* Arrow */}
          <svg
            viewBox="0 0 16 16"
            className="size-3.5 fill-none stroke-[#f1d894]/70 group-hover:stroke-[#f1d894] transition-colors duration-300 translate-x-px"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </span>
      </button>
    </section>
  );
}
