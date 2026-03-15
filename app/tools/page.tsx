"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { tools } from "@/data/tools"

type Tool = {
  slug: string
  name: string
  description?: string
  category?: string
}

export default function ToolsPage() {
  const [query, setQuery] = useState("")

  const categories: Record<string, string> = {
    json: "JSON Tools",
    encoding: "Encoding Tools",
    formatter: "Formatter Tools",
    developer: "Developer Utilities",
    xml: "XML Tools",
    yaml: "YAML Tools",
    text: "Text Tools"
  }

  // Memoize filtered tools for better performance
  const filteredTools = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim()
    if (!normalizedQuery) return tools as Tool[]

    return (tools as Tool[]).filter((tool) => {
      const name = tool.name?.toLowerCase() || ""
      const description = tool.description?.toLowerCase() || ""
      return name.includes(normalizedQuery) || description.includes(normalizedQuery)
    })
  }, [query])

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Page Title */}
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold mb-3 text-gray-900 tracking-tight">
          Developer Tools
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Free, secure, browser-based utilities for formatting, encoding, 
          and transforming data instantly without server-side processing.
        </p>
      </header>

      {/* Search Bar */}
      <div className="relative mb-12 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search for a tool (e.g. 'JSON', 'Base64', 'JWT')..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-gray-200 rounded-xl p-4 pl-12 text-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
        />
      </div>

      {/* Category Sections */}
      <div className="space-y-16">
        {Object.entries(categories).map(([key, label]) => {
          const categoryTools = filteredTools.filter((tool) => tool.category === key)

          if (categoryTools.length === 0) return null

          return (
            <section key={key} aria-labelledby={`heading-${key}`}>
              <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                <h2 id={`heading-${key}`} className="text-2xl font-bold text-gray-800">
                  {label}
                </h2>
                <Link
                  href={`/tools/category/${key}`}
                  className="text-sm font-medium text-teal-600 hover:text-teal-700 hover:underline transition"
                >
                  View all tools →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {categoryTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="group border border-gray-100 rounded-xl p-5 hover:border-teal-500 hover:shadow-lg transition-all bg-white"
                  >
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                      {tool.description || "Utility for processing and transforming data."}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {/* Empty Search State */}
      {filteredTools.length === 0 && query && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-800">No tools found</h3>
          <p className="text-gray-500 mt-2">
            We couldn't find anything matching "<span className="font-medium">{query}</span>".
          </p>
          <button 
            onClick={() => setQuery("")}
            className="mt-6 text-teal-600 font-medium hover:underline"
          >
            Clear search and view all tools
          </button>
        </div>
      )}
    </div>
  )
}