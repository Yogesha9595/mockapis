import fs from "fs"
import path from "path"
import matter from "gray-matter"

const CONTENT_PATH = path.join(process.cwd(), "content/learn")

export type Article = {
  slug: string
  title: string
  description: string
  date: string
  category: string
  readingTime: string
  tags: string[]
  views: number
}

/* ---------------- HELPERS ---------------- */
function calculateReadingTime(text: string): string {
  const wordsPerMinute = 200
  const wordCount = text.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute))
  return `${minutes} min read`
}

function safeArray(value: any): string[] {
  if (Array.isArray(value)) return value
  if (typeof value === "string") return [value]
  return []
}

function safeString(value: any, fallback: string) {
  return typeof value === "string" && value.trim()
    ? value
    : fallback
}

/* ---------------- MAIN FUNCTION ---------------- */
export function getAllArticles(): Article[] {
  try {
    if (!fs.existsSync(CONTENT_PATH)) return []

    const files = fs.readdirSync(CONTENT_PATH)

    const articles: Article[] = files
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => {
        const slug = file.replace(".mdx", "")
        const filePath = path.join(CONTENT_PATH, file)

        let source = ""
        try {
          source = fs.readFileSync(filePath, "utf-8")
        } catch {
          return null
        }

        const { data, content } = matter(source)

        return {
          slug,

          title: safeString(
            data.title,
            slug.replace(/-/g, " ")
          ),

          description: safeString(
            data.description,
            ""
          ),

          date: safeString(
            data.date,
            "2025-01-01"
          ),

          category: safeString(
            data.category,
            "General"
          ),

          readingTime:
            safeString(data.readingTime, "") ||
            calculateReadingTime(content),

          tags: safeArray(data.tags),

          views:
            typeof data.views === "number"
              ? data.views
              : 0,
        }
      })
      .filter(Boolean) as Article[]

    /* ---------------- SORTING ---------------- */

    return articles
      .sort((a, b) => {
        // 🔥 Trending priority first
        if (b.views !== a.views) {
          return b.views - a.views
        }

        // 📅 Then latest
        return (
          new Date(b.date).getTime() -
          new Date(a.date).getTime()
        )
      })

  } catch (error) {
    console.error("getAllArticles error:", error)
    return []
  }
}