"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CartItem, CartVariant, cartLineKey } from "./types";

const STORAGE_KEY = "omlilas:cart:v1";

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (artworkId: string, variant: CartVariant) => void;
  updateQuantity: (
    artworkId: string,
    variant: CartVariant,
    quantity: number,
  ) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function loadFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i) =>
        i &&
        typeof i.artworkId === "string" &&
        (i.variant === "signed" || i.variant === "unsigned") &&
        typeof i.unitPrice === "number" &&
        typeof i.quantity === "number" &&
        i.quantity > 0,
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setItems(loadFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore quota / privacy errors
    }
  }, [items, hydrated]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) => {
      setItems((prev) => {
        const key = cartLineKey(item.artworkId, item.variant);
        const idx = prev.findIndex(
          (i) => cartLineKey(i.artworkId, i.variant) === key,
        );
        if (idx === -1) {
          return [...prev, { ...item, quantity }];
        }
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      });
      setIsOpen(true);
    },
    [],
  );

  const removeItem = useCallback(
    (artworkId: string, variant: CartVariant) => {
      setItems((prev) =>
        prev.filter(
          (i) => cartLineKey(i.artworkId, i.variant) !== cartLineKey(artworkId, variant),
        ),
      );
    },
    [],
  );

  const updateQuantity = useCallback(
    (artworkId: string, variant: CartVariant, quantity: number) => {
      setItems((prev) => {
        if (quantity <= 0) {
          return prev.filter(
            (i) =>
              cartLineKey(i.artworkId, i.variant) !==
              cartLineKey(artworkId, variant),
          );
        }
        return prev.map((i) =>
          cartLineKey(i.artworkId, i.variant) === cartLineKey(artworkId, variant)
            ? { ...i, quantity }
            : i,
        );
      });
    },
    [],
  );

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count,
      subtotal,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      removeItem,
      updateQuantity,
      clear,
    }),
    [items, count, subtotal, isOpen, addItem, removeItem, updateQuantity, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside a CartProvider");
  }
  return ctx;
}
