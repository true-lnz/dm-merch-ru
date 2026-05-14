"use client";

import type { FaqItem, FaqSectionImage } from "@/shared/config/faq";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui/accordion";
import { AspectRatio } from "@/shared/ui/acpect-ratio";
import Image from "next/image";

import { PageSubheading } from "../../../shared/ui/page-subheading";

type FaqSectionContentProps = {
  image: FaqSectionImage;
  items: FaqItem[];
  title: string;
};

export function FaqSectionContent({ image, items, title }: FaqSectionContentProps) {
  return (
    <section className="my-[35px] md:my-[45px] grid gap-8 lg:gap-10 lg:grid-cols-[minmax(0,1fr)_47.715%] lg:items-start">
      <div>
        <PageSubheading title={title} />

        <div className="mt-4 md:mt-5">
          <Accordion className="w-full">
            {items.map((item) => (
              <AccordionItem key={item.question} value={item.question} className="border-b border-[rgba(42,42,42,0.12)]">
                <AccordionTrigger className="py-3 md:py-5">
                  <span className="flex flex-1 items-center font-heading text-lg md:2xl xl:text-3xl leading-none uppercase text-[#404040]">
                    {item.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pr-12">
                  <p className="max-w-[680px] whitespace-pre-line pb-4 text-sm md:text-base leading-[1.35] text-[var(--text-muted)] md:pb-5">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      <div className="-mx-[var(--layout-side-padding)] relative overflow-hidden bg-transparent lg:mx-0 rounded-[18px] md:rounded-[22.5px] lg:bg-white">
        <AspectRatio ratio={2} className="w-full lg:hidden">
          <Image
            src={image.mobileUrl}
            alt={image.alt}
            fill
            sizes="(max-width: 1023px) 100vw"
            className="object-contain object-left-bottom"
          />
        </AspectRatio>

        <AspectRatio ratio={1} className="hidden w-full lg:block">
          <Image src={image.url} alt={image.alt} fill sizes="43vw" className="object-cover image-hover-scale" />
        </AspectRatio>
      </div>
    </section>
  );
}
