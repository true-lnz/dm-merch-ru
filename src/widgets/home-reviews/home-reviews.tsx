"use client";

import { cn } from "@/shared/lib/cn";
import { SliderControl } from "@/shared/ui/slider-control";
import Image from "next/image";
import { useState } from "react";
import { PageSubheading } from "../../shared/ui/page-subheading";

type HomeReview = {
  company: string;
  name: string;
  role: string;
  quote: string[];
  image: {
    src: string;
    alt: string;
  };
  avatar: {
    src: string;
    alt: string;
  };
};

const TESTIMONIALS_TITLE = "Отзывы наших клиентов";

const TESTIMONIALS = [
  {
    company: "Ресторан «Магадан»",
    name: "Эльнора",
    role: "Управляющий ресторана",
    quote: [
      "Искали подрядчика для формы на фестиваль: важно было, чтобы команда выглядела стильно и премиально, а сотрудникам было удобно работать.",
      "В итоге получили форму, которая поддержала наш имидж и выглядела уместно на мероприятии, без ощущения промо-одежды.",
      "Гости фестиваля отдельно спрашивали, можно ли купить дождевики, и это был лучший индикатор, что мерч действительно получился сильным.",
    ],
    image: {
      src: "/home/reviews/img_home_reviews_1.png",
      alt: "Команда ресторана в мерче",
    },
    avatar: {
      src: "/home/reviews/img_reviews_avatar_1.png",
      alt: "Портрет Эльноры",
    },
  },
  {
    company: "Городское пространство «Арт-квадрат»",
    name: "Айна Федорова",
    role: "Арт-директор",
    quote: [
      'С компанией "Держи Марку!" Арт-КВАДРАТ сотрудничает уже 3 года.',
      "Все наши сложные и креативные запросы решаются оперативно, партнёры всегда готовы предоставить интересные решения, отражающие специфику нашего бренда. И что немаловажно, всегда можно договориться по экономической стороне вопроса.",
      "А когда соответствует качество и цена - что может быть лучше?)",
    ],
    image: {
      src: "/home/reviews/img_home_reviews_2.png",
      alt: "Отзыв клиента Арт-квадрат",
    },
    avatar: {
      src: "/home/reviews/img_reviews_avatar_2.png",
      alt: "Портрет Айны Федоровой",
    },
  },
  {
    company: "Уфанет",
    name: "Лилия",
    role: "Отдел рекламы",
    quote: [
      "Работаем с командой около полугода. За это время совместно реализовали несколько проектов: худи, футболки, бутылки и новогодние подарки.",
      "Ценим, что ребята берут на себя весь процесс целиком — от идеи и проработки деталей до готового результата. В ходе работы всегда присутствует чёткая коммуникация, внимание к деталям и готовность оперативно включаться в задачу, если сроки ограничены.",
      "Несмотря на то, что сотрудничаем мы недолго, за этот период команда уже показала себя как надежный подрядчик, с которым приятно работать и к которому хочется обращаться снова с новыми проектами.",
    ],
    image: {
      src: "/home/reviews/img_home_reviews_3.png",
      alt: "Отзыв клиента Уфанет",
    },
    avatar: {
      src: "/home/reviews/img_reviews_avatar_3.png",
      alt: "Портрет Лилии",
    },
  },
  {
    company: "Уфаойл",
    name: "Анна",
    role: "Отдел маркетинга",
    quote: [
      "Работаем с компанией не первый проект - делали и юбилейные худи, и подарки для сотрудников, и продукцию для партнеров. Для нас было важно, чтобы мерч не выглядел шаблонно, а действительно отражал нашу компанию и ее историю.",
      "Понравилось, что команда вникает в задачи, предлагает решения, а не просто принимает ТЗ. В итоге получили продукцию, которой реально пользуются, а не кладут на полку. Мерч стал частью корпоративной культуры, а не разовой акцией.",
    ],
    image: {
      src: "/home/reviews/img_home_reviews_4.png",
      alt: "Отзыв клиента Уфаойл",
    },
    avatar: {
      src: "/home/reviews/img_reviews_avatar_4.png",
      alt: "Портрет Анны",
    },
  },
  {
    company: "Тихий дом",
    name: "Дмитрий",
    role: "Бренд-менеджер",
    quote: [
      "Заказывали фирменный набор для наших клиентов и партнёров. Нам хотелось сделать не просто сувенир, а действительно приятный и аккуратный подарок, который будет хорошо выглядеть, вызывать правильное впечатление и которым захочется пользоваться.",
      "С командой было легко и спокойно работать: помогли с выбором, подсказали по материалам и нанесению, внимательно отнеслись к деталям и всё сделали в срок. В итоге получился именно такой набор, как мы и хотели, — качественный, цельный и достойный. Такие вещи приятно дарить от имени компании, потому что они действительно отражают отношение к людям и к своему бренду.",
    ],
    image: {
      src: "/home/reviews/img_home_reviews_1.png",
      alt: "Отзыв клиента Тихий дом",
    },
    avatar: {
      src: "/home/reviews/img_reviews_avatar_5.png",
      alt: "Портрет Дмитрия",
    },
  },
] satisfies HomeReview[];

