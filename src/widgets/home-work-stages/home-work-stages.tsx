import Image from "next/image";
import { PageSubheader } from "@/shared/ui/page-subheader";

type HomeStage = {
  index: string;
  title: string;
  description: string;
};

const WORK_STAGES_TITLE = "Этапы работ";

const WORK_STAGES_DESCRIPTION =
  "Прозрачный маршрут проекта: фиксируем шаги, сроки и точки согласования до запуска производства.";

const WORK_STAGES = [
  {
    index: "01",
    title: "Заявка и бриф, 1 день",
    description:
      "Собираем задачу, фиксируем сроки, бюджет и контекст использования, чтобы сразу отбросить лишние сценарии.",
  },
  {
    index: "02",
    title: "Дизайн-макет и согласование, 3-5 дней",
    description:
      "Разрабатываем несколько направлений, подбираем ткани и нанесения, бесплатно вносим правки и при необходимости отправляем образцы.",
  },
  {
    index: "03",
    title: "Производство, 10-14 дней",
    description:
      "После утверждения запускаем заказ и контролируем раскрой, пошив, нанесение и финальную сборку изделий.",
  },
  {
    index: "04",
    title: "Доставка, 2-4 дня",
    description:
      "Перед отправкой проводим финальную проверку качества и доставляем мерч в согласованные сроки по России.",
  },
] satisfies HomeStage[];

export function HomeWorkStages() {
  return (
    <section className="py-14 md:py-20 xl:py-[110px]">
      <div className="relative overflow-hidden rounded-[24px] bg-[var(--accent)] px-5 py-6 text-white md:px-8 md:py-8 xl:px-[45px] xl:py-[44px]">
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between opacity-20">
          <Image src="/logo-dm-minimized.svg" alt="" width={220} height={40} aria-hidden="true" />
          <Image src="/logo-dm-minimized.svg" alt="" width={220} height={40} aria-hidden="true" />
          <Image src="/logo-dm-minimized.svg" alt="" width={220} height={40} aria-hidden="true" className="hidden xl:block" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between opacity-20">
          <Image src="/logo-dm-minimized.svg" alt="" width={220} height={40} aria-hidden="true" />
          <Image src="/logo-dm-minimized.svg" alt="" width={220} height={40} aria-hidden="true" />
          <Image src="/logo-dm-minimized.svg" alt="" width={220} height={40} aria-hidden="true" className="hidden xl:block" />
        </div>

        <div className="relative z-10">
          <PageSubheader
            title={WORK_STAGES_TITLE}
            description={WORK_STAGES_DESCRIPTION}
            descriptionPlacement="side"
            titleClassName="text-white"
            descriptionClassName="text-white/70 xl:max-w-[313px]"
          />

          <div className="mt-8 grid gap-4 xl:mt-[82px] xl:grid-cols-4">
            {WORK_STAGES.map((item) => (
              <article key={item.index} className="rounded-[20px] bg-white px-5 py-5 text-[var(--heading)] md:px-6 md:py-6">
                <p className="font-heading text-[32px] leading-none uppercase text-[var(--accent)] md:text-[40px]">{item.index}</p>
                <h3 className="mt-5 font-heading text-[28px] leading-[0.95] uppercase md:text-[34px]">{item.title}</h3>
                <p className="mt-4 text-[15px] leading-[1.35] tracking-[-0.03em] text-[var(--text-muted)]">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
