import type { Metadata } from "next";
import PageTransition from "@/components/PageTransition";
import CartPageContent from "./CartPageContent";

export const metadata: Metadata = {
  title: "Cart",
};

export default function CartPage() {
  return (
    <PageTransition>
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="font-serif text-3xl md:text-4xl text-charcoal tracking-wide">
              Your Cart
            </h1>
            <p className="text-sm text-charcoal/50 mt-3">
              Review your prints before checkout.
            </p>
          </div>
          <CartPageContent />
        </div>
      </section>
    </PageTransition>
  );
}
