import type { Metadata } from "next";
import Link from "next/link";
import { stripe } from "@/lib/stripe";
import PageTransition from "@/components/PageTransition";
import SuccessClearCart from "./SuccessClearCart";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Thank You",
};

interface Props {
  searchParams: { session_id?: string };
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const sessionId = searchParams?.session_id;
  let email: string | null = null;
  let total: number | null = null;

  if (sessionId && stripe) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      email = session.customer_details?.email ?? null;
      total = typeof session.amount_total === "number"
        ? session.amount_total / 100
        : null;
    } catch {
      // ignore — show generic thank-you
    }
  }

  return (
    <PageTransition>
      <SuccessClearCart />
      <section className="py-24 md:py-32">
        <div className="max-w-xl mx-auto px-6 text-center">
          <p className="text-[11px] tracking-[0.3em] uppercase text-accent mb-4">
            Order Confirmed
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal tracking-wide mb-6">
            Thank you for your order
          </h1>
          <p className="text-sm text-charcoal/60 leading-relaxed mb-8">
            {email
              ? `A confirmation has been sent to ${email}.`
              : "A confirmation has been sent to your email."}
            {" "}Each print is packed by hand and shipped from the studio.
          </p>
          {typeof total === "number" && (
            <p className="font-serif text-2xl text-charcoal mb-8">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(total)}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/prints"
              className="px-10 py-3.5 border border-charcoal/20 text-charcoal text-xs tracking-widest uppercase hover:bg-charcoal/5 transition-colors"
            >
              Keep Browsing
            </Link>
            <Link
              href="/"
              className="px-10 py-3.5 bg-charcoal text-cream text-xs tracking-widest uppercase hover:bg-charcoal/85 transition-colors"
            >
              Back Home
            </Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
