import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  async redirects() {
    return [
      {
        source: "/services/aigc/photoreal",
        destination: "/services/aigc/film",
        permanent: true,
      },
      {
        source: "/services/aigc/3d",
        destination: "/services/aigc/film",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
