import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { writeClient } from "@/sanity/writeClient";

export const runtime = "nodejs";
// Webhook signature verification needs the raw body; never parse upstream.
export const dynamic = "force-dynamic";

interface OrderItemMetadata {
  artworkId: string;
  variant: "signed" | "unsigned";
  quantity: number;
  title: string;
  unitPrice: number;
}

function shortOrderNumber(id: string): string {
  return id.replace(/[^A-Za-z0-9]/g, "").slice(-8).toUpperCase();
}

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET is not set" },
      { status: 500 },
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("[stripe webhook] signature verification failed", e);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("[stripe webhook] handler error", e);
    // Return 500 so Stripe retries
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (!writeClient) {
    // eslint-disable-next-line no-console
    console.error(
      "[stripe webhook] Sanity write client unavailable — cannot record order or decrement stock",
    );
    return;
  }

  const sessionId = session.id;

  // Idempotency: don't double-process the same session.
  const existing = await writeClient.fetch<string | null>(
    `*[_type == "order" && stripeSessionId == $sid][0]._id`,
    { sid: sessionId },
  );
  if (existing) return;

  let items: OrderItemMetadata[] = [];
  try {
    items = JSON.parse(session.metadata?.items || "[]");
  } catch {
    items = [];
  }

  // Decrement signed stock for each signed-print line, atomically per artwork.
  for (const it of items) {
    if (it.variant !== "signed") continue;
    try {
      await writeClient
        .patch(it.artworkId)
        .dec({ signedStock: it.quantity })
        .commit();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(
        `[stripe webhook] failed to decrement stock for ${it.artworkId}`,
        e,
      );
    }
  }

  const shipping = session.shipping_cost?.amount_total ?? 0;
  const tax = session.total_details?.amount_tax ?? 0;
  const subtotal = (session.amount_subtotal ?? 0) - 0; // amount_subtotal excludes tax & shipping
  const total = session.amount_total ?? 0;

  const customerDetails = session.customer_details;
  const shippingAddr =
    (
      session as unknown as {
        shipping_details?: {
          address?: Stripe.Address;
          name?: string;
        };
      }
    ).shipping_details?.address ?? customerDetails?.address ?? null;

  const orderDoc = {
    _type: "order",
    orderNumber: shortOrderNumber(sessionId),
    status: "paid",
    placedAt: new Date(session.created * 1000).toISOString(),
    subtotal: subtotal / 100,
    shipping: shipping / 100,
    tax: tax / 100,
    total: total / 100,
    currency: (session.currency ?? "usd").toLowerCase(),
    customerEmail: customerDetails?.email ?? undefined,
    customerName: customerDetails?.name ?? undefined,
    shippingAddress: shippingAddr
      ? {
          line1: shippingAddr.line1 ?? undefined,
          line2: shippingAddr.line2 ?? undefined,
          city: shippingAddr.city ?? undefined,
          state: shippingAddr.state ?? undefined,
          postalCode: shippingAddr.postal_code ?? undefined,
          country: shippingAddr.country ?? undefined,
        }
      : undefined,
    items: items.map((it) => ({
      _type: "orderItem",
      _key: `${it.artworkId}-${it.variant}`,
      artwork: { _type: "reference", _ref: it.artworkId },
      title: it.title,
      variant: it.variant,
      quantity: it.quantity,
      unitPrice: it.unitPrice,
    })),
    stripeSessionId: sessionId,
    stripePaymentIntentId:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id,
  };

  try {
    await writeClient.create(orderDoc);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("[stripe webhook] failed to create order doc", e);
  }
}
