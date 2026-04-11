"use client"

import { useState } from "react"

type Props = {
  code: string
  onBeautify?: () => void
  onMinify?: () => void
}

export default function Toolbar({ code, onBeautify, onMinify }: Props) {
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const isDisabled = !code || code.length === 0

  // Copy to clipboard
  const handleCopy = async () => {
    if (isDisabled) return

    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch (err) {
      console.error("Copy failed:", err)
    }
  }

  // Download file
  const handleDownload = async () => {
    if (isDisabled) return

    try {
      setDownloading(true)

      const blob = new Blob([code], { type: "text/html" })
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = "source.html"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Download failed:", err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="flex items-center gap-2 text-sm flex-wrap">

      {/* Beautify */}
      <button
        onClick={onBeautify}
        disabled={isDisabled}
        className={`px-3 py-1 rounded transition ${
          isDisabled
            ? "bg-zinc-700 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-500"
        }`}
      >
        Beautify
      </button>

      {/* Minify */}
      <button
        onClick={onMinify}
        disabled={isDisabled}
        className={`px-3 py-1 rounded transition ${
          isDisabled
            ? "bg-zinc-700 cursor-not-allowed"
            : "bg-yellow-500 hover:bg-yellow-400"
        }`}
      >
        Minify
      </button>

      {/* Copy */}
      <button
        onClick={handleCopy}
        disabled={isDisabled}
        className={`px-3 py-1 rounded transition ${
          isDisabled
            ? "bg-zinc-700 cursor-not-allowed"
            : "bg-zinc-700 hover:bg-zinc-600"
        }`}
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>

      {/* Download */}
      <button
        onClick={handleDownload}
        disabled={isDisabled || downloading}
        className={`px-3 py-1 rounded transition ${
          isDisabled
            ? "bg-zinc-700 cursor-not-allowed"
            : "bg-zinc-700 hover:bg-zinc-600"
        }`}
      >
        {downloading ? "Downloading..." : "Download"}
      </button>
    </div>
  )
}