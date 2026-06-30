"use client";
import { useI18n } from "@/lib/i18n";

/**
 * Fixed gold ticker pinned to the top of the page — a luxe "announcement bar".
 * Looping Arabic phrases scroll continuously; pauses on hover, freezes for
 * reduced-motion. Appears once the envelope intro is done.
 */
export function MarqueeBar() {
  const { introDone } = useI18n();

  const phrases = [
    "أهلاً بكم في حفل زفافنا",
    "فهمي ❤ إسميرالدا · ١٣ سبتمبر ٢٠٢٦",
    "على بركة الله نبدأ",
    "احفظوا التاريخ",
    "بإذن الله تعالى",
  ];

  // one run of the phrases, joined by a gold star separator
  const run = (
    <span className="inline-flex items-center">
      {phrases.map((p, i) => (
        <span key={i} className="inline-flex items-center">
          <span className="font-amiri text-[13px] sm:text-sm tracking-wide text-gold-deep px-5">
            {p}
          </span>
          <span aria-hidden className="text-gold/70 text-[10px]">
            ✦
          </span>
        </span>
      ))}
    </span>
  );

  return (
    <div
      dir="rtl"
      aria-label="أهلاً بكم"
      className={`marquee fixed inset-x-0 top-0 z-50 border-b border-white/40 bg-cream/35 backdrop-blur-xl backdrop-saturate-150 shadow-[0_8px_30px_-12px_rgba(110,84,30,.25)] transition-[opacity,transform] duration-700 ${
        introDone ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
      }`}
      style={{
        paddingTop: "var(--safe-top)",
        WebkitBackdropFilter: "blur(20px) saturate(1.5)",
      }}
    >
      {/* glassy top highlight — a thin sheen along the upper edge */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/70 to-transparent"
      />
      <div className="relative py-2">
        {/* soft fade on both edges — lighter so the frosted glass shows through */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-linear-to-r from-cream/55 to-transparent"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-cream/55 to-transparent"
        />
        {/* track is the run twice over so the -50% loop is seamless */}
        <div className="marquee__track">
          {run}
          {run}
        </div>
      </div>
    </div>
  );
}
