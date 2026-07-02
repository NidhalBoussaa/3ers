import Link from "next/link";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-cream text-ink">
      <div className="mx-auto max-w-2xl px-6 py-20">
        <Link
          href="/"
          className="font-cinzel text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-deep transition-colors hover:text-gold"
        >
          ← Retour &agrave; l&rsquo;atelier
        </Link>
        <article className="prose-legal mt-12 flex flex-col gap-6 font-body text-[1.1rem] leading-relaxed text-ink-soft [&_h1]:font-body [&_h1]:text-[2.2rem] [&_h1]:leading-tight [&_h1]:text-ink [&_h2]:mt-4 [&_h2]:font-cinzel [&_h2]:text-[0.95rem] [&_h2]:font-semibold [&_h2]:uppercase [&_h2]:tracking-[0.22em] [&_h2]:text-ink">
          {children}
        </article>
      </div>
    </div>
  );
}
