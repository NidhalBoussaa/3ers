export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { getClientOrder, getPhotos } from "@/lib/order";
import { PhotoManager } from "./photo-manager";

export default async function PhotosPage() {
  const session = await auth();
  if (!session) return null;

  const order = await getClientOrder(session.user.id);
  if (!order) return null;

  const photos = await getPhotos(order.id);

  return (
    <div className="flex flex-col gap-7">
      <header>
        <p className="lbl mb-2 text-[10px] text-gold-deep">Vos photos</p>
        <h1 className="font-body text-[clamp(1.7rem,4.5vw,2.4rem)] leading-tight text-ink">
          Les images de votre soirée
        </h1>
        <p className="mt-3 max-w-prose font-body text-[1.1rem] leading-relaxed text-ink-soft">
          Confiez-nous vos plus belles photos : couple, lieu, ambiance. Nous les mettons
          en scène dans votre invitation. JPG, PNG ou WebP, 20&nbsp;Mo maximum par image.
        </p>
      </header>

      <PhotoManager orderId={order.id} initial={photos} />
    </div>
  );
}
