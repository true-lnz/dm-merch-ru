import { RequestCta } from "@/features/request-cta";
import type { HomePageBlockType, HomePageData } from "@/shared/lib/payload/home-page";
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

function renderBlock(blockType: HomePageBlockType, data: HomePageData) {
  switch (blockType) {
    case "hero":
      return <HomeHero data={data.hero} />;
    case "digest":
      return <HomeDigest data={data.digest} />;
    case "results":
      return <HomeResults data={data.results} />;
    case "services":
      return <HomeServices data={data.services} />;
    case "marquiz":
      return <HomeMarquiz />;
    case "benefits":
      return <HomeBenefits data={data.benefits} />;
    case "leadCta":
      return <HomeLeadCta data={data.leadCta} />;
    case "partnerProducts":
      return <HomePartnerProducts data={data.partnerProducts} />;
    case "urgentOrder":
      return <HomeUrgentOrder data={data.urgentOrder} />;
    case "reviews":
      return <HomeReviews data={data.reviews} />;
    case "workStages":
      return <HomeWorkStages data={data.workStages} />;
    case "features":
      return <HomeFeatures data={data.features} />;
    case "faq":
      return <FaqSection />;
    case "requestCta":
      return <RequestCta />;
  }
}

export function HomePage({ data }: { data: HomePageData }) {
  return (
    <>
      <WidowFix />
      {data.layoutBlocks.map((block) => (block.enabled ? <div key={block.blockType}>{renderBlock(block.blockType, data)}</div> : null))}
    </>
  );
}
