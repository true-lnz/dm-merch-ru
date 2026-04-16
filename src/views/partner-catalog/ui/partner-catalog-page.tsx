import { RequestCta } from "@/features/request-cta";
import { PageHeading } from "@/shared/ui/page-heading";
import { WidowFix } from "@/shared/ui/widow-fix";
import { HomePartnerProducts } from "@/widgets/home-partner-products";

export function PartnerCatalogPage() {
  return (
    <>
      <WidowFix />
      <PageHeading
        title="Каталог партнерских товаров"
        breadcrumb={{
          labelFrom: "Главная",
          labelTo: "Каталог партнерских товаров",
          href: "/",
        }}
      />
      <HomePartnerProducts showIntro={false} />
      <RequestCta />
    </>
  );
}
