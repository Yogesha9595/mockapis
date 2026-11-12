import ClientFilter from "@/components/blog/ClientFilter"
import { getAllArticles } from "@/lib/blog/getAllArticles"
import type { Metadata } from "next"
import Link from "next/link"
import { absoluteUrl, pageMetadata } from "@/lib/site"

export const dynamic = "force-static"

/* ---------------- SEO METADATA ---------------- */
// Root layout template appends " | DevUtilities Lab" to the title
export const metadata: Metadata = pageMetadata({
  title: "API Learning Hub",
  description:
    "Learn APIs, HTTP requests, backend concepts, and real-world development with in-depth guides and tutorials.",
  path: "/learn",
  keywords: [
    "API tutorials",
    "learn APIs",
    "REST API guide",
    "backend development",
    "HTTP codes",
    "developer learning",
  ],
})

/* ---------------- PAGE ---------------- */
export default function LearnPage() {
  const articles = getAllArticles()

  if (!articles || articles.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h1 className="text-2xl font-semibold">No articles found</h1>
      </div>
    )
  }

  /* ---------- CATEGORY ---------- */
  const categories = Array.from(
    new Set(articles.map((a) => a.category || "General"))
  )

  /* ---------- RANKING SYSTEM ---------- */
  const sortedArticles = [...articles]
  const featured = sortedArticles[0]
  const trending = sortedArticles.slice(1, 5)

  /* ---------- JSON-LD SEO ---------- */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "API Learning Hub",
    url: absoluteUrl("/learn"),
    description:
      "Learn APIs, backend concepts, and HTTP fundamentals step-by-step.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/learn/${article.slug}`),
        name: article.title,
      })),
    },
  }

  /* ---------- BREADCRUMB SCHEMA ---------- */
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
    ],
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* 🔥 SCHEMA */}
      {[jsonLd, breadcrumbSchema].map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* 🍞 BREADCRUMB UI */}
      <nav className="text-sm mb-6 text-gray-500 dark:text-gray-400">
        <Link href="/" className="hover:underline">Home</Link> /{" "}
        <span className="text-gray-700 dark:text-gray-200">Learn</span>
      </nav>

      {/* 🧠 HEADER */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          API Learning Hub
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-xl mx-auto">
          Learn APIs, backend concepts, and real-world development step-by-step.
        </p>
      </div>

      {/* ⭐ FEATURED */}
      {featured && (
        <div className="mb-12">
          <Link
            href={`/learn/${featured.slug}`}
            className="block rounded-2xl p-6 md:p-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:opacity-95 transition"
          >
            <p className="text-xs uppercase opacity-80 mb-2 tracking-wider">
              Featured Article
            </p>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              {featured.title}
            </h2>
            <p className="opacity-90 max-w-2xl">
              {featured.description}
            </p>
          </Link>
        </div>
      )}

      {/* 📊 LAYOUT */}
      <div className="grid lg:grid-cols-[1fr_300px] gap-10">

        {/* 📚 MAIN */}
        <div>
          <ClientFilter articles={articles} categories={categories} />
        </div>

        {/* 📌 SIDEBAR */}
        <aside className="space-y-8 lg:sticky lg:top-20 h-fit">

          {/* 🔥 TRENDING */}
          <div className="p-5 border rounded-xl bg-white dark:bg-zinc-900 dark:border-zinc-800">
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
              🔥 Trending
            </h3>

            <div className="space-y-3">
              {trending.map((article) => (
                <Link
                  key={article.slug}
                  href={`/learn/${article.slug}`}
                  className="block text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 transition"
                >
                  {article.title}
                </Link>
              ))}
            </div>
          </div>

          {/* 🧩 CATEGORIES */}
          <div className="p-5 border rounded-xl bg-white dark:bg-zinc-900 dark:border-zinc-800">
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
              Categories
            </h3>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* 🚀 CTA */}
          <div className="p-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center">
            <h3 className="font-semibold mb-2">
              Build Faster with DevUtilities 🚀
            </h3>
            <p className="text-sm opacity-90 mb-4">
              Explore powerful developer tools and APIs.
            </p>
            <Link
              href="/tools"
              className="inline-block px-4 py-2 bg-white text-black rounded-lg text-sm font-medium"
            >
              Explore Tools
            </Link>
          </div>

        </aside>

      </div>

    </div>
  )
}