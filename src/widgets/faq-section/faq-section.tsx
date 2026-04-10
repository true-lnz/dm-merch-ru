"use client";

import Image from "next/image";

import { cn } from "@/shared/lib/cn";
import { AspectRatio } from "@/shared/ui/acpect-ratio";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";
import { PageSubheader } from "@/shared/ui/page-subheader";

export type FaqItem = {
  question: string;
  answer: string;
};

const FAQ_DESKTOP_IMAGE = {
  src: "/cases/faq/art-kvadrat-bottles.jpg",
  alt: "Фирменные бутылки Арт-Квадрат",
};

const FAQ_MOBILE_DECORATION = {
  src: "/cases/faq/faq-mobile-decor.svg",
  alt: "",
};

const FAQ_TITLE = "Частые вопросы перед запуском проекта";

type FaqSectionProps = {
  items: FaqItem[];
  className?: string;
};

export function FaqSection({
  items,
  className,
}: FaqSectionProps) {
  return (
    <section
      className={cn(
        "grid gap-12 lg:grid-cols-[minmax(0,1fr)_47.715%] lg:items-start",
        className
      )}
    >
      <div>
        <PageSubheader title={FAQ_TITLE} />

        <div className="mt-4 md:mt-5">
          <Accordion className="w-full">
            {items.map((item) => (
              <AccordionItem
                key={item.question}
                value={item.question}
                className="border-b border-[rgba(42,42,42,0.12)]"
              >
                <AccordionTrigger className="py-3 md:py-5">
                  <span className="flex flex-1 items-center font-heading text-[24px] leading-none uppercase text-[#404040] md:text-[28.8px]">
                    {item.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pr-12">
                  <p className="max-w-[680px] pb-4 text-[15px] leading-[1.35] text-[var(--text-muted)] md:pb-5 md:text-[16.2px] whitespace-pre-line">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      <div className="-mx-[var(--layout-side-padding)] relative overflow-hidden bg-transparent lg:mx-0 lg:rounded-[22.5px] lg:bg-white">
        <AspectRatio ratio={2} className="w-full lg:hidden">
          <Image
            src={FAQ_MOBILE_DECORATION.src}
            alt={FAQ_MOBILE_DECORATION.alt}
            fill
            sizes="(max-width: 1023px) 100vw"
            unoptimized
            className="object-contain object-left-bottom"
          />
        </AspectRatio>

        <AspectRatio ratio={1} className="hidden w-full lg:block">
          <Image
            src={FAQ_DESKTOP_IMAGE.src}
            alt={FAQ_DESKTOP_IMAGE.alt}
            fill
            sizes="43vw"
            className="object-cover"
          />
        </AspectRatio>
      </div>
    </section>
  );
}
