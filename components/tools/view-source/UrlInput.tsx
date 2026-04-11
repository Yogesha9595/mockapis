"use client"

import { useState } from "react"

type Props = {
  onFetch: (url: string) => Promise<void> | void
}

export default function UrlInput({ onFetch }: Props) {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const validateUrl = (value: string) => {
    if (!value) return "URL is required"
    if (!/^https?:\/\//i.test(value))
      return "URL must start with http:// or https://"
    return ""
  }

  const handleFetch = async () => {
    const validationError = validateUrl(url)

    if (validationError) {
      setError(validationError)
      return
    }

    setError("")
    setLoading(true)

    try {
      await onFetch(url)
    } catch {
      setError("Failed to fetch HTML")
    } finally {
      setLoading(false)
    }
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
          placeholder="Enter website URL (https://...)"
          className="flex-1 bg-zinc-800 p-2 rounded outline-none text-sm"
        />

        <button
          onClick={handleFetch}
          disabled={loading}
          className={`px-4 py-2 rounded text-sm transition ${
            loading
              ? "bg-zinc-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          {loading ? "Loading..." : "View Source"}
        </button>

      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-400 text-xs">{error}</p>
      )}

    </div>
  )
}