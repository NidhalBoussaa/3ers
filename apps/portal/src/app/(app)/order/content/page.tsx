export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { getClientOrder, type SchemaField } from "@/lib/order";
import { ContentForm } from "./content-form";
import { Ornament } from "@/components/ornament";

export default async function ContentPage() {
  const session = await auth();
  if (!session) return null;

  const order = await getClientOrder(session.user.id);
  if (!order) return null;

  const schema = ((order.templateSchema ?? []) as SchemaField[]).filter((f) => !f.adminOnly);
  const draft = (order.configDraft ?? {}) as Record<string, string>;
  const live = (order.configLive ?? {}) as Record<string, string>;
  const canEdit = ["in_review", "config_sent"].includes(order.status);

  return (
    <div className="flex flex-col gap-7">
      <header>
        <p className="lbl mb-2 text-[10px] text-gold-deep">Vos informations</p>
        <h1 className="font-body text-[clamp(1.7rem,4.5vw,2.4rem)] leading-tight text-ink">
          Le contenu de votre invitation
        </h1>
        <p className="mt-3 max-w-prose font-body text-[1.1rem] leading-relaxed text-ink-soft">
          Renseignez vos détails ; nous les mettons en scène. Chaque modification est
          revue par l&rsquo;atelier avant d&rsquo;être publiée.
        </p>
      </header>

      {schema.length === 0 ? (
        <div className="card p-10 text-center">
          <Ornament className="mb-5" />
          <p className="font-body text-[1.12rem] italic text-ink-soft">
            Le formulaire s&rsquo;ouvrira ici dès que votre modèle sera assigné par
            l&rsquo;atelier.
          </p>
        </div>
      ) : (
        <ContentForm
          orderId={order.id}
          schema={schema}
          draft={draft}
          live={live}
          canEdit={canEdit}
        />
      )}
    </div>
  );
}
