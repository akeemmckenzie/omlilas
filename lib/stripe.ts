import Stripe from "stripe";

const secret = process.env.STRIPE_SECRET_KEY;

if (!secret) {
  // eslint-disable-next-line no-console
  console.warn(
    "[stripe] STRIPE_SECRET_KEY is not set — checkout and webhook routes will fail until it is configured.",
  );
}

export const stripe = secret
  ? new Stripe(secret, {
      apiVersion: "2026-04-22.dahlia",
    })
  : null;
