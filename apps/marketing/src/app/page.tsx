import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { MarqueeBand } from "@/components/marquee-band";
import { LiveReel } from "@/components/live-reel";
import { StageTransition } from "@/components/stage-transition";
import { Acts } from "@/components/acts";
import { Steps } from "@/components/steps";
import { Pricing } from "@/components/pricing";
import { Quote } from "@/components/quote";
import { Faq } from "@/components/faq";
import { RequestForm } from "@/components/request-form";
import { Footer } from "@/components/footer";
import { Ornament } from "@/components/ornament";

/**
 * The landing page follows the invitation's own arc: a night entrance, a warm
 * cream stage framed by gold rails, and a return to night for the commission.
 */
export default function Home() {
  return (
    <SmoothScrollProvider>
      <Nav />
      <main>
        {/* ── Night: the entrance ── */}
        <Hero />
        <MarqueeBand />
        <LiveReel />

        {/* ── The stage opens ── */}
        <StageTransition direction="to-cream" />
        <div className="stage-rails relative">
          <Acts />
          <Steps />
          <div className="bg-cream pb-10">
            <Ornament />
          </div>
          <Pricing />
          <Quote />
          <Faq />
        </div>
        <StageTransition direction="to-night" />

        {/* ── Night again: the commission ── */}
        <RequestForm />
      </main>
      <Footer />
    </SmoothScrollProvider>
  );
}
