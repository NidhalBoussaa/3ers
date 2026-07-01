import type { WeddingConfig } from "@/lib/schema";
import { Reveal } from "@/components/reveal";
import { LuxeCard } from "@/components/luxe-card";

/**
 * Closing "build your own wedding invitation" block — the studio's call to
 * action plus its contact channels (Instagram / email). Arabic, RTL,
 * couture corner-bracket card. Sits at the very bottom of the page.
 */
export function ContactStudio({ config }: { config: WeddingConfig }) {
  const s = config.studio;
  // instagram may be stored as a full URL or a bare @handle — normalise both.
  const igHandle = s.instagram
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/\/+$/, "")
    .replace(/^@/, "");
  const igUrl = `https://instagram.com/${igHandle}`;

  return (
    <section dir="rtl" className="mt-10">
      <Reveal variant="rise">
        <div className="font-amiri text-base tracking-[2px] text-gold-deep/80 mb-2">
          تواصلوا معنا
        </div>
      </Reveal>

      <Reveal variant="bloom" delay={1}>
        <LuxeCard className="mx-auto max-w-md text-center">
          <div className="font-vibes text-gold-deep leading-tight text-[clamp(26px,7vw,38px)]">
            {s.tagline.ar}
          </div>
          <p className="font-amiri text-base text-[#4a3e2c] mt-2 leading-relaxed">
            نصمّم لكم دعوات زفاف رقمية فاخرة، مصمّمة خصيصاً لمناسبتكم.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <ContactRow
              href={igUrl}
              label="إنستغرام"
              value={`@${igHandle}`}
              icon={<Instagram />}
            />
            <ContactRow
              href={`mailto:${s.email}`}
              label="البريد الإلكتروني"
              value={s.email}
              icon={<Mail />}
            />
          </div>

          <a
            href={igUrl}
            target="_blank"
            rel="noopener"
            className="btn-gold mt-7 justify-center"
          >
            صمّم دعوتك الآن
          </a>
        </LuxeCard>
      </Reveal>
    </section>
  );
}

function ContactRow({
  href,
  label,
  value,
  icon,
}: {
  href: string;
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className="group/row flex items-center gap-3 rounded-none px-2 py-2 transition-colors hover:bg-gold/5"
    >
      <span className="grid size-10 flex-none place-items-center rounded-full bg-linear-to-b from-[#fbf4e2] to-[#f1e6c9] text-gold-deep ring-1 ring-gold/40 transition-transform duration-300 group-hover/row:scale-105">
        {icon}
      </span>
      <span className="flex flex-col text-start">
        <span className="font-amiri text-sm text-gold-deep/80">{label}</span>
        <span className="font-amiri text-base text-[#3a3020]" dir="ltr">
          {value}
        </span>
      </span>
    </a>
  );
}

function Instagram() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth={1.5} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" className="fill-current" />
    </svg>
  );
}
function Mail() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth={1.5} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
