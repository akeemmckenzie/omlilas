import type Stripe from "stripe";

// Pure helpers for turning a completed Stripe Checkout Session into a Sanity
// `order` document. Kept free of network calls so they can be tested offline.

export interface OrderItem {
  artworkId: string;
  variant: "signed" | "unsigned";
  quantity: number;
  title: string;
  unitPrice: number;
  sizeKey?: string;
  sizeLabel?: string;
}

export interface OrderAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

/**
 * Deterministic Sanity document ID for a session. Creating the order with this
 * ID makes webhook processing idempotent: a second `create` for the same
 * session fails, which aborts the whole transaction (including stock changes).
 */
export function orderDocId(sessionId: string): string {
  return `order-${sessionId.replace(/[^A-Za-z0-9_-]/g, "_")}`;
}

export function shortOrderNumber(id: string): string {
  return id.replace(/[^A-Za-z0-9]/g, "").slice(-8).toUpperCase();
}

/** True once the money has actually been collected. */
export function isSessionPaid(session: Stripe.Checkout.Session): boolean {
  return (
    session.payment_status === "paid" ||
    session.payment_status === "no_payment_required"
  );
}

/**
 * Build order items from the session's line items. Each line item's product
 * carries the artwork metadata set in `/api/checkout`, so this works for carts
 * of any size (session metadata values are capped at 500 characters).
 */
export function itemsFromLineItems(lineItems: Stripe.LineItem[]): OrderItem[] {
  const items: OrderItem[] = [];
  for (const li of lineItems) {
    const product = li.price?.product;
    if (!product || typeof product === "string" || product.deleted) continue;
    const md = product.metadata ?? {};
    if (!md.artworkId) continue;
    if (md.variant !== "signed" && md.variant !== "unsigned") continue;
    const quantity = li.quantity ?? 0;
    if (quantity < 1) continue;
    const unitAmount =
      li.price?.unit_amount ??
      (quantity > 0 ? Math.round(li.amount_subtotal / quantity) : 0);
    items.push({
      artworkId: md.artworkId,
      variant: md.variant,
      quantity,
      title: md.title || product.name,
      unitPrice: unitAmount / 100,
      sizeKey: md.sizeKey || undefined,
      sizeLabel: md.sizeLabel || undefined,
    });
  }
  return items;
}

/**
 * Shipping address lives under `collected_information.shipping_details` on
 * API versions from 2025-03-31.basil onward. Fall back to the billing address
 * only if no shipping address was collected.
 */
export function shippingAddressFromSession(
  session: Stripe.Checkout.Session,
): OrderAddress | null {
  const addr =
    session.collected_information?.shipping_details?.address ??
    session.customer_details?.address ??
    null;
  if (!addr) return null;
  return {
    line1: addr.line1 ?? undefined,
    line2: addr.line2 ?? undefined,
    city: addr.city ?? undefined,
    state: addr.state ?? undefined,
    postalCode: addr.postal_code ?? undefined,
    country: addr.country ?? undefined,
  };
}

export function buildOrderDoc(
  session: Stripe.Checkout.Session,
  items: OrderItem[],
) {
  const shippingName = session.collected_information?.shipping_details?.name;
  const address = shippingAddressFromSession(session);

  // Merge duplicate artwork/variant/size rows so `_key` stays unique.
  const merged = new Map<string, OrderItem>();
  for (const it of items) {
    const key = `${it.artworkId}-${it.variant}-${it.sizeKey ?? "default"}`;
    const prev = merged.get(key);
    if (prev) prev.quantity += it.quantity;
    else merged.set(key, { ...it });
  }

  return {
    _id: orderDocId(session.id),
    _type: "order" as const,
    orderNumber: shortOrderNumber(session.id),
    status: "paid",
    placedAt: new Date(session.created * 1000).toISOString(),
    // amount_subtotal excludes tax & shipping
    subtotal: (session.amount_subtotal ?? 0) / 100,
    shipping: (session.shipping_cost?.amount_total ?? 0) / 100,
    tax: (session.total_details?.amount_tax ?? 0) / 100,
    total: (session.amount_total ?? 0) / 100,
    currency: (session.currency ?? "usd").toLowerCase(),
    customerEmail: session.customer_details?.email ?? undefined,
    customerName:
      shippingName ?? session.customer_details?.name ?? undefined,
    shippingAddress: address ?? undefined,
    items: Array.from(merged.entries()).map(([key, it]) => ({
      _type: "orderItem",
      _key: key.replace(/[^A-Za-z0-9_-]/g, "_"),
      artwork: { _type: "reference", _ref: it.artworkId, _weak: true },
      title: it.title,
      variant: it.variant,
      sizeKey: it.sizeKey,
      sizeLabel: it.sizeLabel,
      quantity: it.quantity,
      unitPrice: it.unitPrice,
    })),
    stripeSessionId: session.id,
    stripePaymentIntentId:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id,
  };
}

/** Stock decrements to apply for an order, merged per artwork + size. */
export function stockDecrements(
  items: OrderItem[],
): Array<{ artworkId: string; path: string; amount: number }> {
  const byPath = new Map<
    string,
    { artworkId: string; path: string; amount: number }
  >();
  for (const it of items) {
    if (it.variant !== "signed") continue;
    const path = it.sizeKey
      ? `signedSizes[_key=="${it.sizeKey.replace(/"/g, "")}"].stock`
      : "signedStock";
    const k = `${it.artworkId}|${path}`;
    const prev = byPath.get(k);
    if (prev) prev.amount += it.quantity;
    else byPath.set(k, { artworkId: it.artworkId, path, amount: it.quantity });
  }
  return Array.from(byPath.values());
}
