import type { MetadataRoute } from "next"
import { getAllArticles } from "@/lib/blog/getAllArticles"
import { absoluteUrl } from "@/lib/site"
import { lastModified } from "@/lib/lastModified"
import { tools, standaloneTools, isLive } from "@/data/tools"

// ✅ Prerendered at build time
export const dynamic = "force-static"

/**
 * Only URLs that render real, working, indexable content belong here.
 * Every entry has a lastModified date (from Git history, see lib/lastModified.ts).
 *
 * Deliberately excluded (the routes still exist; most are also noindex):
 *  - /tools/[slug] pages and categories whose status isn't "live" (noindex)
 *  - /convert/*, /converters/*, /calculators and /calculators/<slug> thin pages (noindex, follow)
 *  - /compiler/* and /online-compiler (the run API is not deployed)
 *  - /playground, /apis, /docs/* (depend on mock API routes that are not deployed)
 */

/* Source paths that make up each kind of page (shared UI is included, as it changes the page) */
const LAYOUT = ["app/layout.tsx", "components/Header.tsx", "components/Footer.tsx"]
const TOOL_PAGE = ["app/tools/[slug]", "components/tools", "data/tools.ts", "data/toolPages.ts", "lib/tools"]

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = []
  const add = (path: string, sources: string[]) => urls.push({ url: absoluteUrl(path), lastModified: lastModified(sources) })

  /* ---------------- STATIC PAGES ---------------- */
  add("/", ["app/page.tsx", "components/home", "data/tools.ts", "content/learn", ...LAYOUT])
  add("/tools", ["app/tools/page.tsx", "data/tools.ts", ...LAYOUT])
  add("/learn", ["app/learn/page.tsx", "content/learn", ...LAYOUT])
  for (const route of ["/http-status-codes", "/about", "/contact", "/privacy-policy", "/terms", "/disclaimer"]) {
    add(route, [`app${route}/page.tsx`, ...LAYOUT])
  }

  /* ---------------- WORKING STANDALONE TOOLS ---------------- */
  for (const tool of standaloneTools.filter(isLive)) {
    add(tool.href, [`app${tool.href}`, "data/tools.ts", ...LAYOUT])
  }

  /* ---------------- WORKING GENERIC TOOLS + THEIR CATEGORIES ---------------- */
  const liveTools = tools.filter(isLive)
  for (const tool of liveTools) {
    add(`/tools/${tool.slug}`, [...TOOL_PAGE, ...LAYOUT])
  }
  for (const category of new Set(liveTools.map((t) => t.category))) {
    add(`/tools/category/${category}`, ["app/tools/category", "data/tools.ts", ...LAYOUT])
  }

  /* ---------------- LEARN ARTICLES ---------------- */
  for (const article of getAllArticles()) {
    add(`/learn/${article.slug}`, [`content/learn/${article.slug}.mdx`, "app/learn/[slug]/page.tsx"])
  }

  return urls
}
