"use client";

import { cn } from "@/shared/lib/cn";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/shared/ui/dialog";
import { RequestForm } from "@/shared/ui/request-form";
import { XIcon } from "lucide-react";
import Image from "next/image";
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from "react";
import { forwardRef, useId } from "react";

type RequestDialogButtonProps = Omit<ComponentPropsWithoutRef<"button">, "children"> & {
  label?: ReactNode;
  caption?: ReactNode;
  showCaption?: boolean;
  iconSrc?: string;
  iconContainerClassName?: string;
  iconClassName?: string;
};

type RequestDialogProps = {
  children: ReactElement;
  privacyCheckboxId?: string;
};

const DEFAULT_LABEL = "Обсудить задачу";
const DEFAULT_CAPTION = "Минимальный бюджет - от 50 000 ₽";
const DEFAULT_ICON_SRC = "/icons/ic_link_arrow_button.svg";

export const RequestDialogButton = forwardRef<HTMLButtonElement, RequestDialogButtonProps>(
  function RequestDialogButton(
    {
      className,
      label = DEFAULT_LABEL,
      caption = DEFAULT_CAPTION,
      showCaption = true,
      iconSrc = DEFAULT_ICON_SRC,
      iconContainerClassName,
      iconClassName,
      type,
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={cn(
          "group cursor-pointer flex h-[60px] w-full lg:w-auto items-center justify-between gap-4 rounded-[9px] bg-[var(--accent)] px-3 text-white transition-colors duration-200 hover:bg-white hover:text-[var(--accent)] xl:px-5",
          className,
        )}
        {...props}
      >
        <span className="flex min-w-0 flex-col items-start">
          <span className="text-base md:text-lg xl:text-xl text-nowrap leading-[1.3] tracking-[-0.04em]">
            {label}
          </span>
          {showCaption ? (
            <span className="mt-[2px] hidden text-[9px] md:text-xs text-nowrap leading-[1.3] tracking-[-0.04em] text-white/50 transition-colors duration-200 group-hover:text-[var(--accent)]/60 lg:block">
              {caption}
            </span>
          ) : null}
        </span>
        <span
          className={cn(
            "inline-flex size-10 shrink-0 items-center justify-center rounded-[5px] bg-white transition-colors duration-200 group-hover:bg-[var(--accent)] xl:size-[39.52px] xl:rounded-[4px]",
            iconContainerClassName,
          )}
        >
          <Image
            src={iconSrc}
            alt=""
            width={16}
            height={16}
            aria-hidden="true"
            className={cn(
              "size-[17px] transition-[transform,filter] duration-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:brightness-0 group-hover:invert xl:size-[13.55px]",
              iconClassName,
            )}
          />
        </span>
      </button>
    );
  },
);

export function RequestDialog({
  children,
  privacyCheckboxId,
}: RequestDialogProps) {
  const generatedPrivacyCheckboxId = useId();
  const resolvedPrivacyCheckboxId = privacyCheckboxId ?? `request-dialog-privacy-${generatedPrivacyCheckboxId}`;

  return (
    <Dialog>
      <DialogTrigger render={children} />

      <DialogContent
        showCloseButton={false}
        className="block h-screen w-screen max-w-none overflow-y-auto rounded-none bg-[#f5f4ef] p-[27px] sm:p-[72px] sm:h-auto md:grid md:w-[50vw] md:max-w-[50vw] sm:rounded-[22.5px] xl:bg-[#ecebe6]"
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
          privacyCheckboxId={resolvedPrivacyCheckboxId}
          formClassName="space-y-3 xl:space-y-4"
        />
      </DialogContent>
    </Dialog>
  );
}
