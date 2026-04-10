import { FaqSection } from "@/widgets/faq-section";
import { HomeDigest } from "@/widgets/home-digest";
import { HomeFeatureCards } from "@/widgets/home-feature-cards";
import { HomeHero } from "@/widgets/home-hero";
import { HomeLeadCta } from "@/widgets/home-lead-cta";
import { HomePartnerProducts } from "@/widgets/home-partner-products";
import { HomeResultsSlider } from "@/widgets/home-results-slider";
import { HomeTestimonials } from "@/widgets/home-testimonials";
import { HomeUrgentOrder } from "@/widgets/home-urgent-order";
import { HomeWorkStages } from "@/widgets/home-work-stages";
import { RequestCta } from "@/widgets/request-cta";
import {
  homeBenefits,
  homeCompetitiveAdvantages,
  homeDigestItems,
  homeFaqItems,
  homeLeadCta,
  homePartnerProducts,
  homeResultsSlides,
  homeTestimonials,
  homeUrgentOrder,
  homeWorkStages,
} from "../model/home-page.data";

export function HomePage() {
  return (
    <div className="page pb-16 md:pb-24 w-full">
      <HomeHero />
      <HomeDigest
        title="Весь спектр задач и форматов"
        description="Собираем мерч-системы под разные бизнес-сценарии: для команды, клиентов, партнеров, мероприятий и повседневной корпоративной среды."
        items={homeDigestItems}
      />
      <HomeResultsSlider slides={homeResultsSlides} />
      <HomeFeatureCards title={homeBenefits.title} items={homeBenefits.items} />
      <HomeLeadCta
        title={homeLeadCta.title}
        description={homeLeadCta.description}
        image={homeLeadCta.image}
      />
      <HomePartnerProducts
        title={homePartnerProducts.title}
        description={homePartnerProducts.description}
        items={homePartnerProducts.items}
      />
      <HomeUrgentOrder
        title={homeUrgentOrder.title}
        eyebrow={homeUrgentOrder.eyebrow}
        description={homeUrgentOrder.description}
        image={homeUrgentOrder.image}
      />
      <HomeTestimonials title={homeTestimonials.title} items={homeTestimonials.items} />
      <HomeWorkStages
        title={homeWorkStages.title}
        description={homeWorkStages.description}
        items={homeWorkStages.items}
      />
      <HomeFeatureCards
        title={homeCompetitiveAdvantages.title}
        description={homeCompetitiveAdvantages.description}
        items={homeCompetitiveAdvantages.items}
      />
      <FaqSection className="mt-6 md:mt-10" items={homeFaqItems} />
      <div className="mt-14 md:mt-[90px]">
        <RequestCta />
      </div>
    </div>
  );
}
