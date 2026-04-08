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

type FaqSectionProps = {
  title: string;
  items: FaqItem[];
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  className?: string;
};

export function FaqSection({
  title,
  items,
  image,
  className,
}: FaqSectionProps) {
  return (
    <section className={cn("grid gap-12 lg:grid-cols-[minmax(0,1fr)_47.715%] lg:items-start", className)}>
      <div>
        <PageSubheader title={title} />

        <div className="mt-4 md:mt-5">
          <Accordion
            defaultValue={items[0] ? [items[0].question] : []}
            className="w-full"
          >
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
                  <p className="max-w-[680px] pb-4 text-[15px] leading-[1.35] text-[var(--text-muted)] md:pb-5 md:text-[16.2px]">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[22.5px] bg-white">
        <AspectRatio ratio={1} className="w-full">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 43vw"
            className="object-cover"
          />
        </AspectRatio>
      </div>
    </section>
  );
}
