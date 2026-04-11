"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

type Article = {
  slug: string
  title: string
  description: string
  category?: string
  readingTime?: string
}

export default function Learn() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  // ✅ Fetch articles (production safe)
  useEffect(() => {
    let mounted = true

    const fetchArticles = async () => {
      try {
        const res = await fetch("/api/articles", {
          cache: "no-store",
        })

        if (!res.ok) throw new Error("Failed to fetch")

        const data = await res.json()

        if (mounted) setArticles(data)
      } catch (err) {
        console.error(err)
        setError("Failed to load articles")
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchArticles()

    return () => {
      mounted = false
    }
  }, [])

  // ✅ Categories (memoized)
  const categories = useMemo(() => {
    return [
      "all",
      ...Array.from(
        new Set(articles.map((a) => a.category).filter(Boolean))
      ),
    ]
  }, [articles])

  // ✅ Filter (optimized)
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch = article.title
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesCategory =
        activeCategory === "all" ||
        article.category === activeCategory

      return matchesSearch && matchesCategory
    })
  }, [articles, search, activeCategory])

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* 🔥 HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-3 tracking-tight">
          API Learning Hub
        </h1>

        <p className="text-gray-600 text-lg max-w-2xl">
          Learn APIs, HTTP requests, backend concepts, and real-world development step-by-step.
        </p>
      </div>

      {/* 🔍 SEARCH */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
        />
      </div>

      {/* 🧩 CATEGORY FILTER */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm border transition ${
              activeCategory === cat
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ❌ ERROR */}
      {error && (
        <div className="mb-6 p-4 border border-red-200 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {/* ⏳ LOADING */}
      {loading ? (
        <SkeletonGrid />
      ) : (
        <div className="grid md:grid-cols-2 gap-6">

          {filteredArticles.map((article, index) => (
            <div key={article.slug} className="contents">

              <ArticleCard article={article} />

              {/* 💰 AD (clean placement) */}
              {(index + 1) % 4 === 0 && <AdBlock key={`ad-${index}`} />}

            </div>
          ))}

        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && filteredArticles.length === 0 && (
        <div className="text-center mt-16 text-gray-500">
          No articles found.
        </div>
      )}
    </div>
  )
}

/* ---------------- COMPONENTS ---------------- */

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/learn/${article.slug}`}
      className="group border rounded-xl p-5 bg-white hover:shadow-lg transition"
    >
      <h2 className="font-semibold text-lg mb-2 text-gray-900 group-hover:text-blue-600 transition">
        {article.title}
      </h2>

      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
        {article.description}
      </p>

      <div className="text-xs text-gray-400 flex items-center justify-between">
        <span>{article.category}</span>
        <span>{article.readingTime}</span>
      </div>
    </Link>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="border rounded-xl p-5 animate-pulse bg-white"
        >
          <div className="h-4 bg-gray-200 mb-3 w-3/4 rounded"></div>
          <div className="h-3 bg-gray-200 mb-2 rounded"></div>
          <div className="h-3 bg-gray-200 w-1/2 rounded"></div>
        </div>
      ))}
    </div>
  )
}

/* 💰 AD COMPONENT (PRO STYLE) */
function AdBlock() {
  return (
    <div className="md:col-span-2">
      <div className="border rounded-xl p-6 bg-gray-50 text-center">

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