"use client";

import Image from "next/image";
import { useState } from "react";
import { RequestDialog } from "@/features/request-dialog";
import { cn } from "@/shared/lib/cn";
import { Carousel, CarouselContent, CarouselItem } from "@/shared/ui/carousel";
import { PageSubheader } from "@/shared/ui/page-subheader";

type HomeDigestItem = {
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  accent?: boolean;
};

const DIGEST_TITLE = "Весь спектр задач и форматов";

const DIGEST_DESCRIPTION =
  "Собираем мерч-системы под разные бизнес-сценарии: для команды, клиентов, партнеров, мероприятий и повседневной корпоративной среды.";

const DIGEST_ITEMS = [
  {
    title: "Подарки для партнеров",
    description:
      "Подарок, который продолжает деловые отношения и поддерживает впечатление о бренде.",
    image: {
      src: "/cases/ufaoil/blanket-gift.jpg",
      alt: "Подарочный набор для партнера",
    },
  },
  {
    title: "Мерч для мероприятий",
    description:
      "Когда бренд должен запомниться, а команда выглядеть цельно и заметно.",
    image: {
      src: "/cases/mvk/coffee-shirt.jpg",
      alt: "Мерч для мероприятия",
    },
  },
  {
    title: "Мерч для команды",
    description:
      "Для внутренних событий, welcome-наборов и повседневной корпоративной среды.",
    image: {
      src: "/contacts/im_contacts.png",
      alt: "Команда в брендированной одежде",
    },
    accent: true,
  },
  {
    title: "Сувенирная продукция",
    description:
      "Практичные брендированные решения для клиентов, выставок и корпоративных активностей.",
    image: {
      src: "/cases/ufaoil/honey-pump.jpg",
      alt: "Сувенирная продукция",
    },
    accent: true,
  },
  {
    title: "Корпоративная униформа",
    description:
      "Когда команда должна выглядеть собранно, а бренд оставаться узнаваемым в работе.",
    image: {
      src: "/cases/ufaoil/hoodie-team.jpg",
      alt: "Корпоративная униформа",
    },
  },
  {
    title: "Корпоративная спецодежда",
    description:
      "Одежда под реальные условия эксплуатации, которая сохраняет визуальный стандарт компании.",
    image: {
      src: "/cases/faq/art-kvadrat-bottles.jpg",
      alt: "Корпоративная спецодежда",
    },
  },
] satisfies HomeDigestItem[];

function DigestCard({ item }: { item: HomeDigestItem }) {
  return (
    <article
      className={cn(
        "overflow-hidden rounded-[20px] bg-[var(--card-bg)]",
        item.accent && "lg:grid lg:grid-cols-[minmax(280px,0.95fr)_minmax(0,1fr)]",
      )}
    >
      <div className={cn("relative bg-white", item.accent ? "aspect-[413/540]" : "aspect-[412/250]")}>
        <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          sizes="(max-width: 1023px) 100vw, (max-width: 1279px) 50vw, 30vw"
          className="object-cover"
        />
      </div>
      <div className="flex h-full flex-col px-5 py-5 md:px-[30px] md:py-7">
        <h3 className="font-heading text-[32px] leading-[0.95] tracking-[0.015em] text-[var(--heading)] uppercase md:text-[40px]">
          {item.title}
        </h3>
        <p className="mt-3 text-[15px] leading-[1.35] tracking-[-0.03em] text-[var(--text-muted)] md:text-[18px]">
          {item.description}
        </p>
        <div className="mt-auto pt-6">
          <RequestDialog className="lg:w-full" label="Отправить заявку" showCaption={false} />
        </div>
      </div>
    </article>
  );
}

export function HomeDigest() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-14 md:py-20 xl:py-[110px]">
      <PageSubheader
        title={DIGEST_TITLE}
        description={DIGEST_DESCRIPTION}
        descriptionPlacement="side"
        descriptionClassName="xl:max-w-[718px]"
      />

      <div className="mt-8 md:mt-10 xl:hidden">
        <Carousel
          opts={{ align: "start", loop: false }}
          setApi={(api) => {
            if (!api) {
              return;
            }

            api.on("select", () => {
              setActiveIndex(api.selectedScrollSnap());
            });
          }}
        >
          <CarouselContent className="-ml-0">
            {DIGEST_ITEMS.map((item) => (
              <CarouselItem key={item.title} className="basis-full pl-0">
                <DigestCard item={item} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="mt-5 flex justify-center gap-2">
          {DIGEST_ITEMS.map((item, index) => (
            <span
              key={item.title}
              className={cn(
                "h-1.5 rounded-full bg-[var(--border)] transition-all",
                index === activeIndex ? "w-10 bg-[var(--accent)]" : "w-3",
              )}
            />
          ))}
        </div>
      </div>

      <div className="mt-10 hidden gap-7 xl:grid xl:grid-cols-4">
        <div className="contents">
          {DIGEST_ITEMS.slice(0, 3).map((item) => (
            <DigestCard key={item.title} item={item} />
          ))}
        </div>
        <div className="contents">
          {DIGEST_ITEMS.slice(3).map((item) => (
            <DigestCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
