"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
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
const WISHLIST_STORAGE_KEY = "dm-merch:wishlist:v1";

function sanitizeQuantity(quantity: number) {
  if (!Number.isFinite(quantity)) {
    return 1;
  }

  return Math.max(1, Math.floor(quantity));
}

function parseStoredItems(value: string | null): WishlistItem[] | null {
  if (!value) return null;

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return null;

    const items = parsed.filter((item): item is WishlistItem => {
      if (!item || typeof item !== "object") return false;
      const candidate = item as Partial<WishlistItem>;
      return (
        typeof candidate.id === "string" &&
        typeof candidate.title === "string" &&
        typeof candidate.articleNumber === "string" &&
        typeof candidate.imageUrl === "string" &&
        typeof candidate.unitPriceRub === "number" &&
        Number.isFinite(candidate.unitPriceRub) &&
        typeof candidate.quantity === "number" &&
        Number.isFinite(candidate.quantity)
      );
    });

    return items.map((item) => ({ ...item, quantity: sanitizeQuantity(item.quantity) }));
  } catch {
    return null;
  }
}

function readStoredItems() {
  for (const storage of [window.localStorage, window.sessionStorage]) {
    try {
      const items = parseStoredItems(storage.getItem(WISHLIST_STORAGE_KEY));
      if (items) return items;
    } catch {
      // Continue with the other storage when browser storage is restricted.
    }
  }
  return [];
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setItems(readStoredItems());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const serialized = JSON.stringify(items);
    for (const storage of [window.localStorage, window.sessionStorage]) {
      try {
        storage.setItem(WISHLIST_STORAGE_KEY, serialized);
      } catch {
        // Keep the in-memory list if storage is unavailable or full.
      }
    }
  }, [isHydrated, items]);

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key !== WISHLIST_STORAGE_KEY || !event.newValue) return;
      const nextItems = parseStoredItems(event.newValue);
      if (nextItems) setItems(nextItems);
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

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
