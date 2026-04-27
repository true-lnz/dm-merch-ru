"use client";

import { toast } from "sonner";
import { openWishlistDialog } from "./wishlist-dialog-events";

export function showWishlistAddedToast() {
  toast.success("Товар добавлен в вишлист", {
    action: {
      label: "Перейти",
      onClick: () => {
        openWishlistDialog();
      },
    },
  });
}
