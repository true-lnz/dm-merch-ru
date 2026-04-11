import { RequestCta } from "@/features/request-cta";
import { FaqSection } from "@/widgets/faq-section";
import { HomeDigest } from "@/widgets/home-digest";
import { HomeBenefits } from "@/widgets/home-feature-cards";
import { HomeFeatures } from "@/widgets/home-feature-cards/home-feature-cards";
import { HomeHero } from "@/widgets/home-hero";
import { HomeReviews } from "@/widgets/home-reviews";
import { HomeWorkStages } from "@/widgets/home-work-stages";

export function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeDigest />
      {/* <HomeResultsSlider /> */}
      <HomeBenefits />
      {/* <HomeLeadCta /> */}
      {/* <HomePartnerProducts /> */}
      {/* <HomeUrgentOrder /> */}
      <HomeReviews />
      <HomeWorkStages />
      <HomeFeatures />
      <FaqSection />
      <RequestCta />
    </>
  );
}
