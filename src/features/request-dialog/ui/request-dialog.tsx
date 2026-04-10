"use client";

import Image from "next/image";
import { XIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/shared/ui/dialog";
import { cn } from "@/shared/lib/cn";
import { RequestForm } from "@/shared/ui/request-form";

type RequestDialogProps = {
  className?: string;
};

export function RequestDialog({ className }: RequestDialogProps) {
  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          "group cursor-pointer flex h-[60px] items-center justify-between gap-4 rounded-[10px] bg-[var(--accent)] px-5 text-white transition-colors duration-200 hover:bg-white hover:text-[var(--accent)] xl:h-[72px] xl:px-3",
          className,
        )}
      >
        <span className="flex min-w-0 flex-col items-start gap-2 ">
          <span className="text-[16px] leading-[1.3] tracking-[-0.04em] xl:text-[19px]">
            Обсудить задачу
          </span>
          <span className="mt-[2px] hidden text-[9px] leading-[1.3] tracking-[-0.04em] text-white/50 transition-colors duration-200 group-hover:text-[var(--accent)]/60 xl:block xl:text-[11px]">
            Минимальный бюджет - от 50 000 ₽
          </span>
        </span>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-[4px] bg-white transition-colors duration-200 group-hover:bg-[var(--accent)] xl:size-12 xl:rounded-[5px]">
          <Image
            src="/contacts/contacts-cta-arrow.svg"
            alt=""
            width={16}
            height={16}
            aria-hidden="true"
            className="size-3.5 transition-[transform,filter] duration-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:brightness-0 group-hover:invert xl:size-4"
          />
        </span>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="block h-screen w-screen max-w-none overflow-y-auto rounded-none bg-[#f5f4ef] p-[30px] sm:h-auto md:grid md:w-[50vw] md:max-w-[50vw] sm:rounded-[15px] xl:bg-[#ecebe6]"
      >
        <div className="mb-7 flex items-start justify-between gap-4 xl:mb-8">
          <DialogTitle className="font-heading text-[40px] leading-[0.95] tracking-[0.015em] uppercase text-[var(--heading)] md:text-[52px] xl:text-[64px]">
            Обсудим задачу
            <br />
            и рассчитаем проект
          </DialogTitle>

          <DialogClose
            className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center text-[#b3b3b3] transition-colors hover:text-[#2a2a2a] xl:mt-1 xl:size-10"
            aria-label="Закрыть модалку"
          >
            <XIcon className="size-5 xl:size-7" strokeWidth={2.5} />
          </DialogClose>
        </div>

        <RequestForm
          includeEmail={false}
          privacyCheckboxId="request-dialog-privacy"
          formClassName="space-y-3 xl:space-y-4"
        />
      </DialogContent>
    </Dialog>
  );
}
