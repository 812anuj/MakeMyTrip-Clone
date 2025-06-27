import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  eslint: {
    /** ✅ Ignores ESLint errors during build on Render */
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
