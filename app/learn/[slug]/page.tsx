import { notFound } from "next/navigation"
import fs from "fs"
import path from "path"
import { compileMDX } from "next-mdx-remote/rsc"
import type { Metadata } from "next"
import Link from "next/link"
import { SITE_NAME, absoluteUrl, pageMetadata } from "@/lib/site"
import { getAllArticles } from "@/lib/blog/getAllArticles"

/* ✅ Prerendered at build time (static export); unknown slugs are a real 404 */
export const dynamicParams = false

/* ---------------- TYPES ---------------- */
type Params = {
  params: Promise<{
    slug: string
  }>
}

type ArticleFrontmatter = {
  title?: string
  description?: string
  keywords?: string[]
  category?: string
  readingTime?: string
  date?: string
  faqs?: { q?: string; a?: string }[]
}

/* Slugs map directly to file names, so only allow safe characters */
const SLUG_PATTERN = /^[a-z0-9-]+$/

function articlePath(slug: string): string | null {
  if (!SLUG_PATTERN.test(slug)) return null
  return path.join(process.cwd(), "content/learn", `${slug}.mdx`)
}

/* ---------------- STATIC PARAMS ---------------- */
/* Every article in content/learn becomes a static page */
export async function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }))
}

/* ---------------- METADATA ---------------- */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params

  const filePath = articlePath(slug)
  if (!filePath || !fs.existsSync(filePath)) return {}

  try {
    const source = fs.readFileSync(filePath, "utf-8")

    const { frontmatter } = await compileMDX<ArticleFrontmatter>({
      source,
      options: { parseFrontmatter: true },
    })

    return pageMetadata({
      title: frontmatter.title ?? slug.replace(/-/g, " "),
      description: frontmatter.description ?? "",
      path: `/learn/${slug}`,
      keywords: Array.isArray(frontmatter.keywords) ? frontmatter.keywords : undefined,
      ogType: "article",
    })
  } catch (error) {
    console.error("Metadata error:", error)
    return {}
  }
}

/* ---------------- PAGE ---------------- */
export default async function ArticlePage({ params }: Params) {
  const { slug } = await params

  const filePath = articlePath(slug)

  if (!filePath || !fs.existsSync(filePath)) return notFound()

  let source = ""
  let content: React.ReactElement
  let frontmatter: ArticleFrontmatter

  try {
    source = fs.readFileSync(filePath, "utf-8")

    const result = await compileMDX<ArticleFrontmatter>({
      source,
      options: { parseFrontmatter: true },
    })

    content = result.content
    frontmatter = result.frontmatter || {}
  } catch (error) {
    console.error("MDX compile error:", error)
    return notFound()
  }

  /* ---------------- TOC ---------------- */
  const headings =
    source
      .match(/^## (.*)$/gm)
      ?.map((h) => {
        const text = h.replace("## ", "").trim()
        const id = text.toLowerCase().replace(/[^\w]+/g, "-")
        return { text, id }
      }) || []

  /* ---------------- FAQ SCHEMA ---------------- */
  // Only complete q/a pairs; never emit Question entries with empty fields
  const faqs = Array.isArray(frontmatter.faqs)
    ? frontmatter.faqs.filter((faq) => faq?.q && faq?.a)
    : []

  const faqSchema =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.a,
            },
          })),
        }
      : null

  /* ---------------- ARTICLE SCHEMA ---------------- */
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.description,
    image: absoluteUrl("/og-image.png"),
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/icon-512.png"),
      },
    },
    // Only state a publish date when the article actually has one
    ...(frontmatter.date ? { datePublished: frontmatter.date } : {}),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/learn/${slug}`),
    },
  }

  /* ---------------- BREADCRUMB SCHEMA ---------------- */
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Learn",
        item: absoluteUrl("/learn"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: frontmatter.title,
        item: absoluteUrl(`/learn/${slug}`),
      },
    ],
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-[1fr_260px] gap-10">

      {/* 🔥 SCHEMA */}
      {[articleSchema, breadcrumbSchema, faqSchema]
        .filter(Boolean)
        .map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(schema),
            }}
          />
        ))}

      {/* 🧠 MAIN */}
      <div className="max-w-3xl">

        <div className="text-sm mb-6 text-gray-500 dark:text-gray-400">
          <Link href="/">Home</Link> /{" "}
          <Link href="/learn">Learn</Link> /{" "}
          <span>{frontmatter.title}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          {frontmatter.title}
        </h1>

        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex gap-4 flex-wrap">
          {frontmatter.category && <span>{frontmatter.category}</span>}
          {frontmatter.readingTime && <span>{frontmatter.readingTime}</span>}
        </div>

        <div className="prose dark:prose-invert max-w-none">
          {content}
        </div>

        <div className="mt-12 border-t pt-6">
          <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
            Related Learning
          </h3>
          <div className="flex flex-col gap-2">
            <Link href="/learn" className="text-blue-600 hover:underline">
              Explore all API tutorials →
            </Link>
            <Link href="/tools" className="text-blue-600 hover:underline">
              Try developer tools →
            </Link>
          </div>
        </div>

      </div>

      {/* TOC */}
      <aside className="hidden lg:block sticky top-20 h-fit">
        <div className="border rounded-xl p-5 bg-white dark:bg-zinc-900 dark:border-zinc-800">
          <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
            Table of Contents
          </h3>

          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            {headings.map((h) => (
              <li key={h.id}>
                <a href={`#${h.id}`} className="hover:text-blue-600 transition">
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>

    </div>
  )
}