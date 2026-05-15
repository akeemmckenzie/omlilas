"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";
import { formatPrice } from "@/lib/sanity";
import { VARIANT_LABELS } from "@/lib/artworkVariants";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    subtotal,
    updateQuantity,
    removeItem,
  } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="fixed inset-0 z-40 bg-charcoal/40"
            aria-hidden
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-cream shadow-2xl flex flex-col"
            role="dialog"
            aria-label="Shopping cart"
          >
            <header className="flex items-center justify-between px-6 py-5 border-b border-charcoal/10">
              <h2 className="font-serif text-xl text-charcoal tracking-wide">
                Your Cart
              </h2>
              <button
                onClick={closeCart}
                className="text-charcoal/60 hover:text-charcoal transition-colors"
                aria-label="Close cart"
              >
                <X size={22} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center px-6 text-center">
                  <p className="text-sm text-charcoal/60 mb-6">
                    Your cart is empty.
                  </p>
                  <Link
                    href="/prints"
                    onClick={closeCart}
                    className="px-8 py-3 bg-charcoal text-cream text-xs tracking-widest uppercase hover:bg-charcoal/85 transition-colors"
                  >
                    Browse Prints
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-charcoal/10">
                  {items.map((item) => (
                    <li
                      key={`${item.artworkId}:${item.variant}`}
                      className="px-6 py-5 flex gap-4"
                    >
                      <div className="relative w-20 h-24 bg-cream-light flex-shrink-0 overflow-hidden">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/artwork/${item.slug}?v=${item.variant}`}
                          onClick={closeCart}
                          className="font-serif text-sm text-charcoal hover:text-accent transition-colors truncate block"
                        >
                          {item.title}
                        </Link>
                        <p className="text-[11px] tracking-[0.15em] uppercase text-charcoal/50 mt-1">
                          {VARIANT_LABELS[item.variant]}
                        </p>
                        {item.edition && (
                          <p className="text-xs text-charcoal/50 mt-0.5">
                            {item.edition}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-3">
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
                          <p className="text-sm text-charcoal">
                            {formatPrice(item.unitPrice * item.quantity)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.artworkId, item.variant)}
                        className="text-charcoal/40 hover:text-charcoal transition-colors self-start"
                        aria-label={`Remove ${item.title}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-charcoal/10 px-6 py-5 space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs tracking-[0.2em] uppercase text-charcoal/60">
                    Subtotal
                  </span>
                  <span className="font-serif text-xl text-charcoal">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <p className="text-[11px] text-charcoal/50 leading-relaxed">
                  Shipping and taxes calculated at checkout.
                </p>
                {error && (
                  <p className="text-xs text-red-600 leading-relaxed">{error}</p>
                )}
                <button
                  onClick={handleCheckout}
                  disabled={busy}
                  className="w-full px-10 py-3.5 bg-charcoal text-cream text-xs tracking-widest uppercase hover:bg-charcoal/85 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {busy ? "Redirecting…" : "Checkout"}
                </button>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="block text-center text-xs tracking-widest uppercase text-charcoal/60 hover:text-charcoal transition-colors"
                >
                  View full cart
                </Link>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
