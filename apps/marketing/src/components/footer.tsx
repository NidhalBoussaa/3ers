import Link from "next/link";
import { Ornament } from "@/components/ornament";

const NAV = [
  { href: "#experience", label: "L'expérience" },
  { href: "#actes", label: "Les actes" },
  { href: "#formules", label: "Les formules" },
  { href: "#questions", label: "Questions" },
];

export function Footer() {
  return (
    <footer className="border-t border-gold/15 bg-night pb-[max(var(--safe-bot),2.5rem)] pt-16">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-10 px-6 text-center">
        <Ornament />
        <p>
          <span className="gold-text-night font-deco text-4xl font-bold tracking-wide">3ers</span>
          <span className="lbl mt-3 block text-[9px] text-gold-soft/80">
            Atelier d&rsquo;invitations
          </span>
        </p>

        <nav aria-label="Pied de page">
          <ul className="flex flex-wrap items-center justify-center gap-x-9 gap-y-3">
            {NAV.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="font-body text-[1.05rem] italic text-champagne/80 transition-colors duration-300 hover:text-gold-bright"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="https://instagram.com/3ers.tn"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-[1.05rem] italic text-champagne/80 transition-colors duration-300 hover:text-gold-bright"
              >
                Instagram
              </a>
            </li>
          </ul>
        </nav>

        <div className="flex flex-col items-center gap-4 border-t border-gold/15 pt-8 sm:w-full sm:flex-row sm:justify-between">
          <p className="font-cinzel text-[10px] uppercase tracking-[0.3em] text-champagne/60">
            © 2026 3ers · Tunis
          </p>
          <ul className="flex items-center gap-7">
            <li>
              <Link
                href="/legal/privacy"
                className="font-cinzel text-[10px] uppercase tracking-[0.24em] text-champagne/60 transition-colors duration-300 hover:text-gold-soft"
              >
                Confidentialit&eacute;
              </Link>
            </li>
            <li>
              <Link
                href="/legal/terms"
                className="font-cinzel text-[10px] uppercase tracking-[0.24em] text-champagne/60 transition-colors duration-300 hover:text-gold-soft"
              >
                Conditions
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
