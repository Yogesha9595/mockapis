import type { NextConfig } from "next";
import createMDX from "@next/mdx";

// ✅ MDX plugin
const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const nextConfig: NextConfig = {
  // ✅ Enable MDX support
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],

  // ✅ Strict mode
  reactStrictMode: true,

  // ✅ Modern optimizations
  experimental: {
    optimizePackageImports: ["lucide-react", "react-icons"],
  },

  // ✅ Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // ✅ Compression
  compress: true,

  // ✅ Security headers (AdSense friendly)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // ✅ Redirects
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

// ✅ Only MDX plugin now (NO next-intl)
export default withMDX(nextConfig);