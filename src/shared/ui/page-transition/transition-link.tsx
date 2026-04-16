"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { type ComponentProps, type MouseEvent, forwardRef } from "react";
import { usePageTransition, type TransitionSource } from "./page-transition-provider";

type TransitionLinkProps = Omit<ComponentProps<typeof Link>, "onClick"> & {
  source: Exclude<TransitionSource, "history">;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

function isModifiedEvent(event: MouseEvent<HTMLAnchorElement>) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

export const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  ({ source, href, onClick, ...props }, ref) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { startNavigationTransition } = usePageTransition();

    return (
      <Link
        {...props}
        href={href}
        ref={ref}
        onClick={(event) => {
          onClick?.(event);

          if (
            event.defaultPrevented ||
            event.button !== 0 ||
            isModifiedEvent(event) ||
            props.target === "_blank"
          ) {
            return;
          }

          const currentPath = `${pathname}${searchParams.size > 0 ? `?${searchParams.toString()}` : ""}`;
          const targetUrl = typeof href === "string" ? href : href.toString();
          const currentUrl = targetUrl.startsWith("/") ? currentPath : window.location.href;

          if (targetUrl === currentUrl) {
            return;
          }

          startNavigationTransition(source);
        }}
      />
    );
  },
);

TransitionLink.displayName = "TransitionLink";
