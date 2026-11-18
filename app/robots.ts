import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"

export const dynamic = "force-static"

/** Cloudflare Pages builds this branch as the production deployment (devutilitieslab.com). */
const PRODUCTION_BRANCH = "main"

/**
 * Crawling is allowed only in the production deployment.
 *
 * robots.txt is a static file built per deployment, so the decision uses the
 * build environment Cloudflare Pages provides (CF_PAGES, CF_PAGES_BRANCH):
 *  - production build (branch "main" on Cloudflare Pages) → allow
 *  - preview deployments (any other branch)               → block everything
 *  - any build outside Cloudflare Pages (local, CI)       → block everything
 */
function isProductionDeployment(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.CF_PAGES === "1" && env.CF_PAGES_BRANCH === PRODUCTION_BRANCH
}

export default function robots(): MetadataRoute.Robots {
  if (!isProductionDeployment()) {
    return { rules: [{ userAgent: "*", disallow: "/" }] }
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
