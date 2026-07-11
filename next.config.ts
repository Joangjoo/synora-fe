import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "monogamy-moustache-energize.ngrok-free.dev",
  ],
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/api/:path*", // Proxy ke Go Backend
      },
    ];
  },
};

export default nextConfig;
