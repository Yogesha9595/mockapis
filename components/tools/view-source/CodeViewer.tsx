"use client"

import { useState } from "react"

type UrlInputProps = {
  onFetch: (url: string) => Promise<void> | void
}

export default function UrlInput({ onFetch }: UrlInputProps) {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Normalize URL (auto add https)
  const normalizeUrl = (value: string) => {
    if (!value) return ""
    return /^https?:\/\//i.test(value) ? value : `https://${value}`
  }

  // Validate URL
  const validateUrl = (value: string) => {
    if (!value) return "Please enter a URL"

    try {
      new URL(value)
      return ""
    } catch {
      return "Enter a valid URL"
    }
  }

  const handleFetch = async () => {
    if (loading) return

    const trimmed = url.trim()
    const finalUrl = normalizeUrl(trimmed)
    const validationError = validateUrl(finalUrl)

    if (validationError) {
      setError(validationError)
      return
    }

    setError("")
    setLoading(true)

    try {
      await onFetch(finalUrl)
    } catch (err) {
      console.error("Fetch error:", err)
      setError("Failed to fetch source. Try another website.")
    } finally {
      setLoading(false)
    }
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) {
        setUrl(text.trim())
        setError("")
      }
    } catch (err) {
      console.error("Clipboard error:", err)
      setError("Clipboard access denied")
    }
  }

  const handleClear = () => {
    setUrl("")
    setError("")
  }

  return (
    <div className="flex flex-col gap-2 p-3 border-b border-zinc-800">

      {/* Input Row */}
      <div className="flex gap-2">

        <input
          value={url}
          onChange={(e) => {
            setUrl(e.target.value)
            if (error) setError("")
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleFetch()
          }}
          placeholder="Paste any website URL (example.com)"
          className="flex-1 bg-zinc-800 p-2 rounded outline-none text-sm focus:ring-1 focus:ring-blue-500"
          aria-label="Website URL input"
          autoComplete="off"
        />

        {/* Paste */}
        <button
          onClick={handlePaste}
          type="button"
          className="px-3 py-2 text-xs bg-zinc-700 rounded hover:bg-zinc-600 transition"
        >
          Paste
        </button>

        {/* Fetch */}
        <button
          onClick={handleFetch}
          disabled={loading}
          type="button"
          className={`px-4 py-2 rounded text-sm transition ${
            loading
              ? "bg-zinc-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          {loading ? "Fetching..." : "View Source"}
        </button>

      </div>

      {/* Helper Row */}
      <div className="flex justify-between items-center text-xs text-zinc-400">

        <button
          onClick={() => {
            setUrl("https://example.com")
            setError("")
          }}
          className="hover:text-white transition"
        >
          Try example.com
        </button>

        {url && (
          <button
            onClick={handleClear}
            className="hover:text-red-400 transition"
          >
            Clear
          </button>
        )}

      </div>

      {/* Error */}
      {error && (
        <p className="text-red-400 text-xs">{error}</p>
      )}

    </div>
  )
}