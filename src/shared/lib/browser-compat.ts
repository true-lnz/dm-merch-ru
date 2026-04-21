type MediaQueryChangeListener = (event: MediaQueryListEvent | MediaQueryList) => void;

type LegacyMediaQueryList = MediaQueryList & {
  addListener?: (listener: MediaQueryChangeListener) => void;
  removeListener?: (listener: MediaQueryChangeListener) => void;
};

export function subscribeToMediaQuery(mediaQuery: MediaQueryList, listener: MediaQueryChangeListener) {
  const legacyMediaQuery = mediaQuery as LegacyMediaQueryList;

  if (typeof mediaQuery.addEventListener === "function" && typeof mediaQuery.removeEventListener === "function") {
    mediaQuery.addEventListener("change", listener);

    return () => {
      mediaQuery.removeEventListener("change", listener);
    };
  }

  if (typeof legacyMediaQuery.addListener === "function" && typeof legacyMediaQuery.removeListener === "function") {
    legacyMediaQuery.addListener(listener);

    return () => {
      legacyMediaQuery.removeListener?.(listener);
    };
  }

  return () => undefined;
}

type ResizeCleanup = () => void;

export function observeElementResize(
  elements: Array<Element | null>,
  onResize: () => void,
): ResizeCleanup {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  if (typeof window.ResizeObserver === "function") {
    const resizeObserver = new window.ResizeObserver(onResize);

    elements.forEach((element) => {
      if (element) {
        resizeObserver.observe(element);
      }
    });

    return () => {
      resizeObserver.disconnect();
    };
  }

  let frameId = 0;
  const scheduleResize = () => {
    if (frameId !== 0) {
      window.cancelAnimationFrame(frameId);
    }

    frameId = window.requestAnimationFrame(() => {
      frameId = 0;
      onResize();
    });
  };

  window.addEventListener("resize", scheduleResize);
  window.addEventListener("orientationchange", scheduleResize);

  return () => {
    if (frameId !== 0) {
      window.cancelAnimationFrame(frameId);
    }

    window.removeEventListener("resize", scheduleResize);
    window.removeEventListener("orientationchange", scheduleResize);
  };
}
