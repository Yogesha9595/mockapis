"use client"

import { useId, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, ArrowRight } from "lucide-react"
import type { ToolLink } from "@/data/tools"

const MAX_RESULTS = 8

function matches(tool: ToolLink, terms: string[]) {
  const haystack = `${tool.name} ${tool.description} ${tool.category} ${tool.slug.replace(/-/g, " ")}`.toLowerCase()
  return terms.every((term) => haystack.includes(term))
}

/** Instant search over working tools. Enter opens the first match. */
export default function ToolSearch({ tools, autoFocus = false }: { tools: ToolLink[]; autoFocus?: boolean }) {
  const router = useRouter()
  const inputId = useId()
  const resultsId = useId()
  const [query, setQuery] = useState("")

  const { terms, results } = useMemo(() => {
    const t = query.toLowerCase().split(/\s+/).filter(Boolean)
    return { terms: t, results: t.length ? tools.filter((tool) => matches(tool, t)).slice(0, MAX_RESULTS) : [] }
  }, [query, tools])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (results[0]) router.push(results[0].href)
  }

  return (
    <div className="w-full max-w-2xl">
      <form role="search" onSubmit={onSubmit}>
        <label htmlFor={inputId} className="sr-only">
          Search tools
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools: JSON, Base64, JWT, UUID…"
            autoComplete="off"
            autoFocus={autoFocus}
            aria-controls={resultsId}
            className="h-14 w-full rounded-container border border-input bg-card pl-12 pr-4 text-base text-foreground shadow-card placeholder:text-muted focus-visible:border-ring"
          />
        </div>
      </form>

      <div id={resultsId}>
        <p aria-live="polite" className="sr-only">
          {terms.length ? `${results.length} tool${results.length === 1 ? "" : "s"} found` : ""}
        </p>

        {terms.length > 0 && (
          <div className="mt-2 overflow-hidden rounded-container border border-border bg-card shadow-raised">
            {results.length > 0 ? (
              <ul>
                {results.map((tool, i) => (
                  <li key={tool.slug} className={i > 0 ? "border-t border-border" : undefined}>
                    <Link href={tool.href} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-surface">
                      <span className="min-w-0">
                        <span className="block font-medium text-foreground">{tool.name}</span>
                        <span className="block truncate text-sm text-muted">{tool.description}</span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 py-3 text-sm text-muted">
                No working tool matches &ldquo;{query.trim()}&rdquo;.{" "}
                <Link href="/tools" className="font-medium text-primary underline-offset-2 hover:underline">
                  See all tools, including ones that are coming soon
                </Link>
                .
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
