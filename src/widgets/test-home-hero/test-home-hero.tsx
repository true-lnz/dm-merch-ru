import { TestHomeHeroForm } from "./test-home-hero-form";

const HERO_IMAGE_URL = "https://storage.yandexcloud.net/cdn-dm-merch/media/home-hero-cover3.webp";
const FEATURE_ICON_SRC = "/icons/ic_feature.svg";
const HERO_FEATURES = [
  "Цена ниже рынка на ~ 25% за счет собственного производства и прямой логистики с Турции",
  "Мерч у вас за 14 рабочих дней от идеи и дизайна до готовых вещей у вас в офисе",
  "Отправляем образцы по всей России: покажем материалы, посадку и качество",
] as const;

export function TestHomeHero() {
  return (
    <section className="mt-[35px] mb-[35px] md:mb-[45px]" aria-label="Тестовый hero блок">
      <div className="relative overflow-hidden rounded-[32px] bg-[#D9D9D9] shadow-none md:rounded-[40px] md:shadow-[0_24px_80px_rgba(0,0,0,0.18)] xl:min-h-[700px] 2xl:min-h-[760px]">
        <div
          className="absolute inset-0 bg-cover !bg-[#D9D9D9] bg-position-[90%_0rem] xl:bg-position-[center_75%] bg-no-repeat"
          style={{ backgroundImage: `url(${HERO_IMAGE_URL})`, backgroundColor: "#f5f4ef" }}
          aria-hidden="true"
        />
        {/* <div className="absolute inset-0 bg-black/35" aria-hidden="true" /> */}

        <div className="relative z-10 flex min-h-[480px] flex-col justify-end gap-8 p-5 text-white max-[1024px]:justify-start md:min-h-[680px] md:p-8 xl:min-h-[700px] 2xl:min-h-[760px] xl:flex-row xl:items-end xl:justify-between xl:gap-10 xl:p-12 2xl:p-14">
          <div className="max-w-[480px] max-[1024px]:flex max-[1024px]:w-full max-[1024px]:flex-1 xl:max-w-[620px] 2xl:max-w-[760px]">
            <div className="flex flex-col gap-5 md:gap-6 2xl:gap-12 max-[1024px]:justify-between max-[767px]:min-h-[380px] md:max-[1024px]:min-h-[616px]">
              <div className="mt-4 md:mt-0">
                <h1 className="font-heading text-[var(--accent)] whitespace-nowrap text-3xl leading-[0.95] tracking-[0.015em] uppercase md:text-[64px] 2xl:text-7xl">
                  {"Пришлём 3 варианта мерча"}
                </h1>
                <span className="font-dm-merch text-[var(--text)] whitespace-pre-line text-3xl leading-[0.95] tracking-[0.015em] uppercase md:text-[64px] 2xl:text-7xl">
                  {"с ценами и образцами\nза 24 часа"}
                </span>
              </div>
              <div className="contents max-[1024px]:flex max-[1024px]:flex-col max-[1024px]:gap-5">
                <p className="hidden max-w-[480px] text-sm leading-[1.35] tracking-[-0.03em] text-[var(--heading)] md:block md:text-lg xl:text-2xl">
                  {"С учетом ваших пожеланий и нашего опыта, цены и сроки фиксируем в договоре."}
                </p>
                <TestHomeHeroForm />
              </div>
            </div>
          </div>

          <div className="hidden gap-[10px] 2xl:grid 2xl:w-[820px] 2xl:grid-cols-3 2xl:self-end 2xl:gap-3">
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
