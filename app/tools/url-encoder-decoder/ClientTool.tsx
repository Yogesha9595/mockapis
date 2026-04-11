"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

/* 🔐 HASH FUNCTION */
async function hashText(text: string, algo: string) {
  const buffer = new TextEncoder().encode(text)
  const hash = await crypto.subtle.digest(algo, buffer)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export default function ClientTool() {
  const searchParams = useSearchParams()

  const [tool, setTool] = useState<"url" | "base64" | "hash">("url")
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [copied, setCopied] = useState(false)
  const [auto, setAuto] = useState(true)
  const [error, setError] = useState("")
  const [fileName, setFileName] = useState("")
  const [encoding, setEncoding] = useState("utf-8")
  const [hashType, setHashType] = useState("SHA-256")

  /* ✅ INIT FROM URL */
  useEffect(() => {
    const val = searchParams.get("input")
    const t = searchParams.get("tool")

    if (val) setInput(decodeURIComponent(val))
    if (t === "url" || t === "base64" || t === "hash") {
      setTool(t)
    }
  }, [searchParams])

  /* ✅ CONVERT */
  const convert = async () => {
    try {
      if (!input) {
        setOutput("")
        return
      }

      let result = ""

      if (tool === "url") {
        const res = await fetch("/api/encode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: input,
            mode,
            encoding,
          }),
        })

        const data = await res.json()
        result = data.result
      }

      if (tool === "base64") {
        result = mode === "encode" ? btoa(input) : atob(input)
      }

      if (tool === "hash") {
        result = await hashText(input, hashType)
      }

      setOutput(result)
      setError("")
    } catch {
      setError("Invalid input")
      setOutput("")
    }
  }

  /* ✅ AUTO */
  useEffect(() => {
    if (auto) convert()
  }, [input, mode, tool, encoding, hashType, auto])

  /* COPY */
  const copy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  /* SHARE */
  const share = async () => {
    const url = `${window.location.origin}/tools/url-encoder-decoder?tool=${tool}&input=${encodeURIComponent(
      input
    )}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
  }

  /* CLEAR */
  const clear = () => {
    setInput("")
    setOutput("")
    setFileName("")
    setError("")
  }

  /* FILE */
  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      setInput(reader.result as string)
      setFileName(file.name)
    }
    reader.readAsText(file)
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* 🔥 TOOL SELECT */}
        <div className="flex gap-3">
          {["url", "base64", "hash"].map((t) => (
            <button
              key={t}
              onClick={() => setTool(t as any)}
              className={`px-4 py-2 rounded ${
                tool === t ? "bg-black text-white" : "bg-white border"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* 🔥 INPUT */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter input..."
          className="w-full border p-3 rounded"
        />

        {/* 🔥 ACTIONS */}
        <div className="flex gap-3 flex-wrap">
          <button onClick={convert} className="bg-blue-600 text-white px-4 py-2 rounded">
            Convert
          </button>

          <button onClick={copy} className="bg-green-600 text-white px-4 py-2 rounded">
            {copied ? "Copied!" : "Copy"}
          </button>

          <button onClick={share} className="bg-purple-600 text-white px-4 py-2 rounded">
            Share
          </button>

          <button onClick={clear} className="bg-gray-600 text-white px-4 py-2 rounded">
            Clear
          </button>
        </div>

        {/* 🔥 OUTPUT */}
        <textarea
          value={output}
          readOnly
          placeholder="Output..."
          className="w-full border p-3 rounded bg-gray-100"
        />

        {/* 🔥 ERROR */}
        {error && <p className="text-red-500">{error}</p>}

        {/* 🔥 FILE */}
        <input
          type="file"
          onChange={(e) => e.target.files && handleFile(e.target.files[0])}
        />

        {fileName && <p className="text-sm text-gray-500">Loaded: {fileName}</p>}

        {/* 🔗 BACK */}
        <Link href="/tools" className="text-blue-600 underline">
          ← Back to tools
        </Link>

      </div>
    </main>
  )
}