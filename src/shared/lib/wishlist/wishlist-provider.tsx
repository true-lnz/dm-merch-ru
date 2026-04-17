"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { AddWishlistItemInput, WishlistItem } from "./types";

type WishlistContextValue = {
  items: WishlistItem[];
  count: number;
  isInWishlist: (id: string) => boolean;
  addItem: (item: AddWishlistItemInput, quantity: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clear: () => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

function sanitizeQuantity(quantity: number) {
  if (!Number.isFinite(quantity)) {
    return 1;
  }

  return Math.max(1, Math.floor(quantity));
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);

  const addItem = useCallback((item: AddWishlistItemInput, quantity: number) => {
    const safeQuantity = sanitizeQuantity(quantity);

    setItems((currentItems) => {
      const existing = currentItems.find((wishlistItem) => wishlistItem.id === item.id);

      if (!existing) {
        return [...currentItems, { ...item, quantity: safeQuantity }];
      }

      return currentItems.map((wishlistItem) =>
        wishlistItem.id === item.id ? { ...wishlistItem, quantity: safeQuantity } : wishlistItem,
      );
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    const safeQuantity = sanitizeQuantity(quantity);

    setItems((currentItems) =>
      currentItems.map((item) => (item.id === id ? { ...item, quantity: safeQuantity } : item)),
    );
  }, []);

  const increaseQuantity = useCallback((id: string) => {
    setItems((currentItems) =>
      currentItems.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)),
    );
  }, []);

  const decreaseQuantity = useCallback((id: string) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item,
      ),
    );
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      count: items.length,
      isInWishlist: (id) => items.some((item) => item.id === id),
      addItem,
      removeItem,
      updateQuantity,
      increaseQuantity,
      decreaseQuantity,
      clear,
    }),
    [addItem, clear, decreaseQuantity, increaseQuantity, items, removeItem, updateQuantity],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }

  return context;
}
