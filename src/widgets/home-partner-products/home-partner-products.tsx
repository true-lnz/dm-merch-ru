"use client";

import { cn } from "@/shared/lib/cn";
import type { HomePartnerProductsData } from "@/shared/lib/payload/home-page";
import { MobileSnapCarousel } from "@/shared/ui/mobile-snap-carousel";
import { PageSubheading } from "@/shared/ui/page-subheading";
import { PartnerProductCard } from "./partner-product-card";

type HomePartnerProductsProps = {
  data: HomePartnerProductsData;
  showIntro?: boolean;
};

export function HomePartnerProducts({ data, showIntro = true }: HomePartnerProductsProps) {
  return (
    <section className="my-[35px] md:my-[45px]">
      {showIntro ? (
        <PageSubheading
          title={data.title}
          description={data.description}
          descriptionPlacement="side"
          sideDescriptionLayout="two-columns"
          descriptionClassName="max-w-[35.0625rem]"
        />
      ) : null}

      <MobileSnapCarousel
        items={data.items}
        className={cn("md:hidden", showIntro ? "mt-8" : "mt-0")}
        getItemKey={(item) => `${item.title}-${item.imageUrl}`}
        renderItem={(item) => <PartnerProductCard item={item} />}
        slideWidth="100vw"
        slideInset="var(--layout-side-padding)"
        gap="0px"
        opts={{
          align: "center",
          loop: false,
          dragFree: false,
          skipSnaps: false,
          containScroll: false,
          slidesToScroll: 1,
        }}
        prevAriaLabel="Предыдущая карточка"
        nextAriaLabel="Следующая карточка"
      />

      <div className={cn("hidden gap-4 md:gap-5 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", showIntro ? "mt-10" : "mt-0")}>
        {data.items.map((item) => (
          <PartnerProductCard key={item.title} item={item} />
        ))}
      </div>
    </section>
  );
}
