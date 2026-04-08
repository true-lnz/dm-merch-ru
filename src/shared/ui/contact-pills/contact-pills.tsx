"use client";

import { cn } from "@/shared/lib/cn";
import { toast } from "sonner";

type ContactPillsProps = {
  email: string;
  phone: string;
  direction?: "row" | "column";
  className?: string;
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

export function ContactPills({
  email,
  phone,
  direction = "row",
  className,
}: ContactPillsProps) {
  async function handleEmailClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    try {
      await copyToClipboard(email);
      toast.success("Почта скопирована");
    } catch {
      toast.error("Не удалось скопировать почту");
    }
  }

  async function handlePhoneClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (isMobileDevice()) {
      return;
    }

    event.preventDefault();

    try {
      await copyToClipboard(phone);
      toast.success("Номер скопирован");
    } catch {
      toast.error("Не удалось скопировать номер");
    }
  }

  return (
    <div
      className={cn(
        "inline-flex flex-wrap gap-2",
        direction === "column" ? "flex-col items-start" : "items-center",
        className,
      )}
    >
      <a
        href={`mailto:${email}`}
        onClick={handleEmailClick}
        className="cta-link inline-flex items-center justify-center whitespace-nowrap rounded-[10px] bg-[var(--accent)] px-[0.8rem] py-[0.55rem] text-[0.88rem] transition hover:bg-[var(--accent-hover)]"
        aria-label="Написать на email"
      >
        {email}
      </a>
      <a
        href={`tel:${phone.replace(/\D+/g, "")}`}
        onClick={handlePhoneClick}
        className="cta-link inline-flex items-center justify-center whitespace-nowrap rounded-[10px] bg-[var(--accent)] px-[0.9rem] py-[0.55rem] text-[0.88rem] transition hover:bg-[var(--accent-hover)]"
        aria-label="Позвонить"
      >
        {phone}
      </a>
    </div>
  );
}
