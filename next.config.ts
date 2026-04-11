import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

const payloadConfig = withPayload(nextConfig, {
  devBundleServerPackages: false,
});
const experimentalConfig = payloadConfig.experimental as
  | (NextConfig["experimental"] & { enableServerFastRefresh?: boolean })
  | undefined;

if (experimentalConfig) {
  delete experimentalConfig.enableServerFastRefresh;
}

export default payloadConfig;
