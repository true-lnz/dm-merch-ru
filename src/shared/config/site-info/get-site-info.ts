import "server-only";

import { getPayloadClient } from "@/shared/lib/payload/get-payload-client";
import { cache } from "react";

import { defaultSiteInfo, type SiteInfo, type SocialIcon, type SocialLink } from "./site-info";

function normalizeSocialIcon(value: unknown): SocialIcon | null {
  if (value === "tg" || value === "vk" || value === "max") {
    return value;
  }

  return null;
}

function mapSocials(value: unknown): SocialLink[] {
  if (!Array.isArray(value)) {
    return defaultSiteInfo.socials;
  }

  const socials = value
    .map((item): SocialLink | null => {
      if (typeof item !== "object" || item === null) {
        return null;
      }

      const icon = normalizeSocialIcon("icon" in item ? item.icon : undefined);
      const label = typeof item.label === "string" ? item.label : null;
      const href = typeof item.href === "string" ? item.href : null;

      if (!icon || !label || !href) {
        return null;
      }

      return { icon, label, href };
    })
    .filter((item): item is SocialLink => item !== null);

  return socials.length > 0 ? socials : defaultSiteInfo.socials;
}

export const getSiteInfo = cache(async (): Promise<SiteInfo> => {
  try {
    const payload = (await getPayloadClient()) as any;
    const global = await payload.findGlobal({
      slug: "site-info",
      depth: 0,
    });

    return {
      brandName: typeof global.brandName === "string" && global.brandName ? global.brandName : defaultSiteInfo.brandName,
      email: typeof global.email === "string" && global.email ? global.email : defaultSiteInfo.email,
      phone: typeof global.phone === "string" && global.phone ? global.phone : defaultSiteInfo.phone,
      address: typeof global.address === "string" && global.address ? global.address : defaultSiteInfo.address,
      socials: mapSocials(global.socials),
      copyright: typeof global.copyright === "string" && global.copyright ? global.copyright : defaultSiteInfo.copyright,
    };
  } catch {
    return defaultSiteInfo;
  }
});
