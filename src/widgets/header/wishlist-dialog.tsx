import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/cn";
import { useWishlist, type WishlistItem } from "@/shared/lib/wishlist";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/shared/ui/dialog";
import { RequestForm } from "@/shared/ui/request-form";
import { MinusIcon, PlusIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { toast } from "sonner";

type WishlistDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const rubFormatter = new Intl.NumberFormat("ru-RU");

function formatRub(value: number) {
  return `${rubFormatter.format(value)} ₽`;
}

function WishlistProductCard({
  item,
  onIncrease,
  onDecrease,
  onChangeQuantity,
  onRemove,
}: {
  item: WishlistItem;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onChangeQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}) {
  const lineTotalRub = item.unitPriceRub * item.quantity;

  return (
    <article className="relative grid grid-cols-[86px_1fr] gap-3 rounded-[12px] bg-white p-3 pr-11">
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        aria-label={`Удалить ${item.title} из вишлиста`}
        className="absolute right-3 top-3 inline-flex size-6 items-center justify-center rounded-full bg-[#e8e8e8] text-[#7a7a7a] transition-colors hover:bg-[#dcdcdc] hover:text-[#575757]"
      >
        <XIcon className="size-4" strokeWidth={2.4} />
      </button>

      <div className="overflow-hidden rounded-[9px] border border-[#d8d8d8]">
        <Image src={item.imageUrl} alt={item.title} width={86} height={86} className="size-[86px] object-cover" />
      </div>

      <div className="flex min-w-0 flex-col pr-1">
        <h3 className="truncate text-base font-semibold leading-[1.3] tracking-[-0.03em] text-[#2a2a2a]">{item.title}</h3>
        <p className="mt-1 text-xs leading-[1.35] tracking-[-0.03em] text-[#7a7a7a]">Арт. {item.articleNumber}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <div className="inline-flex items-center rounded-[8px] border border-[#d5d5d5] bg-[#fafafa]">
            <button
              type="button"
              onClick={() => onDecrease(item.id)}
              aria-label={`Уменьшить количество ${item.title}`}
              className="inline-flex h-7 w-7 items-center justify-center text-[#656565] transition-colors hover:bg-[#efefef]"
            >
              <MinusIcon className="size-3.5" strokeWidth={2.2} />
            </button>
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(event) => onChangeQuantity(item.id, Number(event.target.value))}
              className="h-7 w-14 border-x border-[#d5d5d5] bg-transparent px-1 text-center text-xs font-medium text-[#404040] outline-none"
              aria-label={`Количество ${item.title}`}
            />
            <button
              type="button"
              onClick={() => onIncrease(item.id)}
              aria-label={`Увеличить количество ${item.title}`}
              className="inline-flex h-7 w-7 items-center justify-center text-[#656565] transition-colors hover:bg-[#efefef]"
            >
              <PlusIcon className="size-3.5" strokeWidth={2.2} />
            </button>
          </div>

          <p className="text-base font-semibold leading-[1.3] tracking-[-0.03em] text-[#2a2a2a]">{formatRub(lineTotalRub)}</p>
        </div>
      </div>
    </article>
  );
}

