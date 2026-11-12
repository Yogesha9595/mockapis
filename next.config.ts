import type { NextConfig } from "next"
import createMDX from "@next/mdx"
import { SECURITY_HEADERS } from "./lib/securityHeaders"

// ✅ MDX plugin
const withMDX = createMDX({
  extension: /\.mdx?$/,
})

/*
 * Production is Cloudflare Pages building from GitHub `main`, which serves the
 * static export in `out/`. Every page is prerendered and every tool runs in the
 * browser, so no server runtime is needed.
 *
 * Static hosting ignores headers()/redirects() below; Cloudflare Pages reads
 * public/_headers and public/_redirects instead (kept in sync with these).
 * They are only used when running a non-export build (STATIC_EXPORT=false).
 */
const isStaticExport = process.env.STATIC_EXPORT !== "false"

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: "export" as const } : {}),

  /* ✅ MDX SUPPORT */
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],

  /* ✅ STRICT MODE */
  reactStrictMode: true,

  /* ✅ PERFORMANCE OPTIMIZATION */
  experimental: {
    optimizePackageImports: ["lucide-react", "react-icons"],
  },

  /* ✅ IMAGE CONFIG (required for static export) */
  images: {
    unoptimized: true,
  },

  /* ✅ COMPRESSION */
  compress: true,

  ...(isStaticExport
    ? {}
    : {
        /* SECURITY HEADERS (single source: lib/securityHeaders.ts; mirrored in public/_headers) */
        async headers() {
          return [{ source: "/(.*)", headers: SECURITY_HEADERS }]
        },

        /* REDIRECTS (mirrored in public/_redirects) */
        async redirects() {
          return [{ source: "/home", destination: "/", permanent: true }]
        },
      }),
}

// ✅ EXPORT CONFIG WITH MDX
export default withMDX(nextConfig)
