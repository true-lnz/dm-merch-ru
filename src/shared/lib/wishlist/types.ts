export type WishlistItem = {
  id: string;
  imageUrl: string;
  title: string;
  articleNumber: string;
  productUrl?: string;
  unitPriceRub: number;
  quantity: number;
};

export type AddWishlistItemInput = Omit<WishlistItem, "quantity">;