export function WishlistDialog({ open, onOpenChange }: WishlistDialogProps) {
  const { items, addItem, updateQuantity, increaseQuantity, decreaseQuantity, removeItem, clear } = useWishlist();

  const totalRub = useMemo(() => items.reduce((sum, item) => sum + item.unitPriceRub * item.quantity, 0), [items]);
  const shouldDesktopScrollItems = items.length > 4;

  function handleClear() {
    const removedItems = items;
    clear();
    toast("Вишлист очищен", {
      action: {
        label: "Отменить",
        onClick: () => removedItems.forEach((item) => addItem(item, item.quantity)),
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "flex h-screen h-[100dvh] max-h-screen max-h-[100dvh] w-screen max-w-none flex-col overflow-y-auto rounded-none bg-[#f5f4ef] bg-[url('/img_wishlist_card_cover.svg')] bg-cover bg-center bg-no-repeat p-[27px] pt-[max(27px,env(safe-area-inset-top))] pb-[max(27px,env(safe-area-inset-bottom))] top-0 left-0 translate-x-0 translate-y-0 sm:max-w-none lg:w-[min(1120px,calc(100vw-2rem))] lg:max-w-none lg:overflow-hidden lg:rounded-[18px] lg:p-8 lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2",
          items.length > 0 ? "lg:h-[calc(100dvh-5rem)] lg:max-h-[calc(100dvh-5rem)]" : "lg:h-auto lg:max-h-none",
        )}
      >
        <div className="flex shrink-0 items-start justify-between gap-4">
          <DialogTitle className="font-heading text-4xl leading-[0.95] tracking-[0.015em] uppercase text-[var(--heading)]">Вишлист</DialogTitle>
          <DialogClose
            className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center text-[#b3b3b3] transition-colors hover:text-[#2a2a2a] xl:mt-1 xl:size-10"
            aria-label="Закрыть вишлист"
          >
            <XIcon className="size-5 xl:size-7" strokeWidth={2.5} />
          </DialogClose>
        </div>

        {items.length === 0 ? (
          <div className="mt-4 rounded-[14px] bg-white/90 p-5">
            <p className="text-lg font-semibold leading-[1.3] tracking-[-0.03em] text-[#2a2a2a]">Подберем мерч под ваш бюджет и задачу</p>
            <p className="mt-2 text-sm leading-[1.45] tracking-[-0.02em] text-[#5f5f5f]">
              Добавьте товары в вишлист и мы подготовим персональное коммерческое предложение с лучшей ценой под ваш тираж.
            </p>
          </div>
        ) : (
          <div className="mt-5 flex min-h-0 flex-1 flex-col gap-3 lg:grid lg:grid-rows-[auto_minmax(0,1fr)_auto] lg:overflow-hidden">
            <div className="flex shrink-0 items-center justify-between gap-3">
              <p className="text-sm font-medium leading-[1.3] tracking-[-0.03em] text-[#5a5a5a]">Товары в вишлисте: {items.length}</p>
              <button
                type="button"
                onClick={handleClear}
                className="text-sm leading-[1.3] tracking-[-0.03em] text-[#7a7a7a] underline underline-offset-2 transition-colors hover:text-[#4f4f4f]"
              >
                Очистить вишлист
              </button>
            </div>

            <div className="grid gap-6 lg:min-h-0 lg:overflow-hidden lg:grid-cols-5 lg:items-start">
              <section aria-label="Товары в вишлисте" className="flex flex-col gap-3 lg:min-h-0 lg:overflow-hidden lg:col-span-2">
                <div
                  className={cn(
                    "pr-1 lg:min-h-0 lg:flex-1",
                    shouldDesktopScrollItems
                      ? "lg:max-h-[calc(100dvh-24rem)] lg:overflow-y-auto"
                      : "lg:max-h-none lg:overflow-y-visible",
                  )}
                >
                  <div className="grid gap-3">
                    {items.map((item) => (
                      <WishlistProductCard
                        key={item.id}
                        item={item}
                        onIncrease={increaseQuantity}
                        onDecrease={decreaseQuantity}
                        onChangeQuantity={updateQuantity}
                        onRemove={removeItem}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-end border-t border-[var(--border)] pt-3 text-base font-semibold leading-[1.3] tracking-[-0.03em] text-[#2a2a2a]">
                  <span>Итого: {formatRub(totalRub)}</span>
                </div>
                <p className="text-xs leading-[1.4] tracking-[-0.02em] text-[#6f6f6f]">При больших тиражах цена рассчитывается индивидуально.</p>
              </section>

              <section aria-label="Контактные данные" className="min-h-0 rounded-[14px] bg-white p-4 sm:p-5 lg:col-span-3 lg:flex lg:flex-col">
                <RequestForm
                  source="wishlist-dialog"
                  requestType="wishlist"
                  wishlistItems={items.map((item) => ({
                    id: item.id,
                    title: item.title,
                    articleNumber: item.articleNumber,
                    productUrl: item.productUrl,
                    quantity: item.quantity,
                    unitPriceRub: item.unitPriceRub,
                  }))}
                  totalRub={totalRub}
                  includeEmail
                  formId="wishlist-request-form"
                  privacyCheckboxId="wishlist-dialog-privacy"
                  showSubmitButton={false}
                  messageAsInput
                  onSuccess={clear}
                  formClassName="flex h-full min-h-0 flex-col gap-3"
                />
              </section>
            </div>

            <Button type="submit" form="wishlist-request-form" variant="blue" className="h-[47px] w-full shrink-0 cursor-pointer text-lg">
              Запросить коммерческое предложние
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
