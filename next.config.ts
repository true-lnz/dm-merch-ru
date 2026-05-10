import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    qualities: [75, 80, 85, 90, 95],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "catalog-export.cdn.portobello.ru",
      },
      {
        protocol: "https",
        hostname: "cdn.dm-merch.ru",
      },
    ],
  },
};

const payloadConfig = withPayload(nextConfig, {
  devBundleServerPackages: false,
});
const experimentalConfig = payloadConfig.experimental as (NextConfig["experimental"] & { enableServerFastRefresh?: boolean }) | undefined;

if (experimentalConfig) {
  delete experimentalConfig.enableServerFastRefresh;
}

export default payloadConfig;
