import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "gsap",
      "@react-three/fiber",
      "@react-three/drei",
    ],
  },
  // Empty turbopack config to satisfy Next.js 16 default Turbopack requirement
  turbopack: {},
};

export default nextConfig;
