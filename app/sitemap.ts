import type { MetadataRoute } from "next"
import { units } from "@/data/units"
import { calculatorConfig } from "@/config/calculators"
import { getAllArticles } from "@/lib/blog/getAllArticles"
import { absoluteUrl } from "@/lib/site"
import { tools, standaloneTools, isLive } from "@/data/tools"

// ✅ Prerendered at build time
export const dynamic = "force-static"

/**
 * Only URLs that render real, working content belong here.
 *
 * Deliberately excluded until they are functional (they still exist as
 * routes — exclusion from the sitemap does not remove or de-index them):
 *  - /tools/[slug] pages and categories whose status isn't "live" (they are noindex)
 *  - /compiler/* and /online-compiler (the run API is not deployed)
 *  - /calculators/* without an implementation ("Coming soon")
 *  - /playground, /apis, /docs/* (depend on mock API routes that are not deployed)
 *  - unit slugs containing "/" (e.g. m/s), which cannot form a valid path segment
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = []

  /* ---------------- STATIC PAGES ---------------- */
  const staticRoutes = [
    "/",
    "/tools",
    "/learn",
    "/calculators",
    "/http-status-codes",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/disclaimer",
  ]

  for (const route of staticRoutes) {
    urls.push({ url: absoluteUrl(route) })
  }

  /* ---------------- WORKING STANDALONE TOOLS ---------------- */
  for (const tool of standaloneTools.filter(isLive)) {
    urls.push({ url: absoluteUrl(tool.href) })
  }

  /* ---------------- WORKING GENERIC TOOLS + THEIR CATEGORIES ---------------- */
  const liveTools = tools.filter(isLive)

  for (const tool of liveTools) {
    urls.push({ url: absoluteUrl(`/tools/${tool.slug}`) })
  }

  for (const category of new Set(liveTools.map((t) => t.category))) {
    urls.push({ url: absoluteUrl(`/tools/category/${category}`) })
  }

  /* ---------------- LEARN ARTICLES ---------------- */
  for (const article of getAllArticles()) {
    const date = new Date(article.date)
    urls.push({
      url: absoluteUrl(`/learn/${article.slug}`),
      ...(isNaN(date.getTime()) ? {} : { lastModified: date }),
    })
  }

  /* ---------------- IMPLEMENTED CALCULATORS ---------------- */
  for (const slug of Object.keys(calculatorConfig)) {
    urls.push({ url: absoluteUrl(`/calculators/${slug}`) })
  }

  /* ---------------- UNIT CONVERTERS ---------------- */
  for (const category of Object.keys(units)) {
    urls.push({ url: absoluteUrl(`/converters/${category}`) })

    const unitList = Object.keys(units[category as keyof typeof units])

    for (const from of unitList) {
      for (const to of unitList) {
        if (from === to || from.includes("/") || to.includes("/")) continue
        urls.push({ url: absoluteUrl(`/convert/${from}-to-${to}`) })
      }
    }
  }

  return urls
}
