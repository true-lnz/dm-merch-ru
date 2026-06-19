import { TestHomeHeroFeature } from "./test-home-hero-feature";
import { TestHomeHeroForm } from "./test-home-hero-form";

const HERO_IMAGE_URL = "/home/home-hero-cover7.png";

export function TestHomeHero() {
  return (
    <section className="mt-[35px] mb-[35px] md:mb-[45px]" aria-label="Тестовый hero блок">
      <div className="relative aspect-[3/5] overflow-hidden rounded-[32px] bg-[#D9D9D9] shadow-none md:aspect-[18/9] md:rounded-[40px] xl:aspect-[21/9]">
        <div
          className="absolute inset-0 bg-cover !bg-[#D9D9D9] bg-position-[90%_0rem] md:bg-position-[center_45%] xl:bg-position-[center_75%] bg-no-repeat"
          style={{ backgroundImage: `url(${HERO_IMAGE_URL})`, backgroundColor: "#f5f4ef" }}
          aria-hidden="true"
        />
        {/* <div className="absolute inset-0 bg-black/35" aria-hidden="true" /> */}

        <div className="relative z-10 flex h-full flex-col justify-start gap-8 p-5 text-white md:flex-row md:items-stretch md:p-8 xl:px-12 xl:py-18 2xl:px-14 2xl:py-20">
          <div className="flex w-full max-w-[480px] flex-1 md:h-full md:w-[40%] md:max-w-none md:flex-none">
            <div className="flex w-full flex-col justify-between gap-5 md:gap-6 2xl:gap-12">
              <h1 className="mt-4 md:mt-0">
                <span className="sr-only">Пришлём 3 варианта мерча с ценами и образцами за 24 часа</span>
                <img src="/home/h1-home-hero.svg" alt="" aria-hidden="true" width={598} height={182} className="block h-auto w-full" />
              </h1>
              <div className="flex flex-col gap-5">
                <p className="hidden max-w-[480px] text-sm leading-[1.35] tracking-[-0.03em] text-[var(--heading)] md:block md:text-lg xl:text-2xl">
                  {"С учетом ваших пожеланий и нашего опыта, цены и сроки фиксируем в договоре."}
                </p>
                <TestHomeHeroForm />
              </div>
            </div>
          </div>
          <div className="hidden flex-1 items-center justify-start md:h-full min-[1600px]:flex">
            <TestHomeHeroFeature />
          </div>
        </div>
      </div>
    </section>
  );
}
