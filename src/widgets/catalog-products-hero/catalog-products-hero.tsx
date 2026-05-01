import type { CatalogProductsLandingPortrait } from "@/widgets/catalog-products/model/types";
import Image from "next/image";
import { CatalogProductsHeroCenterSvg } from "./catalog-products-hero-center-svg";

type CatalogProductsHeroProps = {
  backgroundImageUrl: string;
  portraits: CatalogProductsLandingPortrait[];
};

const HERO_CARD_HEIGHT = "calc(clamp(112px, 10.5vw, 208px) * 1.1556)";
const HERO_PORTRAIT_WIDTH = `calc(${HERO_CARD_HEIGHT} * 0.75)`;

export function CatalogProductsHero({ backgroundImageUrl, portraits }: CatalogProductsHeroProps) {
  const leftPortraits = portraits.slice(0, 3);
  const rightPortraits = portraits.slice(4, 7);

  return (
    <section className="relative hidden md:block">
      <div className="relative left-[calc(var(--layout-side-padding)*-1)] w-[calc(100%+var(--layout-side-padding)*2)] overflow-hidden bg-transparent px-[calc(var(--layout-side-padding)+16px)] pb-4 pt-6 md:px-[calc(var(--layout-side-padding)+24px)] md:pb-6 md:pt-8 xl:flex xl:min-h-[20vw] xl:items-center xl:px-[calc(var(--layout-side-padding)+32px)] xl:pb-8">
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

        <div className="relative z-10 w-full pb-1">
          <div className="flex w-full items-end justify-center gap-[clamp(8px,1.2vw,20px)] px-1">
            <div className="flex items-end gap-[clamp(8px,1.2vw,20px)]">
              {leftPortraits.map((portrait, index) => (
                <div
                  key={`${portrait.src}-${index}`}
                  className="relative shrink-0 overflow-hidden rounded-[18px] border border-[rgba(42,42,42,0.08)]"
                  style={{ height: HERO_CARD_HEIGHT, width: HERO_PORTRAIT_WIDTH }}
                >
                  <Image src={portrait.src} alt={portrait.alt} fill sizes="(max-width: 1279px) 12vw, 156px" className="object-cover" />
                </div>
              ))}
            </div>

            <div
              className="relative shrink-0 overflow-hidden rounded-[22px] border border-[rgba(42,42,42,0.08)] [&_svg]:h-full [&_svg]:w-full"
              style={{ height: HERO_CARD_HEIGHT, width: HERO_CARD_HEIGHT }}
            >
              <CatalogProductsHeroCenterSvg />
            </div>

            <div className="flex items-end gap-[clamp(8px,1.2vw,20px)]">
              {rightPortraits.map((portrait, index) => (
                <div
                  key={`${portrait.src}-${index + 4}`}
                  className="relative shrink-0 overflow-hidden rounded-[18px] border border-[rgba(42,42,42,0.08)]"
                  style={{ height: HERO_CARD_HEIGHT, width: HERO_PORTRAIT_WIDTH }}
                >
                  <Image src={portrait.src} alt={portrait.alt} fill sizes="(max-width: 1279px) 12vw, 156px" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
