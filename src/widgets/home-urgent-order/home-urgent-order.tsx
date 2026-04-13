import { RequestDialog } from "@/features/request-dialog";
import { Button } from "@/shared/ui/button";
import Image from "next/image";
import { PageSubheading } from "../../shared/ui/page-subheading";

const URGENT_ORDER_IMAGE = {
  src: "/home/img_home_urgent_order_cover.png",
  alt: "Срочный запуск мерча",
};

export function HomeUrgentOrder() {
  return (
    <section className="my-[63px] md:my-[72px] xl:my-[90px]">
      <div className="grid grid-cols-1 xl:grid-cols-2 xl:items-stretch">
        <div
          className="order-2 xl:order-1 flex flex-col rounded-[18px] md:rounded-[22.5px] bg-[var(--accent)] p-[18px] md:p-[55px] xl:p-[72px] text-white"
        >
          <PageSubheading
            title={"Экспресс-мерч\n– когда нужно вчера"}
						className="mb-[15px] xl:mb-[25px] xl:mb-[25px] tracking-[-0.09] text-white"
          />
					<p className="mb-[15px] xl:mb-[18px] text-xs md:text-base xl:text-2xl">
						3 склада, собственные мощности и опыт срочных проектов. Однажды сделали 50 футболок за 3 часа до начала событий и даже успели их забрендировать!
					</p>
					<p className="mb-[20px] xl:mb-[18px] text-xs md:text-base xl:text-2xl">
						Экспресс-мерч за 5 рабочих дней — для нас стандарт, а не обещание
					</p>
          <div className="mt-auto">
            <RequestDialog>
							<Button type="submit" variant="white" className="w-full h-[47px] text-base md:text-lg cursor-pointer">
								Рассчитать срочный заказ
							</Button>
            </RequestDialog>
          </div>
        </div>
        <div className="rounded-[18px] md:rounded-[22.5px] bg-white order-1 xl:order-2">
          <div className="relative aspect-square overflow-hidden rounded-[18px] md:rounded-[22.5px] xl:h-full xl:min-h-[600px] xl:aspect-auto">
            <Image
              src={URGENT_ORDER_IMAGE.src}
              alt={URGENT_ORDER_IMAGE.alt}
              fill
              sizes="(max-width: 1279px) 100vw, 46vw"
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
