"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart/CartContext";

export default function SuccessClearCart() {
  const { clear } = useCart();
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
