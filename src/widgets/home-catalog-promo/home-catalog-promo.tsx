import { cn } from "@/shared/lib/cn";
import { buttonVariants } from "@/shared/ui/button";
import Image from "next/image";
import Link from "next/link";

const PROMO_COLLAGE = [
  {
    src: "/home/partner-products/01-futbolki-i-polo.webp",
    alt: "Футболки и поло для брендирования",
    className: "left-0 top-5 z-20 w-[34%] rotate-[-10deg] md:left-[6%] md:top-[8%] md:w-[28%]",
  },
  {
    src: "/home/partner-products/09-elektronika.webp",
    alt: "Электроника для брендирования",
    className: "left-[24%] top-0 z-10 w-[42%] rotate-[7deg] md:left-[28%] md:top-[2%] md:w-[34%]",
  },
  {
    src: "/home/partner-products/12-pakety.webp",
    alt: "Пакеты для брендирования",
    className: "right-0 top-[18%] z-30 w-[35%] rotate-[10deg] md:right-[4%] md:top-[16%] md:w-[28%]",
  },
  {
    src: "/home/partner-products/08-sumki-i-ryukzaki.webp",
    alt: "Сумки и рюкзаки для брендирования",
    className: "left-[10%] bottom-0 z-10 w-[44%] rotate-[-4deg] md:left-[12%] md:bottom-[2%] md:w-[34%]",
  },
  {
    src: "/home/partner-products/11-suvenirnaya-produkciya.webp",
    alt: "Сувенирная продукция для брендирования",
    className: "right-[8%] bottom-[2%] z-20 w-[38%] rotate-[8deg] md:right-[12%] md:bottom-[4%] md:w-[30%]",
  },
] as const;

export function HomeCatalogPromo() {
  return (
    <section className="my-[35px] md:my-[45px]">
      <Link
        href="/partner-catalog"
        className="group relative block overflow-hidden rounded-[18px] md:rounded-[22.5px] bg-[var(--accent)] text-white"
        aria-label="Перейти в каталог продукции"
      >
        <div className="absolute inset-0 bg-[var(--accent)]" />
        <div className="absolute inset-y-0 left-[44%] hidden w-px bg-white/14 xl:block" />
        <div className="absolute -left-16 top-8 h-40 w-40 rounded-full bg-white/10 blur-3xl md:h-56 md:w-56" />
        <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-white/10 blur-3xl md:h-72 md:w-72" />

        <div className="relative grid min-h-[25rem] grid-cols-1 gap-8 p-[18px] md:min-h-[31rem] md:p-[30px] xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:items-center xl:gap-10 xl:p-[42px]">
          <div className="flex flex-col justify-between gap-8">
            <div className="space-y-4">
              <h2 className="max-w-[12ch] font-heading text-[2.5rem] leading-[0.92] tracking-[0.02em] text-white md:text-[4rem] xl:text-6xl">
                Брендируйте больше. Выбирайте быстрее.
              </h2>
              <p className="max-w-[34rem] text-sm leading-[1.45] tracking-[-0.02em] text-white/78 md:text-lg xl:text-xl">
                В каталоге продукции собраны тысячи позиций для промо, welcome pack&apos;ов, мероприятий и корпоративных наборов. Сразу переходите к
                ассортименту и подбирайте решения под задачу, бюджет и сроки.
              </p>
            </div>

            <div className="flex">
              <span className={cn(buttonVariants({ variant: "white" }), "w-full md:w-auto md:min-w-[18rem] group-hover:bg-[#eef4ff]")}>
                Перейти в каталог продукции
              </span>
            </div>
          </div>

          <div className="relative min-h-[17rem] overflow-hidden rounded-[16px] border border-white/12 bg-white/7 backdrop-blur-[6px] md:min-h-[22rem] xl:min-h-[25rem]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,_rgba(255,255,255,0.16),_transparent_36%),linear-gradient(180deg,_rgba(255,255,255,0.06)_0%,_rgba(255,255,255,0)_100%)]" />
            {PROMO_COLLAGE.map((item) => (
              <div
                key={item.src}
                className={cn(
                  "absolute aspect-square overflow-hidden rounded-[16px] border border-white/12 bg-white shadow-[0_24px_60px_rgba(6,21,52,0.38)]",
                  item.className,
                )}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 1279px) 50vw, 28vw"
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>
            ))}
          </div>
        </div>
      </Link>
    </section>
  );
}
