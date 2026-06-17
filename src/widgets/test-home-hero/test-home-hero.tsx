import { TestHomeHeroForm } from "./test-home-hero-form";

const HERO_IMAGE_URL = "/home/home-hero-cover.jpg";
const FEATURE_ICON_SRC = "/icons/ic_feature.svg";
const HERO_FEATURES = [
  "Цена ниже рынка на ~ 25% за счет собственного производства и прямой логистики с Турции",
  "Мерч у вас за 14 рабочих дней от идеи и дизайна до готовых вещей у вас в офисе",
  "Отправляем образцы по всей России: покажем материалы, посадку и качество до запуска основного тиража",
] as const;

export function TestHomeHero() {
  return (
    <section className="mt-[35px] mb-[35px] md:mb-[45px]" aria-label="Тестовый hero блок">
      <div className="relative overflow-hidden rounded-[32px] bg-[#0d1017] shadow-[0_24px_80px_rgba(0,0,0,0.18)] md:rounded-[40px] xl:min-h-[760px]">
        <div
          className="absolute inset-0 bg-cover bg-top bg-no-repeat"
          style={{ backgroundImage: `url(${HERO_IMAGE_URL})`, backgroundColor: "#f5f4ef" }}
          aria-hidden="true"
        />
        {/* <div className="absolute inset-0 bg-black/35" aria-hidden="true" /> */}

        <div className="relative z-10 flex min-h-[620px] flex-col justify-end gap-8 p-5 text-white md:min-h-[680px] md:p-8 xl:min-h-[760px] xl:flex-row xl:items-end xl:justify-between xl:gap-10 xl:p-12 2xl:p-14">
          <div className="max-w-[760px] xl:max-w-[560px] 2xl:max-w-[760px]">
            <div className="flex flex-col gap-5 gap-12">
              <div>
                <h1 className="font-heading text-[var(--accent)] whitespace-pre-line text-6xl leading-[0.92] tracking-[0.015em] uppercase">
                  {"Пришлём 3 варианта мерча\n"}
                </h1>
                <span className="font-dm-merch text-[var(--text)] font-regular whitespace-pre-line text-6xl leading-[0.92] tracking-[0.015em] uppercase">
                  {"с ценами и образцами\nза 24 часа"}
                </span>
              </div>
              <p className="max-w-[550px] text-sm leading-[1.35] tracking-[-0.03em] text-[var(--heading)] md:text-xl xl:text-2xl">
                {"С учетом ваших пожеланий и нашего опыта, цены и сроки фиксируем в договоре."}
              </p>
              <TestHomeHeroForm />
            </div>
          </div>

          <div className="grid gap-[10px] md:gap-3 xl:w-[820px] xl:grid-cols-3 xl:self-end">
            {HERO_FEATURES.map((feature) => (
              <div key={feature} className="rounded-[18px] bg-white p-2 text-[#2a2a2a] shadow-[0_18px_60px_rgba(0,0,0,0.18)] md:p-4">
                <div className="flex items-start gap-5">
                  <img
                    src={FEATURE_ICON_SRC}
                    alt=""
                    aria-hidden="true"
                    width={21}
                    height={21}
                    className="feature-icon-rotate-hover mt-[5px] size-[21px] shrink-0"
                  />
                  <p className="text-sm leading-[1.3] tracking-[-0.04em] text-[#2a2a2a] md:text-base">{feature}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
