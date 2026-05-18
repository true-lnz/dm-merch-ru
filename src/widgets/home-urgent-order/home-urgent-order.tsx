import { RequestDialog } from "@/features/request-dialog";
import type { HomeUrgentOrderData } from "@/shared/lib/payload/home-page";
import { Button } from "@/shared/ui/button";
import Image from "next/image";
import { PageSubheading } from "../../shared/ui/page-subheading";

export function HomeUrgentOrder({ data }: { data: HomeUrgentOrderData }) {
  return (
    <section className="my-[35px] md:my-[45px]">
      <div className="grid grid-cols-1 xl:grid-cols-2 xl:items-stretch">
        <div className="order-2 xl:order-1 flex flex-col rounded-[18px] md:rounded-[22.5px] bg-[var(--accent)] p-[18px] md:p-[54px] text-white">
          <PageSubheading title={data.title} className="mb-[15px] xl:mb-[25px] xl:mb-[25px] tracking-[-0.09] text-white" />
          {data.paragraphs.map((paragraph, index) => (
            <p key={`${index}-${paragraph}`} className={index === data.paragraphs.length - 1 ? "mb-[20px] xl:mb-[18px] text-sm md:text-base xl:text-2xl" : "mb-[15px] xl:mb-[18px] text-sm md:text-base xl:text-2xl"}>
              {paragraph}
            </p>
          ))}
          <div className="mt-auto">
            <RequestDialog source="home-urgent-order">
              <Button type="submit" variant="white" className="w-full h-[47px] text-base md:text-lg cursor-pointer">{data.ctaLabel}</Button>
            </RequestDialog>
          </div>
        </div>
        <div className="rounded-[18px] md:rounded-[22.5px] bg-white order-1 xl:order-2">
          <div className="relative aspect-square overflow-hidden rounded-[18px] md:rounded-[22.5px] xl:h-full xl:min-h-[600px] xl:aspect-auto">
            <Image
              src={data.image.url}
              alt={data.image.alt}
              fill
              sizes="(max-width: 1279px) 100vw, 46vw"
              className="object-contain image-hover-scale"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
