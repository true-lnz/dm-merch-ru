"use client";

import { createContext, useContext } from "react";

import type { SiteInfo } from "./site-info";

const SiteInfoContext = createContext<SiteInfo | null>(null);

export function SiteInfoProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: SiteInfo;
}) {
  return <SiteInfoContext.Provider value={value}>{children}</SiteInfoContext.Provider>;
}

export function useSiteInfo() {
  const value = useContext(SiteInfoContext);

  if (!value) {
    throw new Error("useSiteInfo must be used within SiteInfoProvider");
  }

  return value;
}
