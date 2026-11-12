import fs from "fs"
import path from "path"
import matter from "gray-matter"

const CONTENT_PATH = path.join(process.cwd(), "content/learn")

export function getArticleBySlug(slug: string) {
  try {
    const filePath = path.join(CONTENT_PATH, `${slug}.mdx`)

    if (!fs.existsSync(filePath)) return null

    const source = fs.readFileSync(filePath, "utf-8")

    const { data, content } = matter(source)

    return {
      slug,
      frontmatter: data,
      content,
    }
  } catch (error) {
    console.error("getArticleBySlug error:", error)
    return null
  }
}