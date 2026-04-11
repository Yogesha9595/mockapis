"use client"

import { useState } from "react"

export default function AutoFixPanel({ schema }: any) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  if (!schema || typeof schema !== "object") return null

  // ============================
  // 🧠 AUTO FIX LOGIC
  // ============================
  const type = schema["@type"]

  let fixedSchema: any = { ...schema }

  // Common fixes
  if (!fixedSchema["@context"]) {
    fixedSchema["@context"] = "https://schema.org"
  }

  if (!fixedSchema["@type"]) {
    fixedSchema["@type"] = "Thing"
  }

  // Type-based fixes
  if (type === "Article") {
    fixedSchema.headline = schema.headline || "Sample Article Title"
    fixedSchema.description =
      schema.description || "Sample article description"
    fixedSchema.author =
      schema.author || {
        "@type": "Person",
        name: "Admin",
      }
    fixedSchema.datePublished =
      schema.datePublished || new Date().toISOString()
  }

  if (type === "Product") {
    fixedSchema.name = schema.name || "Sample Product"
    fixedSchema.description =
      schema.description || "Sample product description"
    fixedSchema.offers =
      schema.offers || {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      }
  }

  if (type === "FAQPage") {
    fixedSchema.mainEntity =
      schema.mainEntity || [
        {
          "@type": "Question",
          name: "Sample Question?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sample answer",
          },
        },
      ]
  }

  // ============================
  // 📋 COPY HANDLER
  // ============================
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(fixedSchema, null, 2)
      )
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  // ============================
  // UI
  // ============================
  return (
    <div className="border rounded-lg bg-white p-5 space-y-4 shadow-sm">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="text-sm font-semibold text-gray-800">
          ✨ Auto Fix Suggestions
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-blue-600 hover:underline"
        >
          {expanded ? "Hide" : "View"}
        </button>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500">
        Automatically generated fixes based on schema type and missing fields.
      </p>

      {/* Preview */}
      {expanded && (
        <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-60">
          {JSON.stringify(fixedSchema, null, 2)}
        </pre>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-2">

        <button
          onClick={handleCopy}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-xs font-medium transition"
        >
          {copied ? "Copied!" : "Copy Fixed Schema"}
        </button>

        {/* PRO CTA */}
        <span className="text-xs text-gray-400">
          🔒 AI Auto Fix coming soon
        </span>
      </div>

    </div>
  )
}