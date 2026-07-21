import type { NextConfig } from "next";

const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "30mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async rewrites() {
    if (!R2_PUBLIC_URL) return [];
    return [
      {
        source: "/img/:path*",
        destination: `${R2_PUBLIC_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
