import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"

export const dynamic = "force-static"

/**
 * Crawling is allowed only for production builds.
 * - On Vercel, VERCEL_ENV distinguishes "production" from "preview"/"development",
 *   so preview deployments are never indexed.
 * - Elsewhere (local `next build`, other hosts), fall back to NODE_ENV.
 */
function isProductionBuild(): boolean {
  if (process.env.VERCEL_ENV) return process.env.VERCEL_ENV === "production"
  return process.env.NODE_ENV === "production"
}

export default function robots(): MetadataRoute.Robots {
  const allowCrawling = isProductionBuild()

  return {
    rules: [
      allowCrawling
        ? { userAgent: "*", allow: "/" }
        : { userAgent: "*", disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
