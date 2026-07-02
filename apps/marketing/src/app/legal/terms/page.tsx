import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions — 3ers",
  robots: { index: false },
};

// TODO: have this reviewed before launch; it is a faithful summary of current
// practice, not legal advice.
export default function TermsPage() {
  return (
    <>
      <h1>Conditions de service</h1>
      <p>
        3ers con&ccedil;oit et h&eacute;berge des invitations de mariage
        num&eacute;riques personnalis&eacute;es, livr&eacute;es sous la forme
        d&rsquo;un lien unique.
      </p>
      <h2>Commande et paiement</h2>
      <p>
        Votre demande est gratuite et sans engagement. Le paiement
        n&rsquo;intervient qu&rsquo;apr&egrave;s validation de votre aper&ccedil;u,
        selon la formule choisie (Essentiel 149&nbsp;&euro;, Prestige
        249&nbsp;&euro;). Les retouches incluses d&eacute;pendent de la formule.
      </p>
      <h2>D&eacute;lais</h2>
      <p>
        Les d&eacute;lais courent &agrave; partir de la r&eacute;ception de vos
        contenus complets : cinq jours pour Essentiel, 48 heures pour Prestige.
      </p>
      <h2>Contenus</h2>
      <p>
        Vous garantissez d&eacute;tenir les droits des photos, textes et musiques
        que vous nous confiez. Ils restent votre propri&eacute;t&eacute; ; nous ne
        les utilisons pas &agrave; des fins de d&eacute;monstration sans votre
        accord &eacute;crit.
      </p>
      <h2>Disponibilit&eacute;</h2>
      <p>
        L&rsquo;invitation reste en ligne au minimum six mois apr&egrave;s la date
        du mariage, puis est archiv&eacute;e. Une prolongation est possible sur
        simple demande.
      </p>
    </>
  );
}
