export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { db } from "@3ers/db/client";
import { orders } from "@3ers/db/schema";
import { eq } from "drizzle-orm";
import { WeddingConfigSchema } from "@/lib/schema";
import { I18nProvider } from "@/lib/i18n";
import { WeddingExperience } from "@/components/wedding-experience";
import { BismillahSection } from "@/components/sections/bismillah";
import { NamesSection } from "@/components/sections/names";
import { DateCard, TimeCard } from "@/components/sections/detail-cards";
import { StoryTimeline } from "@/components/sections/story-timeline";
import { ProgramSection } from "@/components/sections/program";
import { ClosingSection } from "@/components/sections/closing";
import { ContactStudio } from "@/components/sections/contact-studio";
import { CouplePhoto } from "@/components/sections/couple-photo";
import { Venue } from "@/components/sections/venue";
import { LandingHero } from "@/components/sections/landing-hero";
import { Countdown } from "@/components/countdown";
import { CalendarAndDirections } from "@/components/calendar-button";
import { RsvpForm } from "@/components/rsvp-form";
import { Guestbook } from "@/components/guestbook";
import { Gallery } from "@/components/gallery";
import { Ornament } from "@/components/ornament";
import { Reveal } from "@/components/reveal";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { ScrollFlowers } from "@/components/scroll-flowers";
import { LandingGate } from "@/components/landing-gate";
import type { Lang } from "@/lib/schema";

const LANGS: Lang[] = ["fr", "ar", "en"];

async function getConfig(slug: string) {
  const [order] = await db
    .select({ configLive: orders.configLive, status: orders.status })
    .from(orders)
    .where(eq(orders.slug, slug))
    .limit(1);

  if (!order) return null;
  if (order.status !== "live") return null;
  if (!order.configLive) return null;

  const parsed = WeddingConfigSchema.safeParse(order.configLive);
  if (!parsed.success) return null;
  return parsed.data;
}

export default async function SlugPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const config = await getConfig(slug);
  if (!config) notFound();

  const lbl = config.i18n.labels;
  const skipIntro = (await searchParams).preview === "1";

  return (
    <I18nProvider config={config}>
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
      <LandingGate>
      <main className="relative z-[3]">
        <LandingHero />
        <div
          className="stage relative"
          style={{
            background:
              "linear-gradient(180deg, #fbf8f0 0%, var(--cream) 40%, #f4eedd 100%)",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1680' height='1050' viewBox='0 0 1680 1050' preserveAspectRatio='xMidYMid slice'%3E%3Crect width='1680' height='1050' fill='%23f7f1e6'/%3E%3Cpath d='M0,1050 V470 C300,430 560,560 900,640 C1180,705 1430,690 1680,640 V1050 Z' fill='%23f1e8d6'/%3E%3Cpath d='M0,1050 V560 C320,520 600,640 940,710 C1220,768 1450,758 1680,720 V1050 Z' fill='%23ece1cc'/%3E%3Cpath d='M0,1050 V660 C360,628 660,728 1000,788 C1260,834 1470,828 1680,800 V1050 Z' fill='%23e6dac1'/%3E%3Cpath d='M0,1050 V770 C400,742 720,824 1060,872 C1300,906 1500,902 1680,884 V1050 Z' fill='%23e0d2b4'/%3E%3Cpath d='M0,1050 V880 C440,858 780,918 1120,952 C1360,976 1520,974 1680,962 V1050 Z' fill='%23dccbaa'/%3E%3C/svg%3E\")",
              backgroundSize: "cover",
              backgroundPosition: "center bottom",
              backgroundRepeat: "no-repeat",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background:
                "radial-gradient(circle at 18% 8%, rgba(201,164,76,.10), transparent 42%), radial-gradient(circle at 82% 92%, rgba(201,164,76,.10), transparent 42%)",
            }}
          />
          <ScrollFlowers />
          <div className="relative z-[1]">
          <div className="frame relative mx-auto max-w-[720px] px-5 sm:px-7 pt-[70px] pb-[90px] text-center">
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

            <DateCard config={config} />
            <Venue config={config} />
            <TimeCard config={config} />

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
            <Ornament />
            <ContactStudio config={config} />
          </div>
          </div>
        </div>
      </main>
      </LandingGate>
      </SmoothScrollProvider>
    </I18nProvider>
  );
}
