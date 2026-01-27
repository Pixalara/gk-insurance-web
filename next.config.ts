import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true, // Forces routes to end with / and helps resolve some 404s
};

export default nextConfig;