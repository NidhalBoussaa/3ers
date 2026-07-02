import { Reveal } from "@/components/reveal";

const ITEMS = [
  {
    q: "Combien de temps faut-il ?",
    a: "Cinq jours pour Essentiel, 48 heures pour Prestige, à partir du moment où nous avons vos textes et vos photos. Pour les demandes urgentes, écrivez-nous : l'atelier sait coudre vite.",
  },
  {
    q: "Dans quelles langues l'invitation existe-t-elle ?",
    a: "Français, arabe et anglais. L'arabe est composé dans une vraie typographie arabe, de droite à gauche ; jamais une traduction plaquée sur une maquette latine.",
  },
  {
    q: "Où vont les réponses de mes invités ?",
    a: "Dans votre espace privé, visibles en temps réel. Elles ne sont ni partagées ni revendues, et nous les effaçons après le mariage si vous le souhaitez.",
  },
  {
    q: "Que se passe-t-il après ma demande ?",
    a: "Nous vous écrivons sous 24 heures avec un aperçu à vos noms. Vous ajustez, vous validez, puis votre lien part en ligne. Le paiement n'intervient qu'à la validation.",
  },
  {
    q: "Peut-on utiliser nos propres photos et notre musique ?",
    a: "Oui, et c'est même le principe : vos photos, votre musique, vos mots. Nous les mettons en scène ; rien n'est générique.",
  },
  {
    q: "Comment mes invités reçoivent-ils l'invitation ?",
    a: "Par un seul lien, à envoyer sur WhatsApp ou ailleurs. Pas d'application à installer, pas de compte à créer : le lien s'ouvre, la soirée commence.",
  },
];

export function Faq() {
  return (
    <section id="questions" className="scroll-mt-20 bg-cream py-28 md:py-36">
      <div className="mx-auto max-w-2xl px-6">
        <Reveal variant="rise" className="text-center">
          <h2 className="font-body text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.12] text-ink">
            Vos <em className="text-gold-deep">questions</em>
          </h2>
        </Reveal>

        <Reveal variant="lines" stagger className="mt-16">
          {ITEMS.map((item) => (
            <details key={item.q} className="faq-item group border-b border-gold/25 py-2 first:border-t">
              <summary className="flex items-center justify-between gap-6 py-5">
                <span className="font-body text-[1.28rem] font-medium leading-snug text-ink">
                  {item.q}
                </span>
                <svg
                  viewBox="0 0 16 16"
                  className="faq-cross h-3.5 w-3.5 shrink-0 stroke-gold-deep"
                  strokeWidth="1.4"
                  aria-hidden="true"
                >
                  <line x1="8" y1="0" x2="8" y2="16" />
                  <line x1="0" y1="8" x2="16" y2="8" />
                </svg>
              </summary>
              <div className="faq-body">
                <div>
                  <p className="max-w-[60ch] pb-6 font-body text-[1.12rem] leading-relaxed text-ink-soft">
                    {item.a}
                  </p>
                </div>
              </div>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
