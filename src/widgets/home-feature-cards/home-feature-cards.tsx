import { SparklesIcon } from "lucide-react";
import { PageSubheader } from "@/shared/ui/page-subheader";

type HomeFeatureCard = {
  title: string;
  description: string;
};

type FeatureCardsSectionProps = {
  title: string;
  description?: string;
  items: HomeFeatureCard[];
};

const HOME_BENEFITS = {
  title: "Чувствуете, где мерч закрывает задачу",
  items: [
    {
      title: "3 концепции в течение 5 рабочих дней",
      description:
        "Предлагаем несколько визуальных направлений, чтобы вы могли выбрать решение под задачу бренда, формат продукции и стиль компании.",
    },
    {
      title: "Дизайн под производство",
      description:
        "Дизайн, который работает на изделии, а не только в макете. Наши дизайнеры работают с одеждой, а не с абстрактной графикой.",
    },
    {
      title: "Сроки фиксируем в договоре",
      description:
        "Не \"стараемся успеть\", а берем ответственность за результат и прозрачные этапы проекта.",
    },
  ] satisfies HomeFeatureCard[],
} as const;

const HOME_COMPETITIVE_ADVANTAGES = {
  title: "Наши преимущества перед конкурентами",
  description:
    "Фокус не на красивых обещаниях, а на понятных производственных преимуществах, которые снижают риск для клиента.",
  items: [
    {
      title: "Готовый мерч в среднем за 14 рабочих дней",
      description:
        "Делаем быстрее рынка без потери качества и держим сроки по договору.",
    },
    {
      title: "Образцы отправляем по всей России",
      description:
        "До тиража вы видите реальный продукт: ткань, посадку, нанесение и детали. Решение принимается не по рендеру, а по предмету.",
    },
    {
      title: "Работаем с тканями и 10 видами нанесений",
      description:
        "Подбираем сочетание материалов и брендирования под задачу: вышивка, шелкография, тиснение, термопечать, DTF и другие технологии.",
    },
  ] satisfies HomeFeatureCard[],
} as const;

function FeatureCardsSection({
  title,
  description,
  items,
}: FeatureCardsSectionProps) {
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

export function HomeBenefits() {
  return <FeatureCardsSection title={HOME_BENEFITS.title} items={HOME_BENEFITS.items} />;
}

export function HomeCompetitiveAdvantages() {
  return (
    <FeatureCardsSection
      title={HOME_COMPETITIVE_ADVANTAGES.title}
      description={HOME_COMPETITIVE_ADVANTAGES.description}
      items={HOME_COMPETITIVE_ADVANTAGES.items}
    />
  );
}
