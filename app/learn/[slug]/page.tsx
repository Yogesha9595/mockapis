import { notFound } from "next/navigation"
import fs from "fs"
import path from "path"
import { compileMDX } from "next-mdx-remote/rsc"

import ArticleLayout from "@/components/ArticleLayout"
import TableOfContents from "@/components/TableOfContents"

// ✅ REQUIRED FOR STATIC EXPORT
export const dynamic = "force-static"

// ✅ GENERATE STATIC PATHS FROM MDX FILES
export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), "content")

  if (!fs.existsSync(contentDir)) return []

  const files = fs.readdirSync(contentDir)

  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => ({
      slug: file.replace(".mdx", ""),
    }))
}

type Params = {
  params: { slug: string } // ✅ FIXED
}

/* ---------------- METADATA ---------------- */
export async function generateMetadata({ params }: Params) {
  const { slug } = params // ✅ FIXED (no await)

  try {
    const filePath = path.join(process.cwd(), "content", `${slug}.mdx`)

    if (!fs.existsSync(filePath)) return {}

    const source = fs.readFileSync(filePath, "utf-8")

    const { frontmatter } = await compileMDX({
      source,
      options: { parseFrontmatter: true },
    })

    return {
      title: frontmatter.title,
      description: frontmatter.description,
      keywords: frontmatter.keywords || [],
      openGraph: {
        title: frontmatter.title,
        description: frontmatter.description,
        type: "article",
      },
    }
  } catch (error) {
    console.error("Metadata error:", error)
    return {}
  }
}

/* ---------------- PAGE ---------------- */
export default async function ArticlePage({ params }: Params) {
  const { slug } = params // ✅ FIXED (no await)

  const filePath = path.join(process.cwd(), "content", `${slug}.mdx`)

  if (!fs.existsSync(filePath)) return notFound()

  let source = ""

  try {
    source = fs.readFileSync(filePath, "utf-8")
  } catch (error) {
    console.error("File read error:", error)
    return notFound()
  }

  let content: any
  let frontmatter: any

  try {
    const result = await compileMDX({
      source,
      options: { parseFrontmatter: true },
    })

    content = result.content
    frontmatter = result.frontmatter
  } catch (error) {
    console.error("MDX compile error:", error)
    return notFound()
  }

  /* ---------------- TOC EXTRACTION ---------------- */
  const headings =
    source
      .match(/^## (.*)$/gm)
      ?.map((h) => h.replace("## ", "").trim()) || []

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-10">

      {/* 🧠 MAIN ARTICLE */}
      <div className="w-full max-w-3xl">
        <ArticleLayout
          title={frontmatter.title}
          description={frontmatter.description}
          category={frontmatter.category}
          readingTime={frontmatter.readingTime}
          faqs={frontmatter.faqs}
        >
          {content}
        </ArticleLayout>
      </div>

      {/* 📌 TOC SIDEBAR */}
      <TableOfContents headings={headings} />

    </div>
  )
}