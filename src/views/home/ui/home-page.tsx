import { FaqSection } from "@/widgets/faq-section";
import { HomeDigest } from "@/widgets/home-digest";
import { HomeBenefits, HomeCompetitiveAdvantages } from "@/widgets/home-feature-cards";
import { HomeHero } from "@/widgets/home-hero";
import { HomeLeadCta } from "@/widgets/home-lead-cta";
import { HomePartnerProducts } from "@/widgets/home-partner-products";
import { HomeResultsSlider } from "@/widgets/home-results-slider";
import { HomeTestimonials } from "@/widgets/home-testimonials";
import { HomeUrgentOrder } from "@/widgets/home-urgent-order";
import { HomeWorkStages } from "@/widgets/home-work-stages";
import { RequestCta } from "@/widgets/request-cta";

export function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeDigest />
      <HomeResultsSlider />
      <HomeBenefits />
      <HomeLeadCta />
      <HomePartnerProducts />
      <HomeUrgentOrder />
      <HomeTestimonials />
      <HomeWorkStages />
      <HomeCompetitiveAdvantages />
      <FaqSection />
      <RequestCta />
    </>
  );
}
