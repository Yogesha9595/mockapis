import type { MetadataRoute } from "next"
import fs from "fs"
import path from "path"
import { units } from "@/data/units"

// ✅ REQUIRED for static export
export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mockapis.in"

  const urls: MetadataRoute.Sitemap = []

  const now = new Date()

  /* ---------------- STATIC PAGES ---------------- */

  const staticRoutes = ["", "/learn", "/unit-converter"]

  staticRoutes.forEach((route) => {
    urls.push({
      url: `${baseUrl}${route}`,
      lastModified: now,
    })
  })

  /* ---------------- MDX CONTENT ---------------- */

  try {
    const contentDir = path.join(process.cwd(), "content")

    if (fs.existsSync(contentDir)) {
      const files = fs.readdirSync(contentDir)

      files
        .filter((file) => file.endsWith(".mdx"))
        .forEach((file) => {
          urls.push({
            url: `${baseUrl}/learn/${file.replace(".mdx", "")}`,
            lastModified: now,
          })
        })
    }
  } catch {
    // ✅ fail-safe (important for build)
  }

  /* ---------------- CATEGORY PAGES ---------------- */

  Object.keys(units).forEach((category) => {
    urls.push({
      url: `${baseUrl}/converters/${category}`,
      lastModified: now,
    })
  })

  /* ---------------- CONVERSION PAGES ---------------- */

  Object.keys(units).forEach((category) => {
    const group = units[category as keyof typeof units]

    if (!group || typeof group !== "object") return

    const unitList = Object.keys(group)

    unitList.forEach((from) => {
      unitList.forEach((to) => {
        if (from === to) return

        urls.push({
          url: `${baseUrl}/convert/${from}-to-${to}`,
          lastModified: now,
        })
      })
    })
  })

  return urls
}