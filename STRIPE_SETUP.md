# Stripe & Cart Setup

Quick reference for getting the storefront live.

## 1. Env vars

Copy `.env.example` → `.env.local` and fill in:

```
SANITY_API_TOKEN=             # Sanity → Manage → API → Tokens → Editor scope
STRIPE_SECRET_KEY=            # Stripe → Developers → API keys (test or live)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=        # Created in step 3
NEXT_PUBLIC_SITE_URL=         # e.g. https://omlilas.com (used for success/cancel URLs)
```

## 2. Sanity write token

The Stripe webhook decrements `signedStock` and writes `order` documents.
Create a token with **Editor** (or custom read+write) scope at:
Sanity Manage → API → Tokens → "Add API token".

## 3. Stripe webhook

Add an endpoint at Stripe Dashboard → Developers → Webhooks:

- **URL:** `https://YOUR_DOMAIN/api/stripe/webhook`
- **Events:** `checkout.session.completed`
- Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

Local dev: use the Stripe CLI to forward events to localhost.

```
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

The CLI prints a `whsec_…` test secret — use that in `.env.local` while developing.

## 4. Stripe Tax

The checkout session enables `automatic_tax`. Turn Stripe Tax on at
Stripe Dashboard → Tax → Settings → enable the origin address. Without this,
checkout will fail when trying to compute tax.

If she'd rather skip tax for now, open `app/api/checkout/route.ts` and change
`automatic_tax: { enabled: true }` to `false`.

## 5. Shipping rates

Two flat shipping options are presented at checkout: US and International.
The amounts come from Site Settings in Sanity Studio:

- **US Shipping Rate (USD)** — defaults to $15
- **International Shipping Rate (USD)** — defaults to $40

She can edit them in Studio → Site Settings → General.

## 6. Country allow-list

Stripe Checkout requires explicit `allowed_countries` for shipping address
collection. The default list lives in `app/api/checkout/route.ts` and covers
US, Canada, UK, EU, AU, NZ, Japan. Add more codes there if needed
(ISO 3166-1 alpha-2).

## 7. What happens on a sale

1. Customer adds prints to cart and clicks **Checkout**.
2. `POST /api/checkout` re-validates price and signed-print stock against
   Sanity, then creates a Stripe Checkout Session and redirects.
3. Stripe collects payment, address, shipping selection, tax.
4. On success, `POST /api/stripe/webhook` receives `checkout.session.completed`:
   - Decrements `signedStock` on each signed-print line item.
   - Creates an `order` document in Sanity (visible under Studio → Orders).
   - Stripe sends a receipt email automatically.
5. Customer lands on `/checkout/success`, cart clears client-side.

## 8. Originals

Originals are unchanged — no cart, no Stripe. The detail page keeps the
**Inquire** CTA that links to `/contact`.
