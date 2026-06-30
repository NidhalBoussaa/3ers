"use client";
import { useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { Intro } from "./intro";
import { Petals } from "./petals";
import { DustCanvas } from "./dust-canvas";
import { FloatingDock } from "./floating-dock";

/** Mounts the intro overlay + scroll-time effects + floating dock; the static main page renders separately. */
export function WeddingExperience({ skipIntro }: { skipIntro?: boolean }) {
  const { introDone, markIntroDone } = useI18n();

  useEffect(() => {
    if (skipIntro && !introDone) markIntroDone();
  }, [skipIntro, introDone, markIntroDone]);

  return (
    <>
      <DustCanvas />
      <Petals active={introDone} />
      {!skipIntro && <Intro onDone={markIntroDone} />}
      <FloatingDock />
    </>
  );
}
