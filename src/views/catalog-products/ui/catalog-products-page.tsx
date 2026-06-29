import { RequestCta } from "@/features/request-cta";
import { getSiteInfo } from "@/shared/config/site-info/get-site-info";
import { formatPhoneHref } from "@/shared/lib/phone";
import { WidowFix } from "@/shared/ui/widow-fix";
import { CatalogProductsArticles } from "@/widgets/catalog-products-articles";
import { CatalogProductsCategories } from "@/widgets/catalog-products-categories";
import { CatalogProductsHero } from "@/widgets/catalog-products-hero";
import type { CatalogProductsLandingData } from "@/widgets/catalog-products/model/types";
import { Phone } from "lucide-react";
import Link from "next/link";
import { CatalogProductsBottomBar } from "./catalog-products-bottom-bar";

export async function CatalogProductsPage({ data }: { data: CatalogProductsLandingData }) {
  const siteInfo = await getSiteInfo();
  const phoneHref = formatPhoneHref(siteInfo.phone);

  return (
    <>
      <WidowFix />
      <CatalogProductsBottomBar categories={data.categories} searchProducts={data.searchProducts} />
      <CatalogProductsHero portraits={data.portraits} />
      <CatalogProductsArticles items={data.articles} />
      <CatalogProductsCategories items={data.categories} heading={data.categoriesHeading} />
      <RequestCta />
      <section className="bg-white -mx-[var(--layout-side-padding)] py-6 md:py-8 hidden md:block" aria-label="Контактный телефон">
        <div className="mx-auto flex w-full max-w-[720px] justify-center">
          <Link
            href={phoneHref}
            className="inline-flex items-center justify-center gap-3 rounded-[12px] text-center text-[var(--text)] transition-opacity hover:opacity-70 md:gap-4"
            aria-label={`Позвонить по номеру ${siteInfo.phone}`}
          >
            <Phone className="size-5 shrink-0 text-[var(--accent)] md:size-[35px]" strokeWidth={2.5} aria-hidden="true" />
            <span className="text-lg font-bold tracking-[-0.04em] md:text-3xl text-[var(--accent)]">{siteInfo.phone}</span>
          </Link>
        </div>
      </section>
    </>
  );
}
