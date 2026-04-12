"use client";

import { cn } from "@/shared/lib/cn";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/shared/ui/dialog";
import { PageSubheading } from "@/shared/ui/page-subheading";
import { RequestForm } from "@/shared/ui/request-form";
import { XIcon } from "lucide-react";
import Image from "next/image";

const SERVICES_IMAGE = {
  src: "/home/img_home_services_cover.png",
  alt: "Синий термос с брендированием Академии успеха",
};

const HOME_SERVICES = [
  {
    title: "Разработка дизайна",
    description:
      "Продумываем концепцию под задачу бизнеса: не только красиво, а креативно, уместно, стильно и понятно для аудитории.",
  },
  {
    title: "Разработка и пошив изделий под бренд",
    description:
      "Создаём изделия с нуля — под вашу задачу, формат и бюджет. Думаем не только о дизайне, но и о посадке, ткани и реальном использовании. Индивидуальный подбор лекал и материалов.",
  },
  {
    title: "Экспресс-мерч",
    description:
      "Когда сроки жёсткие, а результат всё равно должен быть достойным. Берём на себя дизайн, подбор изделий и производство — без потери внешнего вида. Срок: до 5 рабочих дней.",
  },
  {
    title: "Сувенирная продукция",
    description:
      "Корпоративные подарки, которые поддерживают образ бренда и остаются в использовании. Подбор предметов, материалов и нанесения под ваши задачи.",
  },
] as const;

function ServiceRequestDialog() {
  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer text-left font-medium text-base md:text-lg leading-[1.3] tracking-[-0.02em] text-[var(--accent)] transition-opacity hover:opacity-80">
        Обсудить задачу
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="block h-screen w-screen max-w-none overflow-y-auto rounded-none bg-[#f5f4ef] p-[27px] md:p-[72px] sm:h-auto md:grid md:w-[50vw] md:max-w-[50vw] sm:rounded-[20px] xl:bg-[#ecebe6]"
      >
        <div className="mb-7 flex items-start justify-between gap-4 xl:mb-8">
          <DialogTitle className="font-heading text-4xl md:text-5xl xl:text-6xl leading-[0.95] tracking-[0.015em] uppercase text-[var(--heading)]">
            Обсудим задачу
            <br />
            и рассчитаем проект
          </DialogTitle>

          <DialogClose
            className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center text-[#b3b3b3] transition-colors hover:text-[#2a2a2a] xl:mt-1 xl:size-10"
            aria-label="Закрыть модалку"
          >
            <XIcon className="size-5 xl:size-7" strokeWidth={2.5} />
          </DialogClose>
        </div>

        <RequestForm
          includeEmail={false}
          privacyCheckboxId="home-services-request-privacy"
          formClassName="space-y-3 xl:space-y-4"
        />
      </DialogContent>
    </Dialog>
  );
}

type ServiceCardProps = {
  title: string;
  description: string;
};

function ServiceCard({ title, description }: ServiceCardProps) {
  return (
    <article className="relative flex min-h-[200px] flex-col rounded-[24px] bg-[var(--card-bg)] p-[18px] md:min-h-[245px] md:p-[27px]">
      <Image
        src="/icons/ic_feature.svg"
        alt=""
        width={32}
        height={32}
        aria-hidden="true"
        className="absolute right-5 top-5 size-7 md:right-[30px] md:top-[30px] md:size-8"
      />

      <h3 className="font-heading max-w-[80%] text-3xl leading-[0.95] tracking-[0.015em] uppercase text-[var(--heading)] md:text-4xl xl:text-5xl">
        {title}
      </h3>
      <p className="mt-3 max-w-[90%] text-sm leading-[1.3] tracking-[-0.03em] text-[var(--text-muted)] md:mt-4 md:text-lg xl:text-xl">
        {description}
      </p>

      <div className="mt-auto md:pt-6">
        <ServiceRequestDialog />
      </div>
    </article>
  );
}

export function HomeServices() {
  return (
    <section className="my-[63px] md:my-[72px] xl:my-[90px]">
      <PageSubheading
        title="Услуги, которые закрывают ваши задачи"
      />

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2 xl:grid-rows-1 xl:gap-[36px]">
        <div className="grid gap-4 xl:gap-5">
          {HOME_SERVICES.map((item) => (
            <ServiceCard key={item.title} title={item.title} description={item.description} />
          ))}
        </div>

        <div className="rounded-[24px] bg-white xl:self-stretch">
          <div className="relative overflow-hidden rounded-[20px] bg-white aspect-square xl:aspect-auto xl:h-full">
            <Image
              src={SERVICES_IMAGE.src}
              alt={SERVICES_IMAGE.alt}
              fill
              sizes="(max-width: 1279px) 100vw, 52vw"
              className={cn("object-cover")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
