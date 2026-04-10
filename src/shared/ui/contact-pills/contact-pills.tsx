"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/shared/lib/cn";
import { toast } from "sonner";

type ContactPillsProps = {
  email: string;
  phone: string;
  direction?: "row" | "column";
  className?: string;
  variant?: "default" | "cta" | "menu";
};

function isMobileDevice() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(max-width: 576px), (pointer: coarse)").matches;
}

async function copyToClipboard(value: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  if (typeof document === "undefined") {
    throw new Error("Clipboard is unavailable");
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);

  if (!copied) {
    throw new Error("Copy command failed");
  }
}

const ctaIconClassName =
  "text-white hidden p-[0.55rem] items-center justify-center rounded-[10px] border border-[var(--accent)] bg-[var(--accent)] transition hover:bg-[var(--accent-hover)] lg:inline-flex";

const ctaTextClassName =
  "text-white inline-flex w-full items-center justify-center rounded-[10px] border border-[var(--accent)] bg-transparent px-4 py-[0.55rem] text-sm font-medium text-[var(--accent)] transition lg:w-[170px] lg:whitespace-nowrap lg:border-[transparent] lg:bg-[var(--accent)] lg:px-[0.8rem] lg:py-[0.55rem] lg:text-[0.88rem] lg:font-normal lg:text-white lg:hover:bg-[var(--accent-hover)]";

const defaultTextClassName =
  "text-white inline-flex items-center justify-center whitespace-nowrap rounded-[10px] bg-[var(--accent)] py-[0.55rem] text-[0.88rem] transition hover:bg-[var(--accent-hover)]";

const menuIconClassName =
  "inline-flex size-9 items-center justify-center rounded-[9px] border border-[var(--accent)] bg-[var(--accent)] transition hover:bg-[var(--accent-hover)]";

const menuTextClassName =
  "inline-flex min-h-9 items-center justify-center whitespace-nowrap rounded-[9px] border border-[var(--accent)] bg-[var(--accent)] px-[0.85rem] text-[14px] font-medium tracking-[-0.04em] text-white transition hover:bg-[var(--accent-hover)]";

export function ContactPills({
  email,
  phone,
  direction = "row",
  className,
  variant = "default",
}: ContactPillsProps) {
  const [activePair, setActivePair] = useState<"email" | "phone" | null>(null);
  const isCta = variant === "cta";
  const isMenu = variant === "menu";

  async function handleCopy(
    event: React.MouseEvent<HTMLAnchorElement>,
    value: string,
    successMessage: string,
    errorMessage: string,
    allowNativeAction = false,
  ) {
    if (allowNativeAction) {
      return;
    }

    event.preventDefault();

    try {
      await copyToClipboard(value);
      toast.success(successMessage);
    } catch {
      toast.error(errorMessage);
    }
  }

  const emailHref = `mailto:${email}`;
  const phoneHref = `tel:${phone.replace(/\D+/g, "")}`;
  const contactItems = [
    {
      key: "email" as const,
      href: emailHref,
      label: email,
      iconSrc: "/icons/ic_contact_pill_mail.png",
      ariaLabel: isCta || isMenu ? "Скопировать email" : "Написать на email",
      textClassName: isCta || isMenu ? "px-[0.8rem]" : "px-[0.8rem]",
      onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
        handleCopy(event, email, "Почта скопирована", "Не удалось скопировать почту"),
    },
    {
      key: "phone" as const,
      href: phoneHref,
      label: phone,
      iconSrc: "/icons/ic_contact_pill_phone.png",
      ariaLabel: isCta || isMenu ? "Позвонить или скопировать номер" : "Позвонить",
      textClassName: isCta || isMenu ? "px-[1rem]" : "px-[0.9rem]",
      onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
        handleCopy(
          event,
          phone,
          "Номер скопирован",
          "Не удалось скопировать номер",
          isMobileDevice(),
        ),
    },
  ];

  return (
    <div
      className={cn(
        isCta
          ? "inline-flex flex-col items-start gap-[10px]"
          : isMenu
            ? "inline-flex flex-col items-start gap-[9px]"
            : "inline-flex flex-wrap gap-2",
        !isCta && !isMenu && (direction === "column" ? "flex-col items-start" : "items-center"),
        className,
      )}
    >
      {contactItems.map((item) => {
        const isActive = activePair === item.key;

        return (
          <div
            key={item.key}
            className={cn(
              isCta && "flex w-full items-center gap-[10px] lg:w-auto",
              isMenu && "flex items-center gap-[9px]",
            )}
            onMouseEnter={isCta ? () => setActivePair(item.key) : undefined}
            onMouseLeave={isCta ? () => setActivePair(null) : undefined}
            onFocus={isCta ? () => setActivePair(item.key) : undefined}
            onBlur={isCta ? () => setActivePair(null) : undefined}
          >
            {isCta || isMenu ? (
              <a
                href={item.href}
                onClick={item.onClick}
                className={cn(
                  isCta ? ctaIconClassName : menuIconClassName,
                  isActive && "bg-[var(--accent-hover)]",
                )}
                aria-label={item.ariaLabel}
              >
                <Image src={item.iconSrc} alt="" width={20} height={20} aria-hidden="true" />
              </a>
            ) : null}
            <a
              href={item.href}
              onClick={item.onClick}
              className={cn(
                isCta ? ctaTextClassName : isMenu ? menuTextClassName : defaultTextClassName,
                item.textClassName,
                isCta && isActive && "lg:bg-[var(--accent-hover)]",
              )}
              aria-label={item.ariaLabel}
            >
              {item.label}
            </a>
          </div>
        );
      })}
    </div>
  );
}