export function HomeReviews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = TESTIMONIALS[activeIndex];
  const isFirstSlide = activeIndex === 0;
  const isLastSlide = activeIndex === TESTIMONIALS.length - 1;

  return (
    <section className="my-[43px] md:my-[55px]">
      <PageSubheading title={TESTIMONIALS_TITLE} />

      <div className="mt-8 grid lg:grid-cols-12">
        <div className="relative min-h-[320px] overflow-hidden rounded-[18px] bg-white md:rounded-[22.5px] lg:col-span-7 lg:min-h-[616px]">
          {TESTIMONIALS.map((item, index) => (
            <div
              key={item.company}
              className={cn(
                "absolute inset-0 transition-opacity duration-500",
                index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              <Image src={item.image.src} alt={item.image.alt} fill sizes="(max-width: 1023px) 100vw, 58vw" className="object-cover object-top" />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-[18px] rounded-[18px] bg-[var(--accent)] bg-[url('/home/img_card_cover_home_reviews.svg')] bg-cover bg-center p-[18px] text-white md:gap-[36px] md:rounded-[22.5px] md:p-[27px] lg:col-span-5">
          <div className="flex gap-[18px] md:gap-[22.5px]">
            <div className="relative size-[63px] md:size-[125px] overflow-hidden rounded-[9px] bg-white">
              <Image unoptimized src={activeItem.avatar.src} alt={activeItem.avatar.alt} fill sizes="70px" className="object-cover" />
            </div>
            <div>
              <p className="font-heading text-3xl leading-none uppercase md:text-4xl xl:text-5xl">{activeItem.name}</p>
              <p className="mt-[10px] text-[9px] leading-[1.35] tracking-[-0.03em] text-white/80 md:text-lg">{activeItem.role}</p>
            </div>
          </div>

          <div className="flex flex-col gap-[9px]">
            <h3 className="font-heading text-3xl leading-none uppercase md:text-4xl">{activeItem.company}</h3>
            <div className="space-y-4 text-xs leading-[1.35] tracking-[-0.03em] text-white/80 sm:text-sm md:text-lg">
              {activeItem.quote.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <SliderControl
            className="mt-auto"
            onPrevClick={() => setActiveIndex((currentIndex) => currentIndex - 1)}
            onNextClick={() => setActiveIndex((currentIndex) => currentIndex + 1)}
            prevDisabled={isFirstSlide}
            nextDisabled={isLastSlide}
            prevAriaLabel={`Предыдущий отзыв (${activeIndex + 1} из ${TESTIMONIALS.length})`}
            nextAriaLabel={`Следующий отзыв (${activeIndex + 1} из ${TESTIMONIALS.length})`}
          />
        </div>
      </div>
    </section>
  );
}
