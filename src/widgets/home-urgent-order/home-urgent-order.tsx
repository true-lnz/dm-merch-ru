import { RequestDialog } from "@/features/request-dialog";
import Image from "next/image";
import type { CSSProperties } from "react";
import { PageSubheading } from "../../shared/ui/page-subheading";

const URGENT_ORDER_IMAGE = {
  src: "/cases/mvk/coffee-shirt.jpg",
  alt: "Срочный запуск мерча",
};

export function HomeUrgentOrder() {
  return (
    <section className="my-[63px] md:my-[72px] xl:my-[90px]">
      <div className="grid grid-cols-1 md:grid-cols-2 md:items-stretch">
        <div
          className="flex flex-col rounded-[24px] bg-[var(--accent)] px-5 py-5 text-white md:px-8 md:py-8 xl:px-[37px] xl:py-[43px]"
          style={
            {
              "--heading": "#ffffff",
              "--text-muted": "rgba(255,255,255,0.82)",
              "--text": "#ffffff",
              "--field-text": "rgba(255,255,255,0.64)",
              "--field-border": "rgba(255,255,255,0.3)",
              "--accent": "#0252c5",
              "--accent-hover": "#0144a3",
            } as CSSProperties
          }
        >
          <PageSubheading
            title={"Экспресс-мерч\n– когда нужно вчера"}
						className="mb-[20px] xl:mb-[25px]"
          />
					<p className="mb-[20px] text-xs md:text-base xl:text-2xl">
						3 склада, собственные мощности и опыт срочных проектов. Однажды сделали 50 футболок за 3 часа до начала событий и даже успели их забрендировать!
					</p>
					<p className="mb-[20px] text-xs md:text-base xl:text-2xl">
						Экспресс-мерч за 5 рабочих дней — для нас стандарт, а не обещание
					</p>
          <div className="mt-auto">
            <RequestDialog
              className="border border-white bg-white text-[var(--accent)] hover:bg-[#f3f7ff] lg:w-full"
              label="Рассчитать срочный заказ"
              showCaption={false}
              iconContainerClassName="bg-[var(--accent)]"
              iconClassName="brightness-0 invert group-hover:brightness-100 group-hover:invert-0"
            />
          </div>
        </div>
        <div className="rounded-[24px] bg-white">
          <div className="relative aspect-square overflow-hidden rounded-[20px] md:h-full md:min-h-[600px] md:aspect-auto">
            <Image
              src={URGENT_ORDER_IMAGE.src}
              alt={URGENT_ORDER_IMAGE.alt}
              fill
              sizes="(max-width: 1279px) 100vw, 46vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
