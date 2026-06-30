"use client";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

/**
 * Floating music button + audio element.
 *
 * The <audio> element is mounted from the page's first paint so we can call play() inside the
 * synchronous orb-tap handler (browsers only permit audio playback from a user-gesture handler).
 * Music starts at full volume on tap and runs continuously through the envelope intro and into
 * the landing video — no fade-in, no perceivable transition.
 *
 * The visible toggle (the button itself) only appears once the intro overlay is gone, so it
 * doesn't compete with the cinematic envelope.
 */
export function MusicPlayer({ visible }: { visible: boolean }) {
  const { config, userTapped } = useI18n();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!userTapped || started || !config.features.music) return;
    const a = audioRef.current;
    if (!a) return;
    a.volume = 1;
    a.play()
      .then(() => { setPlaying(true); setStarted(true); })
      .catch(() => { setPlaying(false); setStarted(true); });
  }, [userTapped, started, config.features.music]);

  if (!config.features.music) return null;

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else         { a.play().then(() => setPlaying(true)).catch(() => {}); }
  }

  return (
    <>
      <audio ref={audioRef} loop preload="auto">
        <source src={config.assets.music} type="audio/mpeg" />
      </audio>
      {visible && (
        <button
          type="button"
          onClick={toggle}
          aria-label="Toggle music"
          aria-pressed={playing}
          className="size-12 rounded-full border border-gold bg-cream/90 text-gold-deep backdrop-blur-sm shadow-[0_6px_20px_-6px_rgba(0,0,0,.3)] flex items-center justify-center transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-gold-bright focus-visible:outline-offset-2"
        >
          <div className={`eq ${playing ? "" : "eq-paused"}`} aria-hidden="true">
            <i /><i /><i /><i />
          </div>
        </button>
      )}
    </>
  );
}
