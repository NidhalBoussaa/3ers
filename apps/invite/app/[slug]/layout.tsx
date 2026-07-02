import type { Metadata } from "next";
import { db } from "@3ers/db/client";
import { orders } from "@3ers/db/schema";
import { eq } from "drizzle-orm";
import { WeddingConfigSchema, pick } from "@/lib/schema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [order] = await db
    .select({ configLive: orders.configLive, status: orders.status })
    .from(orders)
    .where(eq(orders.slug, slug))
    .limit(1);

  if (!order?.configLive || order.status !== "live") return { title: "Invitation de mariage — 3ers" };

  const parsed = WeddingConfigSchema.safeParse(order.configLive);
  if (!parsed.success) return { title: "Invitation de mariage — 3ers" };

  const config = parsed.data;
  const title = `${config.couple.groom.first} & ${config.couple.bride.first} — Invitation de mariage`;

  return {
    title,
    description: pick(config.i18n.labels.inviteLead, "fr"),
    openGraph: {
      title,
      description: `${pick(config.date.display, "fr")} · ${pick(config.venue.name, "fr")}`,
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default function SlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
