"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { tools } from "@/data/tools"
import { motion } from "framer-motion"

type Tool = {
  slug: string
  name: string
  description?: string
  category?: string
}

/* 🔥 STATIC TOOL PATHS */
const STATIC_TOOL_PATHS: Record<string, string> = {
  "view-source": "/tools/view-source",
  "url-encoder-decoder": "/tools/url-encoder-decoder",
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

  const filteredTools = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return tools as Tool[]

    return (tools as Tool[]).filter((tool) =>
      tool.name?.toLowerCase().includes(q) ||
      tool.description?.toLowerCase().includes(q)
    )
  }, [query])

  return (
    <main className="min-h-screen bg-white dark:bg-[#020617] text-gray-900 dark:text-gray-100 px-4 py-12">

      {/* 🔥 HERO */}
      <section className="max-w-6xl mx-auto mb-14">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Developer Tools Hub
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
          Free online tools to encode, decode, format, and transform data instantly.
          Built for developers with speed, privacy, and simplicity.
        </p>
      </section>

      {/* 🔍 SEARCH (UPGRADED) */}
      <section className="max-w-6xl mx-auto mb-14">
        <div className="relative">
          <input
            type="text"
            placeholder="Search tools (JSON, Base64, URL, JWT...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#020617] px-5 py-4 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* subtle glow */}
          <div className="absolute inset-0 rounded-xl pointer-events-none ring-1 ring-inset ring-white/10 dark:ring-white/5" />
        </div>
      </section>

      {/* 🧰 TOOLS */}
      <section className="max-w-6xl mx-auto space-y-16">

        {Object.entries(categories).map(([key, label]) => {
          const categoryTools = filteredTools.filter(
            (tool) => tool.category === key
          )

          if (!categoryTools.length) return null

          return (
            <div key={key}>

              {/* CATEGORY */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {label}
                </h2>

                <span className="text-sm text-gray-500">
                  {categoryTools.length} tools
                </span>
              </div>

              {/* GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {categoryTools.map((tool) => {
                  const path = STATIC_TOOL_PATHS[tool.slug]

                  return (
                    <motion.div
                      key={tool.slug}
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.2 }}
                      className={`group relative rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#020617] p-5 transition ${
                        path
                          ? "hover:border-green-500/40 hover:shadow-xl cursor-pointer"
                          : "opacity-60 cursor-not-allowed"
                      }`}
                    >

                      {/* LINK */}
                      {path ? (
                        <Link href={path}>
                          <h3 className="font-semibold text-base mb-2 group-hover:text-green-500 transition">
                            {tool.name}
                          </h3>
                        </Link>
                      ) : (
                        <h3 className="font-semibold text-base mb-2">
                          {tool.name}
                        </h3>
                      )}

                      {/* DESC */}
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {tool.description || "Developer utility tool"}
                      </p>

                      {/* STATUS */}
                      {!path && (
                        <div className="mt-3 text-xs text-gray-400">
                          Coming soon
                        </div>
                      )}

                      {/* HOVER GLOW */}
                      {path && (
                        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-green-500/5 to-emerald-500/5" />
                      )}
                    </motion.div>
                  )
                })}

              </div>
            </div>
          )
        })}
      </section>

      {/* EMPTY */}
      {filteredTools.length === 0 && query && (
        <div className="text-center mt-20">
          <p className="text-gray-500 dark:text-gray-400">
            No tools found for "{query}"
          </p>
        </div>
      )}

    </main>
  )
}