"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";

export default function CartButton({ className = "" }: { className?: string }) {
  const { count, openCart } = useCart();

  return (
    <button
      onClick={openCart}
      className={`relative text-charcoal/60 hover:text-charcoal transition-colors duration-200 ${className}`}
      aria-label={`Cart (${count} ${count === 1 ? "item" : "items"})`}
    >
      <ShoppingBag size={18} />
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-charcoal text-cream text-[10px] font-medium rounded-full min-w-[16px] h-[16px] px-1 flex items-center justify-center leading-none">
          {count}
        </span>
      )}
    </button>
  );
}
