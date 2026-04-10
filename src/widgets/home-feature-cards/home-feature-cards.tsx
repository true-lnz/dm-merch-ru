import { SparklesIcon } from "lucide-react";
import { PageSubheader } from "@/shared/ui/page-subheader";

type HomeFeatureCard = {
  title: string;
  description: string;
};

type HomeFeatureCardsProps = {
  title: string;
  description?: string;
  items: HomeFeatureCard[];
};

export function HomeFeatureCards({
  title,
  description,
  items,
}: HomeFeatureCardsProps) {
  return (
    <section className="py-14 md:py-20 xl:py-[110px]">
      <PageSubheader
        title={title}
        description={description}
        descriptionPlacement="bottom"
        descriptionClassName="max-w-[43rem]"
      />
      <div className="mt-8 grid gap-5 xl:grid-cols-3 xl:gap-[30px]">
        {items.map((item) => (
          <article
            key={item.title}
            className="relative overflow-hidden rounded-[20px] bg-[var(--card-bg)] px-5 py-5 md:px-[30px] md:py-7"
          >
            <span className="inline-flex size-10 items-center justify-center rounded-full bg-white text-[var(--accent)] shadow-[0_8px_24px_rgba(2,82,197,0.12)]">
              <SparklesIcon className="size-4" strokeWidth={2.2} />
            </span>
            <h3 className="mt-7 font-heading text-[32px] leading-[0.95] tracking-[0.015em] text-[var(--heading)] uppercase md:text-[40px]">
              {item.title}
            </h3>
            <p className="mt-4 text-[15px] leading-[1.35] tracking-[-0.03em] text-[var(--text-muted)] md:text-[18px]">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
