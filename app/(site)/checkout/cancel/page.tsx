import type { Metadata } from "next";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "Checkout Cancelled",
};

export default function CheckoutCancelPage() {
  return (
    <PageTransition>
      <section className="py-24 md:py-32">
        <div className="max-w-xl mx-auto px-6 text-center">
          <p className="text-[11px] tracking-[0.3em] uppercase text-charcoal/50 mb-4">
            Checkout Cancelled
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal tracking-wide mb-6">
            No charge was made
          </h1>
          <p className="text-sm text-charcoal/60 leading-relaxed mb-8">
            Your cart is still here whenever you&rsquo;re ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/cart"
              className="px-10 py-3.5 bg-charcoal text-cream text-xs tracking-widest uppercase hover:bg-charcoal/85 transition-colors"
            >
              Back to Cart
            </Link>
            <Link
              href="/prints"
              className="px-10 py-3.5 border border-charcoal/20 text-charcoal text-xs tracking-widest uppercase hover:bg-charcoal/5 transition-colors"
            >
              Keep Browsing
            </Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
