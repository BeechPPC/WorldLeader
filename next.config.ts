import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingIncludes: {
    '/api/**/*': ['./node_modules/.prisma/client/*.node'],
  },
};

export default nextConfig;
