import fs from "fs"
import path from "path"
import { units } from "@/data/units"

export default function sitemap() {
  const baseUrl = "https://mockapis.in"

  const urls: any[] = []

  // ✅ Static pages
  const staticRoutes = ["", "/learn", "/unit-converter"]

  staticRoutes.forEach((route) => {
    urls.push({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
    })
  })

  // ✅ Learn (MDX)
  const contentDir = path.join(process.cwd(), "content")

  const files = fs.existsSync(contentDir)
    ? fs.readdirSync(contentDir)
    : []

  files
    .filter((file) => file.endsWith(".mdx"))
    .forEach((file) => {
      urls.push({
        url: `${baseUrl}/learn/${file.replace(".mdx", "")}`,
        lastModified: new Date(),
      })
    })

  // ✅ Category pages
  for (const category in units) {
    urls.push({
      url: `${baseUrl}/converters/${category}`,
      lastModified: new Date(),
    })
  }

  // 🔥 Conversion pages (MOST IMPORTANT)
  for (const category in units) {
    const group = units[category as keyof typeof units]
    const unitList = Object.keys(group)

    for (const from of unitList) {
      for (const to of unitList) {
        if (from === to) continue

        urls.push({
          url: `${baseUrl}/convert/${from}-to-${to}`,
          lastModified: new Date(),
        })
      }
    }
  }

  return urls
}