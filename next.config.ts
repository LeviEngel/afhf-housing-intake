import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/afhf-housing-intake",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;