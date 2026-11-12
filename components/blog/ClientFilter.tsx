"use client"

import { useMemo, useState } from "react"
import Link from "next/link"

type Article = {
  slug: string
  title: string
  description: string
  category?: string
  readingTime?: string
}

export default function ClientFilter({
  articles,
  categories,
}: {
  articles: Article[]
  categories: string[]
}) {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(search.toLowerCase()) ||
        article.description.toLowerCase().includes(search.toLowerCase())

      const matchesCategory =
        activeCategory === "all" ||
        (article.category || "").toLowerCase() === activeCategory.toLowerCase()

      return matchesSearch && matchesCategory
    })
  }, [articles, search, activeCategory])

  /* ---------------- UNIQUE CATEGORY LIST ---------------- */
  const allCategories = ["all", ...Array.from(new Set(categories))]

  return (
    <div className="mt-8">

      {/* 🔍 SEARCH BAR */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* 🧩 CATEGORY FILTER */}
      <div className="flex flex-wrap gap-2 mb-8">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm border transition-all duration-200 ${
              activeCategory === cat
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800"
            }`}
          >
            {cat}
          </button>
        ))}

        {/* 🔄 RESET BUTTON */}
        {(search || activeCategory !== "all") && (
          <button
            onClick={() => {
              setSearch("")
              setActiveCategory("all")
            }}
            className="ml-2 text-sm text-red-500 hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      {/* 📚 ARTICLES GRID */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredArticles.map((article, index) => (
          <div key={article.slug} className="contents">

            <ArticleCard article={article} />

            {/* 🧾 AD SLOT */}
            {(index + 1) % 6 === 0 && <AdBlock key={`ad-${index}`} />}

          </div>
        ))}

      </div>

      {/* EMPTY STATE */}
      {filteredArticles.length === 0 && (
        <div className="text-center mt-16">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No articles found.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  )
}

/* ---------------- ARTICLE CARD ---------------- */

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/learn/${article.slug}`}
      className="group relative border rounded-xl p-5 bg-white dark:bg-zinc-900 dark:border-zinc-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
    >
      {/* CATEGORY BADGE */}
      {article.category && (
        <span className="inline-block mb-2 text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          {article.category}
        </span>
      )}

      {/* TITLE */}
      <h2 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 transition">
        {article.title}
      </h2>

      {/* DESCRIPTION */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
        {article.description}
      </p>

      {/* META */}
      <div className="text-xs text-gray-400 flex items-center justify-between">
        <span>Read article →</span>
        {article.readingTime && <span>{article.readingTime}</span>}
      </div>
    </Link>
  )
}

/* ---------------- AD BLOCK ---------------- */

function AdBlock() {
  return (
    <div className="sm:col-span-1 md:col-span-2 lg:col-span-3">
      <div className="border rounded-xl p-6 bg-gray-50 dark:bg-zinc-900 dark:border-zinc-800 text-center">

        <p className="text-[10px] uppercase text-gray-400 mb-2 tracking-wider">
          Sponsored
        </p>

        <div className="h-28 flex items-center justify-center text-gray-500 text-sm">
          Ad Space (Responsive Banner)
        </div>

      </div>
    </div>
  )
}