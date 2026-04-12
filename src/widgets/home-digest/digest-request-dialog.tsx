"use client";

import { cn } from "@/shared/lib/cn";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/shared/ui/dialog";
import { RequestForm } from "@/shared/ui/request-form";
import { XIcon } from "lucide-react";

type DigestRequestDialogProps = {
  className?: string;
  label: string;
  variant?: "accent" | "light";
};

export function DigestRequestDialog({
  className,
  label,
  variant = "accent",
}: DigestRequestDialogProps) {
  const isLight = variant === "light";

  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          "group flex h-[52px] w-full cursor-pointer items-center justify-center rounded-[8px] px-6 text-center text-[16px] font-semibold tracking-[-0.02em] transition-colors duration-200",
          isLight
            ? "bg-[#f5f4ef] text-[var(--accent)] hover:bg-white"
            : "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]",
          className,
        )}
      >
        <span>{label}</span>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="block h-screen w-screen max-w-none overflow-y-auto rounded-none bg-[#f5f4ef] p-[27px] md:p-[72px] sm:h-auto sm:rounded-[20px] md:grid md:w-[50vw] md:max-w-[50vw] xl:bg-[#ecebe6]"
      >
        <div className="mb-7 flex items-start justify-between gap-4 xl:mb-8">
          <DialogTitle className="font-heading text-4xl md:text-5xl xl:text-6xl leading-[0.95] tracking-[0.015em] uppercase text-[var(--heading)]">
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
          privacyCheckboxId="digest-request-dialog-privacy"
          formClassName="space-y-3 xl:space-y-4"
        />
      </DialogContent>
    </Dialog>
  );
}
