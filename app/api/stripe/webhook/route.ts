import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { writeClient } from "@/sanity/writeClient";
import {
  buildOrderDoc,
  isSessionPaid,
  itemsFromLineItems,
  orderDocId,
  stockDecrements,
} from "@/lib/stripeOrder";

export const runtime = "nodejs";
// Webhook signature verification needs the raw body; never parse upstream.
export const dynamic = "force-dynamic";

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
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (!isSessionPaid(session)) {
          // Delayed payment method (e.g. bank debit): wait for
          // checkout.session.async_payment_succeeded before fulfilling.
          // eslint-disable-next-line no-console
          console.info(
            `[stripe webhook] session ${session.id} not paid yet (${session.payment_status}); waiting`,
          );
          break;
        }
        await fulfillSession(stripe, session);
        break;
      }
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        // eslint-disable-next-line no-console
        console.warn(
          `[stripe webhook] async payment failed for session ${session.id}; no order created`,
        );
        break;
      }
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("[stripe webhook] handler error", e);
    // Return 500 so Stripe retries
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function fulfillSession(
  stripeClient: Stripe,
  session: Stripe.Checkout.Session,
) {
  if (!writeClient) {
    // Throw (→ 500) so Stripe keeps retrying until the token is configured,
    // instead of acknowledging the event and losing the order.
    throw new Error(
      "Sanity write client unavailable (SANITY_API_TOKEN missing) — cannot record order",
    );
  }

  const docId = orderDocId(session.id);

  // Fast path: already recorded (deterministic ID, or a legacy random-ID
  // order created before this handler used deterministic IDs).
  const existing = await writeClient.fetch<string | null>(
    `*[_type == "order" && (_id == $id || stripeSessionId == $sid)][0]._id`,
    { id: docId, sid: session.id },
  );
  if (existing) return;

  const lineItems = await stripeClient.checkout.sessions
    .listLineItems(session.id, { limit: 100, expand: ["data.price.product"] })
    .autoPagingToArray({ limit: 1000 });

  const items = itemsFromLineItems(lineItems);
  if (items.length === 0 && lineItems.length > 0) {
    throw new Error(
      `Session ${session.id}: line items carried no artwork metadata`,
    );
  }

  // Only patch artworks that still exist; a patch on a missing document
  // would fail the whole transaction and block the order forever.
  const decrements = stockDecrements(items);
  const artworkIds = Array.from(new Set(decrements.map((d) => d.artworkId)));
  const existingIds = artworkIds.length
    ? await writeClient.fetch<string[]>(`*[_id in $ids]._id`, {
        ids: artworkIds,
      })
    : [];
  const existingSet = new Set(existingIds);

  const tx = writeClient.transaction().create(buildOrderDoc(session, items));
  for (const d of decrements) {
    if (!existingSet.has(d.artworkId)) {
      // eslint-disable-next-line no-console
      console.warn(
        `[stripe webhook] artwork ${d.artworkId} no longer exists; skipping stock decrement`,
      );
      continue;
    }
    tx.patch(d.artworkId, { dec: { [d.path]: d.amount } });
  }

  try {
    // Atomic: the order and every stock decrement land together or not at
    // all. A duplicate delivery fails on the existing order ID, so stock is
    // never decremented twice.
    await tx.commit();
  } catch (e) {
    if (isConflict(e)) return; // processed concurrently by another delivery
    throw e;
  }
}

function isConflict(e: unknown): boolean {
  const err = e as { statusCode?: number; message?: string } | null;
  return (
    err?.statusCode === 409 ||
    /already exists/i.test(err?.message ?? "")
  );
}
