import { PageSubheading } from "@/shared/ui/page-subheading";
import { FeatureCard } from "./feature-card";

type HomeFeatureCard = {
  title: string;
  description: string;
  backgroundImageUrl: string;
};

type FeatureCardsSectionProps = {
  title: string;
  description?: string;
  items: HomeFeatureCard[];
};

const HOME_BENEFITS = {
  title: "Собственный дизайн-отдел",
  items: [
    {
      title: "3 концепции \n– в течении 5 рабочих дней",
      backgroundImageUrl: "/home/img_card_cover_home_benefits_v1.svg",
      description:
        "Предлагаем несколько визуальных направлений, чтобы вы могли выбрать лучшее решение под задачи бренда, формат продукции и стиль компании.",
    },
    {
      title: "Дизайн\nпод производство",
      backgroundImageUrl: "/home/img_card_cover_home_benefits_v2.svg",
      description: "Дизайн, который работает на изделии, а не только в макете. Наши дизайнеры работают с одеждой, а не с абстрактной графикой.",
    },
    {
      title: "Сроки фиксируем\nв договоре",
      backgroundImageUrl: "/home/img_card_cover_home_benefits_v3.svg",
      description: "Не «стараемся успеть», а берём ответственность за результат.",
    },
  ] satisfies HomeFeatureCard[],
} as const;

const HOME_COMPETITIVE_ADVANTAGES = {
  title: "Наши преимущества перед конкурентами",
  description: "Цена ниже рынка на ~25%  за счет собственного производства",
  items: [
    {
      title: "Готовый мерч в среднем за 14 рабочих дней",
      backgroundImageUrl: "/home/img_card_cover_home_features_v1.svg",
      description: "Делаем быстрее рынка без потери качества. Сроки фиксируем и держим их по договору.",
    },
    {
      title: "Образцы отправляем по всей России",
      backgroundImageUrl: "/home/img_card_cover_home_features_v2.svg",
      description:
        "Перед запуском тиража вы видите и трогаете реальный продукт: ткань, посадку, нанесение, детали. Отправляем образцы в любой город РФ, чтобы решение было осознанным, а не «по картинке».",
    },
    {
      title: "Работаем со всеми уровнями тканей и 10 видами нанесений",
      backgroundImageUrl: "/home/img_card_cover_home_features_v3.svg",
      description:
        "Работаем с тканями, которые выглядят достойно и носятся долго. Подбираем оптимальный способ брендирования под задачу: вышивка, шелкография, термопечать, тиснение, DTF и другие.",
    },
  ] satisfies HomeFeatureCard[],
} as const;

function FeatureCardsSection({ title, description, items }: FeatureCardsSectionProps) {
  return (
    <section className="my-[35px] md:my-[45px]">
      <PageSubheading title={title} description={description} descriptionPlacement="bottom" descriptionClassName="max-w-[43rem]" />
      <div className="mt-8 grid auto-rows-fr grid-cols-1 gap-4 xl:grid-cols-3 xl:gap-5">
        {items.map((item, index) => (
          <FeatureCard
            key={item.title}
            title={item.title}
            description={item.description}
            backgroundImageUrl={item.backgroundImageUrl}
            accent={index === 0}
            className="h-full"
          />
        ))}
      </div>
    </section>
  );
}

export function HomeBenefits() {
  return <FeatureCardsSection title={HOME_BENEFITS.title} items={HOME_BENEFITS.items} />;
}

export function HomeFeatures() {
  return (
    <FeatureCardsSection
      title={HOME_COMPETITIVE_ADVANTAGES.title}
      description={HOME_COMPETITIVE_ADVANTAGES.description}
      items={HOME_COMPETITIVE_ADVANTAGES.items}
    />
  );
}
