export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { getClientOrder, getThread } from "@/lib/order";
import { Thread } from "./thread";

export default async function MessagesPage() {
  const session = await auth();
  if (!session) return null;

  const order = await getClientOrder(session.user.id);
  if (!order) return null;

  const initial = (await getThread(order.id)).map((m) => ({
    id: m.id,
    fromRole: m.fromRole,
    body: m.body,
    createdAt: m.createdAt ? new Date(m.createdAt).toISOString() : null,
  }));

  return (
    <div className="flex flex-col gap-7">
      <header>
        <p className="lbl mb-2 text-[10px] text-gold-deep">L&rsquo;atelier</p>
        <h1 className="font-body text-[clamp(1.7rem,4.5vw,2.4rem)] leading-tight text-ink">
          Votre conversation avec nous
        </h1>
        <p className="mt-3 max-w-prose font-body text-[1.1rem] leading-relaxed text-ink-soft">
          Une question, une correction, une envie particulière ? Écrivez-nous ici. Nous
          répondons vite.
        </p>
      </header>

      <Thread initial={initial} />
    </div>
  );
}
