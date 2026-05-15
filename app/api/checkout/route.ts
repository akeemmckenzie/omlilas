import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { client } from "@/sanity/client";
import { artworksByIdsQuery, siteSettingsQuery } from "@/sanity/queries";

export const runtime = "nodejs";

interface IncomingItem {
  artworkId: string;
  variant: "signed" | "unsigned";
  quantity: number;
}

interface SanityArtworkRow {
  _id: string;
  title: string;
  slug: string;
  hasSignedPrint?: boolean;
  signedPrice?: number;
  signedStock?: number;
  hasUnsignedPrint?: boolean;
  unsignedPrice?: number;
  imageUrl?: string;
}

interface SanitySettingsRow {
  usShippingRate?: number;
  intlShippingRate?: number;
}

function originFromRequest(req: NextRequest): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  return req.nextUrl.origin;
}

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured on this server." },
      { status: 500 },
    );
  }
  if (!client) {
    return NextResponse.json(
      { error: "Sanity is not configured on this server." },
      { status: 500 },
    );
  }

  let body: { items?: IncomingItem[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  // Normalize & validate shape
  const cleanItems: IncomingItem[] = [];
  for (const i of items) {
    if (!i || typeof i.artworkId !== "string") {
      return NextResponse.json({ error: "Invalid item" }, { status: 400 });
    }
    if (i.variant !== "signed" && i.variant !== "unsigned") {
      return NextResponse.json(
        { error: "Originals cannot be purchased online" },
        { status: 400 },
      );
    }
    const qty = Math.floor(Number(i.quantity));
    if (!Number.isFinite(qty) || qty < 1) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }
    cleanItems.push({ artworkId: i.artworkId, variant: i.variant, quantity: qty });
  }

  const ids = Array.from(new Set(cleanItems.map((i) => i.artworkId)));

  let rows: SanityArtworkRow[] = [];
  let settings: SanitySettingsRow | null = null;
  try {
    [rows, settings] = await Promise.all([
      client.fetch<SanityArtworkRow[]>(artworksByIdsQuery, { ids }),
      client.fetch<SanitySettingsRow | null>(siteSettingsQuery),
    ]);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("[checkout] sanity fetch failed", e);
    return NextResponse.json(
      { error: "Could not validate cart" },
      { status: 500 },
    );
  }

  type LineItem = NonNullable<
    Stripe.Checkout.SessionCreateParams["line_items"]
  >[number];
  type ShippingOption = NonNullable<
    Stripe.Checkout.SessionCreateParams["shipping_options"]
  >[number];

  const byId = new Map(rows.map((r) => [r._id, r]));
  const lineItems: LineItem[] = [];
  const metadataItems: Array<{
    artworkId: string;
    variant: "signed" | "unsigned";
    quantity: number;
    title: string;
    unitPrice: number;
  }> = [];

  for (const i of cleanItems) {
    const row = byId.get(i.artworkId);
    if (!row) {
      return NextResponse.json(
        { error: `Artwork no longer available` },
        { status: 400 },
      );
    }

    let unitPrice: number | undefined;
    if (i.variant === "signed") {
      if (!row.hasSignedPrint) {
        return NextResponse.json(
          { error: `${row.title}: signed print is no longer available` },
          { status: 400 },
        );
      }
      unitPrice = row.signedPrice;
      const stock = typeof row.signedStock === "number" ? row.signedStock : 0;
      if (stock < i.quantity) {
        return NextResponse.json(
          {
            error:
              stock === 0
                ? `${row.title}: signed print is sold out`
                : `${row.title}: only ${stock} signed print${stock === 1 ? "" : "s"} remaining`,
          },
          { status: 400 },
        );
      }
    } else {
      if (!row.hasUnsignedPrint) {
        return NextResponse.json(
          { error: `${row.title}: unsigned print is no longer available` },
          { status: 400 },
        );
      }
      unitPrice = row.unsignedPrice;
    }

    if (typeof unitPrice !== "number" || unitPrice <= 0) {
      return NextResponse.json(
        { error: `${row.title}: pricing unavailable` },
        { status: 400 },
      );
    }

    const variantLabel = i.variant === "signed" ? "Signed Print" : "Unsigned Print";
    lineItems.push({
      quantity: i.quantity,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(unitPrice * 100),
        tax_behavior: "exclusive",
        product_data: {
          name: `${row.title} — ${variantLabel}`,
          images: row.imageUrl ? [row.imageUrl] : undefined,
          metadata: {
            artworkId: row._id,
            variant: i.variant,
            slug: row.slug,
          },
          tax_code: "txcd_99999999",
        },
      },
    });

    metadataItems.push({
      artworkId: row._id,
      variant: i.variant,
      quantity: i.quantity,
      title: row.title,
      unitPrice,
    });
  }

  const origin = originFromRequest(req);
  const usShipping = Math.round(((settings?.usShippingRate ?? 15) as number) * 100);

  const shippingOptions: ShippingOption[] = [
    {
      shipping_rate_data: {
        type: "fixed_amount",
        display_name: "US Shipping",
        fixed_amount: { amount: usShipping, currency: "usd" },
        tax_behavior: "exclusive",
        tax_code: "txcd_92010001",
        delivery_estimate: {
          minimum: { unit: "business_day", value: 3 },
          maximum: { unit: "business_day", value: 7 },
        },
      },
    },
  ];

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      automatic_tax: { enabled: true },
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      shipping_options: shippingOptions,
      phone_number_collection: { enabled: false },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      metadata: {
        items: JSON.stringify(metadataItems),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("[checkout] stripe session create failed", e);
    const message =
      e instanceof Error ? e.message : "Could not create checkout session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
