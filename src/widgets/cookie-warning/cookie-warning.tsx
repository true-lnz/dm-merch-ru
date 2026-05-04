"use client";

import { useEffect, useState } from "react";

const COOKIE_NAME = "hide-cookie";
const COOKIE_TEXT = "Используем куки, это делает удобнее вашу работу с сайтом";
const COOKIE_BUTTON_LABEL = "Хорошо";
const COOKIE_LIFETIME_DAYS = 30;

function hasCookie(name: string) {
  return document.cookie.split(";").some((part) => part.trim().startsWith(`${name}=`));
}

function setCookie(name: string, value: string, expiresInDays: number) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);

  document.cookie = `${name}=${value}; expires=${expiresAt.toUTCString()}; path=/`;
}

export function CookieWarning() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setIsVisible(!hasCookie(COOKIE_NAME));
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  const handleAccept = () => {
    setCookie(COOKIE_NAME, "true", COOKIE_LIFETIME_DAYS);
    setIsVisible(false);
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-1001 md:bottom-[16px]">
      <div className="pointer-events-auto ml-auto flex w-full max-w-[739px] flex-col gap-4 rounded-none md:rounded-[9px] bg-[var(--accent)] shadow-[0_20px_45px_rgba(255,255,255,0.15)] px-4 py-4 md:min-h-[80px] md:flex-row md:items-center md:justify-between md:gap-6 md:px-[25px] md:py-5">
        <p className="m-0 max-w-[540px] text-base leading-[1.2] tracking-[-0.04em] text-white">{COOKIE_TEXT}</p>
        <button
          type="button"
          onClick={handleAccept}
          className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center self-start rounded-[7px] bg-[#f5f4ef] px-5 text-lg leading-normal font-medium tracking-[-0.04em] text-[#404040] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:w-[106px] md:self-auto"
        >
          {COOKIE_BUTTON_LABEL}
        </button>
      </div>
    </div>
  );
}
