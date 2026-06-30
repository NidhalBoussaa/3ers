"use client";
import { useI18n } from "@/lib/i18n";
import { MusicPlayer } from "./music-player";
import { ShareButton } from "./share-button";
import { LangSwitcher } from "./lang-switcher";

export function FloatingDock() {
  const { introDone } = useI18n();
  return (
    <>
      {introDone && <LangSwitcher />}
      <div
        className="fixed right-4 z-40 flex flex-col gap-2.5 items-end"
        style={{ bottom: `calc(1.25rem + var(--safe-bot))` }}
      >
        <ShareButton visible={introDone} />
        <MusicPlayer visible={introDone} />
      </div>
    </>
  );
}
