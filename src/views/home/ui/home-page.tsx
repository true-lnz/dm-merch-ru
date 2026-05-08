import { RequestCta } from "@/features/request-cta";
import { WidowFix } from "@/shared/ui/widow-fix";
import { FaqSection } from "@/widgets/faq-section";
import { HomeDigest } from "@/widgets/home-digest";
import { HomeBenefits, HomeFeatures } from "@/widgets/home-feature-cards/home-feature-cards";
import { HomeHero } from "@/widgets/home-hero";
import { HomeLeadCta } from "@/widgets/home-lead-cta";
import { HomeMarquiz } from "@/widgets/home-marquiz";
import { HomePartnerProducts } from "@/widgets/home-partner-products";
import { HomeResults } from "@/widgets/home-results";
import { HomeReviews } from "@/widgets/home-reviews";
import { HomeServices } from "@/widgets/home-services";
import { HomeUrgentOrder } from "@/widgets/home-urgent-order";
import { HomeWorkStages } from "@/widgets/home-work-stages";

export function HomePage() {
  return (
    <>
      <WidowFix />
      <HomeHero />
      <HomeDigest />
      <HomeResults />
      <HomeServices />
      <HomeMarquiz />
      <HomeBenefits />
      <HomeLeadCta />
      <HomePartnerProducts />
      <HomeUrgentOrder />
      <HomeReviews />
      <HomeWorkStages />
      <HomeFeatures />
      <FaqSection />
      <RequestCta />
    </>
  );
}
