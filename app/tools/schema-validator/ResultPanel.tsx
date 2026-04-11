"use client"

import { useState } from "react"
import SchemaScore from "./SchemaScore"
import SchemaTreeView from "./SchemaTreeView"

export default function ResultPanel({ result }: any) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0)
  const [viewMode, setViewMode] = useState<"tree" | "json">("tree")

  // ============================
  // EMPTY STATE
  // ============================
  if (!result) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        Run validation to inspect schema structure 🚀
      </div>
    )
  }

  // ============================
  // ERROR STATE
  // ============================
  if (result.error) {
    return (
      <div className="p-6 text-red-500 text-sm">
        ❌ {result.error}
      </div>
    )
  }

  const total = result.results?.length || 0
  const validCount =
    result.results?.filter((r: any) => r.valid)?.length || 0

  // ============================
  // MAIN UI
  // ============================
  return (
    <div className="h-full flex flex-col bg-gray-50">

      {/* HEADER */}
      <div className="p-6 border-b bg-white space-y-4">

        {/* Score + Stats */}
        <div className="grid grid-cols-2 gap-4">
          <SchemaScore score={result.score || 0} />

          <div className="border rounded-lg p-4 bg-white">
            <div className="text-xs text-gray-500 mb-1">
              Summary
            </div>

            <div className="text-sm text-gray-800">
              {validCount}/{total} schemas valid
            </div>

            <div className="text-xs text-gray-400 mt-1">
              {total} detected items
            </div>
          </div>
        </div>

        {/* Title Row */}
        <div className="flex justify-between items-center">
          <div className="text-sm font-semibold text-gray-800">
            Detected Schemas
          </div>

          {/* View Toggle */}
          <div className="flex gap-2 text-xs">
            <button
              onClick={() => setViewMode("tree")}
              className={`px-3 py-1 rounded ${
                viewMode === "tree"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Tree
            </button>

            <button
              onClick={() => setViewMode("json")}
              className={`px-3 py-1 rounded ${
                viewMode === "json"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              JSON
            </button>
          </div>
        </div>
      </div>

      {/* SCROLLABLE LIST */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">

        {result.results?.map((r: any, i: number) => {
          const isActive = activeIndex === i

          return (
            <div
              key={i}
              className="border rounded-xl bg-white overflow-hidden shadow-sm"
            >

              {/* TOP ROW */}
              <div
                onClick={() =>
                  setActiveIndex(isActive ? null : i)
                }
                className="flex justify-between items-center px-5 py-4 cursor-pointer hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">

                  <div className="text-sm font-medium text-gray-900">
                    {r.type || "Unknown Schema"}
                  </div>

                  {/* Status badge */}
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      r.valid
                        ? "bg-green-100 text-green-600"
                        : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {r.valid ? "Valid" : "Issues"}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{r.missing?.length || 0} issues</span>
                  <span>{isActive ? "▲" : "▼"}</span>
                </div>
              </div>

              {/* EXPANDED */}
              {isActive && (
                <div className="border-t px-5 py-5 space-y-5">

                  {/* Missing Fields */}
                  {r.missing?.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Missing Fields
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {r.missing.map(
                          (m: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded"
                            >
                              {m}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Suggestions */}
                  {r.suggestions?.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Suggestions
                      </div>

                      <ul className="text-xs text-gray-600 space-y-1">
                        {r.suggestions.map(
                          (s: string, idx: number) => (
                            <li key={idx}>• {s}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {/* VIEW */}
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Schema Structure
                    </div>

                    {viewMode === "tree" ? (
                      <SchemaTreeView data={r.data} />
                    ) : (
                      <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-72">
                        {JSON.stringify(r.data, null, 2)}
                      </pre>
                    )}
                  </div>

                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}