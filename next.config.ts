import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.figma.com",
        pathname: "/api/mcp/asset/**",
      },
    ],
  },
};

const payloadConfig = withPayload(nextConfig);
const experimentalConfig = payloadConfig.experimental as
  | (NextConfig["experimental"] & { enableServerFastRefresh?: boolean })
  | undefined;

if (experimentalConfig) {
  delete experimentalConfig.enableServerFastRefresh;
}

export default payloadConfig;
