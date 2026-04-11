"use client"

import { useMemo } from "react"

type Props = {
  html: string
}

type SeoData = {
  title: string
  description: string
  h1Count: number
  images: number
  scripts: number
}

function extractSeo(html: string): SeoData {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")

    return {
      title: doc.querySelector("title")?.textContent || "",
      description:
        doc
          .querySelector('meta[name="description"]')
          ?.getAttribute("content") || "",
      h1Count: doc.querySelectorAll("h1").length,
      images: doc.querySelectorAll("img").length,
      scripts: doc.querySelectorAll("script").length,
    }
  } catch {
    return {
      title: "",
      description: "",
      h1Count: 0,
      images: 0,
      scripts: 0,
    }
  }
}

export default function SeoPanel({ html }: Props) {
  const data = useMemo(() => extractSeo(html), [html])

  const score = useMemo(() => {
    let s = 0
    if (data.title) s += 20
    if (data.description) s += 20
    if (data.h1Count === 1) s += 20
    if (data.images > 0) s += 20
    if (data.scripts > 0) s += 20
    return s
  }, [data])

  if (!html) {
    return (
      <div className="p-3 text-zinc-500 text-sm">
        No data available
      </div>
    )
  }

  return (
    <div className="p-3 text-sm text-zinc-300 space-y-3">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-zinc-400 text-xs">SEO Insights</h3>
        <span className="text-blue-400 font-medium">{score}/100</span>
      </div>

      {/* Title */}
      <div>
        <p className="text-zinc-500 text-xs">Title</p>
        <p className="truncate">{data.title || "Missing"}</p>
      </div>

      {/* Description */}
      <div>
        <p className="text-zinc-500 text-xs">Meta Description</p>
        <p className="line-clamp-2">
          {data.description || "Missing"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 text-xs">

        <div className="bg-zinc-800 p-2 rounded">
          <p className="text-zinc-500">H1</p>
          <p>{data.h1Count}</p>
        </div>

        <div className="bg-zinc-800 p-2 rounded">
          <p className="text-zinc-500">Images</p>
          <p>{data.images}</p>
        </div>

        <div className="bg-zinc-800 p-2 rounded">
          <p className="text-zinc-500">Scripts</p>
          <p>{data.scripts}</p>
        </div>

        <div className="bg-zinc-800 p-2 rounded">
          <p className="text-zinc-500">Score</p>
          <p>{score}/100</p>
        </div>

      </div>
    </div>
  )
}