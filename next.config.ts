import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'divebro.premiumasp.net',
      },
    ],
  },
};

export default nextConfig;
