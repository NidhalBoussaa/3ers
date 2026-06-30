import weddingData from "@/data/wedding.json";
import { WeddingConfigSchema } from "@/lib/schema";
import { I18nProvider } from "@/lib/i18n";
import { WeddingExperience } from "@/components/wedding-experience";
import { BismillahSection } from "@/components/sections/bismillah";
import { NamesSection } from "@/components/sections/names";
import { DetailCards } from "@/components/sections/detail-cards";
import { StoryTimeline } from "@/components/sections/story-timeline";
import { ProgramSection } from "@/components/sections/program";
import { ClosingSection } from "@/components/sections/closing";
import { CouplePhoto } from "@/components/sections/couple-photo";
import { LandingHero } from "@/components/sections/landing-hero";
import { Countdown } from "@/components/countdown";
import { CalendarAndDirections } from "@/components/calendar-button";
import { RsvpForm } from "@/components/rsvp-form";
import { Guestbook } from "@/components/guestbook";
import { Gallery } from "@/components/gallery";
import { Ornament } from "@/components/ornament";
import { Reveal } from "@/components/reveal";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import type { Lang } from "@/lib/schema";

const LANGS: Lang[] = ["fr", "ar", "en"];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>;
}) {
  const config = WeddingConfigSchema.parse(weddingData);
  const lbl = config.i18n.labels;
  const skipIntro = (await searchParams).preview === "1";

  return (
    <I18nProvider config={config}>
      {/* Per-couple theme override — runs before the main paint via inline style. */}
      <style>{`:root{
        --gold:${config.theme.gold};
        --gold-bright:${config.theme.goldBright};
        --gold-soft:${config.theme.goldSoft};
        --gold-deep:${config.theme.goldDeep};
        --cream:${config.theme.cream};
        --night:${config.theme.night};
      }`}</style>

      <WeddingExperience skipIntro={skipIntro} />

      <SmoothScrollProvider>
      <main className="relative z-[3]">
        <LandingHero />
        <div
          className="stage"
          style={{
            background: `
              radial-gradient(circle at 18% 8%, rgba(201,164,76,.10), transparent 42%),
              radial-gradient(circle at 82% 92%, rgba(201,164,76,.10), transparent 42%),
              linear-gradient(180deg, #fbf8f0 0%, var(--cream) 40%, #f4eedd 100%)
            `,
          }}
        >
          <div className="frame relative mx-auto max-w-[720px] px-5 sm:px-7 pt-[70px] pb-[90px] text-center">
            {/* gold vertical rails on either side of the frame */}
            <div
              aria-hidden
              className="pointer-events-none absolute top-10 bottom-10 left-3.5 w-px hidden sm:block"
              style={{
                background:
                  "linear-gradient(180deg, transparent, rgba(201,164,76,.5) 12%, rgba(201,164,76,.5) 88%, transparent)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute top-10 bottom-10 right-3.5 w-px hidden sm:block"
              style={{
                background:
                  "linear-gradient(180deg, transparent, rgba(201,164,76,.5) 12%, rgba(201,164,76,.5) 88%, transparent)",
              }}
            />

            <BismillahSection config={config} />
            <NamesSection config={config} />

            <Ornament />

            <Reveal>
              <div className="font-cinzel text-[11px] tracking-[5px] text-gold-deep/80">
                {LANGS.map((l) => (
                  <span key={l} data-lang={l}>{lbl.daysLeft[l]}</span>
                ))}
              </div>
            </Reveal>
            <Countdown />

            <DetailCards config={config} />

            <Ornament />

            <CalendarAndDirections />

            <CouplePhoto />

            <Ornament />

            <StoryTimeline config={config} />

            <Gallery />

            <Ornament />

            <ProgramSection config={config} />

            <Ornament />

            {config.features.rsvp && (
              <>
                <Reveal>
                  <div className="font-cinzel text-[11px] tracking-[5px] text-gold-deep/80">
                    {LANGS.map((l) => (
                      <span key={l} data-lang={l}>{lbl.rsvp[l]}</span>
                    ))}
                  </div>
                </Reveal>
                <Reveal delay={1}>
                  <div className="font-vibes text-gold-deep leading-tight text-[clamp(22px,6vw,32px)]">
                    {LANGS.map((l) => (
                      <span key={l} data-lang={l}>{lbl.confirmAttendance[l]}</span>
                    ))}
                  </div>
                </Reveal>
                <Reveal delay={2}>
                  <RsvpForm />
                </Reveal>
                <Ornament />
              </>
            )}

            {config.features.guestbook && (
              <>
                <Reveal>
                  <div className="font-cinzel text-[11px] tracking-[5px] text-gold-deep/80">
                    {LANGS.map((l) => (
                      <span key={l} data-lang={l}>{lbl.guestbook[l]}</span>
                    ))}
                  </div>
                </Reveal>
                <Reveal delay={1}>
                  <Guestbook />
                </Reveal>
                <Ornament />
              </>
            )}

            <ClosingSection config={config} />
          </div>
        </div>
      </main>
      </SmoothScrollProvider>
    </I18nProvider>
  );
}
