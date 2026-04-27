"use client";

const OPEN_WISHLIST_DIALOG_EVENT = "wishlist:open-dialog";

export function openWishlistDialog() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(OPEN_WISHLIST_DIALOG_EVENT));
}

export function subscribeToWishlistDialogOpen(onOpen: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener(OPEN_WISHLIST_DIALOG_EVENT, onOpen);

  return () => {
    window.removeEventListener(OPEN_WISHLIST_DIALOG_EVENT, onOpen);
  };
}
