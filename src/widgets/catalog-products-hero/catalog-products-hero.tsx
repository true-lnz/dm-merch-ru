import type { CatalogProductsLandingPortrait } from "@/widgets/catalog-products/model/types";
import Image from "next/image";

type CatalogProductsHeroProps = {
  backgroundImageUrl: string;
  portraits: CatalogProductsLandingPortrait[];
};

export function CatalogProductsHero({
  backgroundImageUrl,
    portraits,
}: CatalogProductsHeroProps) {
  return (
    <section className="relative">
      <div className="relative left-[calc(var(--layout-side-padding)*-1)] w-[calc(100%+var(--layout-side-padding)*2)] overflow-hidden bg-transparent px-[calc(var(--layout-side-padding)+16px)] pb-4 pt-6 md:px-[calc(var(--layout-side-padding)+24px)] md:pb-6 md:pt-8 xl:px-[calc(var(--layout-side-padding)+32px)] xl:pb-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          aria-hidden="true"
          style={{
            backgroundImage: `url("${backgroundImageUrl}")`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(245,244,239,0.72)_0%,rgba(245,244,239,0.28)_38%,rgba(245,244,239,0.18)_100%)]"
          aria-hidden="true"
        />

        <div className="relative z-10 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-stretch justify-start gap-3 px-1 md:gap-4 xl:min-w-0 xl:justify-center">
            {portraits.map((portrait, index) => (
              <div
                key={`${portrait.src}-${index}`}
                className="relative h-[220px] w-[132px] shrink-0 overflow-hidden rounded-[18px] md:h-[280px] md:w-[168px] xl:h-[320px] xl:w-[182px]"
              >
                <Image
                  src={portrait.src}
                  alt={portrait.alt}
                  fill
                  sizes="(max-width: 767px) 132px, (max-width: 1279px) 168px, 182px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
