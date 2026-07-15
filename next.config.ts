import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'divepro.runasp.net',
      },
    ],
  },
};

export default nextConfig;
