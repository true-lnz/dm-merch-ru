import { PageHeading } from "@/shared/ui/page-heading";
import type { Metadata } from "next";
import Image from "next/image";

const HERO_IMAGE = {
  src: "/home/img_home_hero_cover.png",
  alt: "Команда в фирменном мерче",
} as const;

export const metadata: Metadata = {
  title: "Спасибо за обращение",
};

export default function RequestSuccessPage() {
  return (
    <section className="mb-[63px] mt-[36px] relative w-full overflow-visible md:mb-[72px] xl:mb-[90px]">
      <div className="flex min-h-0 w-full justify-start xl:h-[80vh] 2xl:h-[90vh]">
        <div className="pointer-events-none absolute inset-y-0 hidden right-[calc(var(--layout-side-padding)*-1)] w-[65%] xl:block 2xl:w-[55%]">
          <Image
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt}
            fill
            priority
            unoptimized
            sizes="42vw"
            className="object-cover object-[130%_top]"
          />
        </div>

        <div className="relative z-10 mb-16 flex w-full justify-center xl:block xl:w-1/2 xl:max-w-[50%]">
          <div className="flex w-full flex-col gap-8 px-0 pb-0 pt-5 md:rounded-[22.5px] xl:h-full xl:max-w-none xl:justify-between xl:rounded-[22.5px] xl:bg-[rgba(232,231,226,0.7)] xl:px-[50px] xl:pb-[50px] xl:pt-[50px] xl:backdrop-blur-[8px]">
            <div className="flex flex-col gap-5 xl:gap-[30px]">
              <PageHeading title="Спасибо за обращение." />
            </div>

            <div className="relative mb-[calc(24px*-1)] aspect-[340/314] w-full overflow-hidden sm:mb-[calc(20px*-1)] md:aspect-[16/12] xl:hidden">
              <Image
                src={HERO_IMAGE.src}
                alt={HERO_IMAGE.alt}
                fill
                priority
                sizes="(max-width: 767px) calc(100vw - 60px), 420px"
                className="object-contain object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
