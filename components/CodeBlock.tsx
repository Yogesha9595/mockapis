"use client"

import { useState } from "react"

type Props = {
  children: string
  language?: string
}

export default function CodeBlock({
  children,
  language = "code",
}: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children.trim())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Copy failed", err)
    }
  }

  return (
    <div className="relative my-8 rounded-xl overflow-hidden border border-gray-200 shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b text-xs text-gray-500">

        {/* Language */}
        <span className="uppercase tracking-wide">
          {language}
        </span>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="px-3 py-1 rounded-md bg-white border text-gray-600 hover:bg-gray-50 transition text-xs"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>

      </div>

      {/* Code */}
      <pre className="bg-[#0f172a] text-gray-200 p-4 overflow-x-auto text-sm leading-relaxed">
        <code className="font-mono">
          {children}
        </code>
      </pre>

    </div>
  )
}