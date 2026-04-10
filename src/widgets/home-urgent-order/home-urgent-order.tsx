import Image from "next/image";
import { RequestDialog } from "@/features/request-dialog";
import { PageSubheader } from "@/shared/ui/page-subheader";

const URGENT_ORDER_IMAGE = {
  src: "/cases/mvk/coffee-shirt.jpg",
  alt: "Срочный запуск мерча",
};

export function HomeUrgentOrder() {
  return (
    <section className="py-14 md:py-20 xl:py-[110px]">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,360px)] xl:items-end xl:gap-[40px]">
        <div className="overflow-hidden rounded-[24px]">
          <div className="relative aspect-[340/326] md:aspect-[16/10] xl:min-h-[648px]">
            <Image
              src={URGENT_ORDER_IMAGE.src}
              alt={URGENT_ORDER_IMAGE.alt}
              fill
              sizes="(max-width: 1279px) 100vw, 60vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="rounded-[24px] bg-[var(--card-bg)] p-5 md:p-8">
          <p className="text-[16px] leading-[1.35] tracking-[-0.03em] text-[#404040] md:text-[18px]">
            Быстрые тиражи под событие, запуск или срочную поставку.
          </p>
          <PageSubheader
            title="Экспресс-мерч, когда нужен вчера"
            className="mt-3"
            titleClassName="text-[38px] md:text-[54px]"
          />
          <p className="mt-4 text-[15px] leading-[1.35] tracking-[-0.03em] text-[var(--text-muted)] md:text-[18px]">
            Если сроки уже горят, собираем рабочий набор позиций, быстро согласовываем макет и ведем производство по укороченному маршруту без потери качества.
          </p>
          <div className="mt-8">
            <RequestDialog className="lg:w-full" label="Рассчитать срочный заказ" showCaption={false} />
          </div>
        </div>
      </div>
    </section>
  );
}
