import { NextResponse } from "next/server";
import { db, orders, messages } from "@3ers/db";
import { OrderRequestSchema } from "@/lib/order-schema";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = OrderRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  // Honeypot hit: pretend success, write nothing.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  if (!process.env.DATABASE_URL) {
    console.error("POST /api/orders: DATABASE_URL is not configured");
    return NextResponse.json({ ok: false, error: "config" }, { status: 503 });
  }

  const { partner1, partner2, weddingDate, language, tier, email, message } = parsed.data;

  try {
    const [order] = await db
      .insert(orders)
      .values({
        partner1Name: partner1,
        partner2Name: partner2,
        weddingDate,
        language,
        status: "new",
        configDraft: {
          contactEmail: email,
          requestedTier: tier,
          source: "marketing",
        },
      })
      .returning({ id: orders.id });

    if (message && order) {
      await db.insert(messages).values({
        orderId: order.id,
        fromRole: "client",
        body: message,
      });
    }

    // TODO: notify admin via Resend once RESEND_API_KEY is provisioned.
    return NextResponse.json({ ok: true, id: order?.id });
  } catch (err) {
    console.error("POST /api/orders failed:", err);
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }
}
