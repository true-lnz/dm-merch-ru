import { PageSubheading } from "@/shared/ui/page-subheading";
import type { HomeFeatureCardsSectionData } from "@/shared/lib/payload/home-page";
import { FeatureCard } from "./feature-card";

function FeatureCardsSection({ title, description, items }: HomeFeatureCardsSectionData) {
  return (
    <section className="my-[35px] md:my-[45px]">
      <PageSubheading title={title} description={description} descriptionPlacement="bottom" descriptionClassName="max-w-[43rem]" />
      <div className="mt-8 grid grid-cols-1 gap-4 xl:auto-rows-fr xl:grid-cols-3 xl:gap-5">
        {items.map((item, index) => (
          <FeatureCard
            key={item.title}
            title={item.title}
            description={item.description}
            backgroundImageUrl={item.backgroundImageUrl}
            accent={index === 0}
            className="xl:h-full"
          />
        ))}
      </div>
    </section>
  );
}

export function HomeBenefits({ data }: { data: HomeFeatureCardsSectionData }) {
  return <FeatureCardsSection title={data.title} description={data.description} items={data.items} />;
}

export function HomeFeatures({ data }: { data: HomeFeatureCardsSectionData }) {
  return <FeatureCardsSection title={data.title} description={data.description} items={data.items} />;
}
