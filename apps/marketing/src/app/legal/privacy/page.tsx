import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confidentialité — 3ers",
  robots: { index: false },
};

// TODO: have this reviewed before launch; it is a faithful summary of current
// practice, not legal advice.
export default function PrivacyPage() {
  return (
    <>
      <h1>Confidentialit&eacute;</h1>
      <p>
        3ers collecte le strict n&eacute;cessaire pour cr&eacute;er et livrer votre
        invitation : vos pr&eacute;noms, votre date de mariage, votre langue, votre
        adresse email et les contenus que vous nous confiez (photos, textes,
        musique).
      </p>
      <h2>R&eacute;ponses de vos invit&eacute;s</h2>
      <p>
        Les r&eacute;ponses RSVP et les mots du livre d&rsquo;or sont visibles
        uniquement par vous, depuis votre espace priv&eacute;. Ils ne sont ni
        partag&eacute;s, ni revendus, ni utilis&eacute;s &agrave; d&rsquo;autres fins.
        Sur demande, nous les supprimons apr&egrave;s le mariage.
      </p>
      <h2>H&eacute;bergement et dur&eacute;e</h2>
      <p>
        Vos donn&eacute;es sont h&eacute;berg&eacute;es sur des serveurs
        s&eacute;curis&eacute;s et conserv&eacute;es le temps de la prestation, puis
        supprim&eacute;es ou anonymis&eacute;es. Aucun outil publicitaire ne traque vos
        invit&eacute;s sur l&rsquo;invitation.
      </p>
      <h2>Vos droits</h2>
      <p>
        Vous pouvez demander l&rsquo;acc&egrave;s, la correction ou la suppression de
        vos donn&eacute;es &agrave; tout moment en nous &eacute;crivant. Nous
        r&eacute;pondons sous 72 heures.
      </p>
    </>
  );
}
