"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type TransitionSource = "header" | "menu" | "history";
type TransitionPhase = "idle" | "leaving" | "entering";

type PageTransitionContextValue = {
  startNavigationTransition: (source: TransitionSource) => void;
};

const PageTransitionContext = createContext<PageTransitionContextValue | null>(null);

function useReducedMotion() {
  const [isReduced, setIsReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setIsReduced(media.matches);

    update();
    media.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  return isReduced;
}

export function PageTransitionProvider({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;
  const isReducedMotion = useReducedMotion();
  const timersRef = useRef<number[]>([]);
  const previousRouteKeyRef = useRef(routeKey);

  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [pendingRouteSettled, setPendingRouteSettled] = useState(false);
  const isScrollLocked = isVisible || phase !== "idle";

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    timersRef.current = [];
  }, []);

  const schedule = useCallback((delayMs: number, callback: () => void) => {
    const timerId = window.setTimeout(callback, delayMs);
    timersRef.current.push(timerId);
  }, []);

  const finishTransition = useCallback(() => {
    clearTimers();
    setIsVisible(false);
    setPhase("idle");
    setProgress(0);
    setPendingRouteSettled(false);
  }, [clearTimers]);

  const notifyRouteSettled = useCallback(() => {
    clearTimers();
    setPendingRouteSettled(false);
    setProgress(100);
    setPhase("entering");

    schedule(isReducedMotion ? 60 : 240, finishTransition);
  }, [clearTimers, finishTransition, isReducedMotion, schedule]);

  const startNavigationTransition = useCallback(
    (source: TransitionSource) => {
      void source;
      if (pendingRouteSettled) {
        return;
      }

      clearTimers();
      setIsVisible(true);
      setPhase("leaving");
      setProgress(30);
      setPendingRouteSettled(true);

      if (isReducedMotion) {
        schedule(60, () => setProgress(60));
        schedule(700, finishTransition);
        return;
      }

      schedule(180, () => setProgress((value) => Math.max(value, 50)));
      schedule(420, () => setProgress((value) => Math.max(value, 60)));
      schedule(2000, finishTransition);
    },
    [clearTimers, finishTransition, isReducedMotion, pendingRouteSettled, schedule],
  );

  useEffect(() => {
    if (!pendingRouteSettled) {
      previousRouteKeyRef.current = routeKey;
      return;
    }

    if (previousRouteKeyRef.current !== routeKey) {
      previousRouteKeyRef.current = routeKey;
      schedule(0, notifyRouteSettled);
    }
  }, [notifyRouteSettled, pendingRouteSettled, routeKey, schedule]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) {
        return;
      }

      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      if (
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        anchor.getAttribute("rel") === "external"
      ) {
        return;
      }

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) {
        return;
      }

      const nextUrl = new URL(anchor.href, window.location.href);
      if (nextUrl.origin !== window.location.origin) {
        return;
      }

      const currentRouteKey = `${window.location.pathname}${window.location.search}`;
      const nextRouteKey = `${nextUrl.pathname}${nextUrl.search}`;
      if (currentRouteKey === nextRouteKey) {
        return;
      }

      startNavigationTransition("header");
    };

    const handlePopState = () => {
      startNavigationTransition("history");
    };

    document.addEventListener("click", handleDocumentClick, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [startNavigationTransition]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  useLayoutEffect(() => {
    const syncScrollbarOffset = () => {
      const scrollbarOffset = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
      document.documentElement.style.setProperty("--page-transition-scrollbar-offset", `${scrollbarOffset}px`);
    };

    if (isScrollLocked) {
      syncScrollbarOffset();
      window.addEventListener("resize", syncScrollbarOffset);
    } else {
      document.documentElement.style.setProperty("--page-transition-scrollbar-offset", "0px");
    }

    document.documentElement.classList.toggle("page-transition-scroll-lock", isScrollLocked);
    document.body.classList.toggle("page-transition-scroll-lock", isScrollLocked);

    return () => {
      window.removeEventListener("resize", syncScrollbarOffset);
      document.documentElement.classList.remove("page-transition-scroll-lock");
      document.body.classList.remove("page-transition-scroll-lock");
      document.documentElement.style.setProperty("--page-transition-scrollbar-offset", "0px");
    };
  }, [isScrollLocked]);

  const value = useMemo(
    () => ({
      startNavigationTransition,
    }),
    [startNavigationTransition],
  );

  return (
    <PageTransitionContext.Provider value={value}>
      <div
        className="page-transition-content"
        data-transition-phase={phase}
      >
        {children}
      </div>
      <div className="page-transition-overlay" data-state={isVisible ? phase : "idle"} aria-hidden="true" />
      <div className="page-transition-progress" data-visible={isVisible ? "true" : "false"} aria-hidden="true">
        <span
          className="page-transition-progress__bar"
          style={{ transform: `scaleX(${progress / 100})` }}
        />
      </div>
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext);

  if (!context) {
    throw new Error("usePageTransition must be used within PageTransitionProvider");
  }

  return context;
}

export type { TransitionSource };
