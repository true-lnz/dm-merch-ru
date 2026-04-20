"use client";

import { RequestDialog } from "@/features/request-dialog";
import { cn } from "@/shared/lib/cn";
import { PageSubheading } from "@/shared/ui/page-subheading";
import Image from "next/image";

const SERVICES_IMAGE = {
  src: "/home/img_home_services_cover.png",
  alt: "Синий термос с брендированием Академии успеха",
};

const HOME_SERVICES = [
  {
    title: "Разработка дизайна",
    description: "Продумываем концепцию под задачу бизнеса: не только красиво, а креативно, уместно, стильно и понятно для аудитории.",
  },
  {
    title: "Экспресс-мерч",
    description:
      "Когда сроки жёсткие, а результат всё равно должен быть достойным. Берём на себя дизайн, подбор изделий и производство — без потери внешнего вида. Срок: до 5 рабочих дней.",
  },
  {
    title: "Разработка и пошив изделий под бренд",
    description:
      "Создаём изделия с нуля — под вашу задачу, формат и бюджет. Думаем не только о дизайне, но и о посадке, ткани и реальном использовании. Индивидуальный подбор лекал и материалов.",
  },
  {
    title: "Сувенирная продукция",
    description:
      "Корпоративные подарки, которые поддерживают образ бренда и остаются в использовании. Подбор предметов, материалов и нанесения под ваши задачи.",
  },
] as const;

function ServiceRequestDialog() {
  return (
    <RequestDialog privacyCheckboxId="home-services-request-privacy">
      <button
        type="button"
        className="cursor-pointer text-left font-medium text-base md:text-lg leading-[1.3] tracking-[-0.02em] text-[var(--accent)] transition-opacity hover:opacity-80"
      >
        Обсудить задачу
      </button>
    </RequestDialog>
  );
}

type ServiceCardProps = {
  title: string;
  description: string;
};

function ServiceCard({ title, description }: ServiceCardProps) {
  return (
    <article className="relative flex flex-col gap-4 rounded-[18px] md:rounded-[22.5px] bg-[var(--card-bg)] p-[18px] md:p-[27px]">
      <Image
        src="/icons/ic_feature.svg"
        alt=""
        width={32}
        height={32}
        aria-hidden="true"
        className="feature-icon-rotate-hover absolute right-5 top-5 size-7 md:right-[30px] md:top-[30px] md:size-8"
      />

      <h3 className="font-heading max-w-[80%] text-3xl leading-[0.95] tracking-[0.015em] uppercase text-[var(--heading)] md:text-4xl">{title}</h3>
      <p className="max-w-[90%] text-sm leading-[1.3] tracking-[-0.03em] text-[var(--text-muted)] md:text-base xl:text-lg">{description}</p>

      <div className="mt-auto">
        <ServiceRequestDialog />
      </div>
    </article>
  );
}

export function HomeServices() {
  return (
    <section className="my-[43px] md:my-[55px]">
      <PageSubheading title="Услуги, которые закрывают ваши задачи" />

      <div className="mt-8 grid grid-cols-1 gap-4 xl:grid-cols-[8.075fr_3.925fr] xl:grid-rows-1 xl:gap-5">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-5">
          {HOME_SERVICES.map((item) => (
            <ServiceCard key={item.title} title={item.title} description={item.description} />
          ))}
        </div>

        <div className="rounded-[18px] md:rounded-[22.5px] bg-white xl:self-stretch">
          <div className="relative overflow-hidden rounded-[18px] md:rounded-[22.5px] bg-white aspect-square xl:aspect-auto xl:h-full">
            <Image
              src={SERVICES_IMAGE.src}
              alt={SERVICES_IMAGE.alt}
              fill
              sizes="(max-width: 1279px) 100vw, 52vw"
              className={cn("object-cover image-hover-scale")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
