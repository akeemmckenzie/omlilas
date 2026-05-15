"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";
import { formatPrice } from "@/lib/sanity";
import { VARIANT_LABELS } from "@/lib/artworkVariants";

export default function CartPageContent() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            artworkId: i.artworkId,
            variant: i.variant,
            quantity: i.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data?.error || "Could not start checkout");
      }
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setBusy(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-charcoal/60 mb-8">Your cart is empty.</p>
        <Link
          href="/prints"
          className="inline-block px-10 py-3.5 bg-charcoal text-cream text-xs tracking-widest uppercase hover:bg-charcoal/85 transition-colors"
        >
          Browse Prints
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ul className="divide-y divide-charcoal/10 border-y border-charcoal/10">
        {items.map((item) => (
          <li
            key={`${item.artworkId}:${item.variant}`}
            className="py-6 flex gap-5"
          >
            <div className="relative w-24 h-28 bg-cream-light flex-shrink-0 overflow-hidden">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="flex-1 min-w-0">
              <Link
                href={`/artwork/${item.slug}?v=${item.variant}`}
                className="font-serif text-base text-charcoal hover:text-accent transition-colors"
              >
                {item.title}
              </Link>
              <p className="text-[11px] tracking-[0.15em] uppercase text-charcoal/50 mt-1">
                {VARIANT_LABELS[item.variant]}
              </p>
              {item.edition && (
                <p className="text-xs text-charcoal/50 mt-0.5">{item.edition}</p>
              )}
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center border border-charcoal/15">
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.artworkId,
                        item.variant,
                        item.quantity - 1,
                      )
                    }
                    className="w-8 h-8 flex items-center justify-center text-charcoal/60 hover:text-charcoal hover:bg-charcoal/5 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.artworkId,
                        item.variant,
                        item.quantity + 1,
                      )
                    }
                    className="w-8 h-8 flex items-center justify-center text-charcoal/60 hover:text-charcoal hover:bg-charcoal/5 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={12} />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.artworkId, item.variant)}
                  className="inline-flex items-center gap-1.5 text-xs text-charcoal/50 hover:text-charcoal transition-colors"
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-charcoal">
                {formatPrice(item.unitPrice * item.quantity)}
              </p>
              {item.quantity > 1 && (
                <p className="text-xs text-charcoal/50 mt-1">
                  {formatPrice(item.unitPrice)} each
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-xs tracking-[0.2em] uppercase text-charcoal/60">
            Subtotal
          </span>
          <span className="font-serif text-2xl text-charcoal">
            {formatPrice(subtotal)}
          </span>
        </div>
        <p className="text-xs text-charcoal/50">
          Shipping and taxes calculated at checkout.
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
        <Link
          href="/prints"
          className="px-8 py-3.5 border border-charcoal/20 text-charcoal text-xs tracking-widest uppercase hover:bg-charcoal/5 transition-colors text-center"
        >
          Continue Shopping
        </Link>
        <button
          onClick={handleCheckout}
          disabled={busy}
          className="px-10 py-3.5 bg-charcoal text-cream text-xs tracking-widest uppercase hover:bg-charcoal/85 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {busy ? "Redirecting…" : "Checkout"}
        </button>
      </div>
    </div>
  );
}
