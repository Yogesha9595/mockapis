import fs from "fs"
import path from "path"
import { compileMDX } from "next-mdx-remote/rsc"

export async function GET() {
  try {
    const contentDir = path.join(process.cwd(), "content")

    // ❌ If folder missing
    if (!fs.existsSync(contentDir)) {
      return Response.json([])
    }

    const files = fs
      .readdirSync(contentDir)
      .filter((file) => file.endsWith(".mdx")) // ✅ only mdx

    const articles = await Promise.all(
      files.map(async (file) => {
        try {
          const filePath = path.join(contentDir, file)
          const source = fs.readFileSync(filePath, "utf-8")

          const { frontmatter } = await compileMDX({
            source,
            options: { parseFrontmatter: true },
          })

          return {
            slug: file.replace(".mdx", ""),
            title: frontmatter.title || "Untitled",
            description: frontmatter.description || "",
            category: frontmatter.category || "general",
            readingTime: frontmatter.readingTime || "5 min",
            date: frontmatter.date || null, // ✅ optional for sorting
          }
        } catch (err) {
          console.error("Error parsing file:", file, err)
          return null
        }
      })
    )

    // ✅ Remove broken files
    const validArticles = articles.filter(Boolean)

    // ✅ Sort by date (latest first)
    validArticles.sort((a: any, b: any) => {
      if (!a.date) return 1
      if (!b.date) return -1
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

    return Response.json(validArticles, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    })
  } catch (error) {
    console.error("API ERROR:", error)

    return Response.json(
      { error: "Failed to load articles" },
      { status: 500 }
    )
  }
}