import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["beeai-framework", "zod"],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
