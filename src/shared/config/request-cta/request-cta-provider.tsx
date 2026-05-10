"use client";

import { createContext, useContext } from "react";

import type { RequestCtaContent } from "./request-cta";

const RequestCtaContext = createContext<RequestCtaContent | null>(null);

export function RequestCtaProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: RequestCtaContent;
}) {
  return <RequestCtaContext.Provider value={value}>{children}</RequestCtaContext.Provider>;
}

export function useRequestCta() {
  const value = useContext(RequestCtaContext);

  if (!value) {
    throw new Error("useRequestCta must be used within RequestCtaProvider");
  }

  return value;
}
