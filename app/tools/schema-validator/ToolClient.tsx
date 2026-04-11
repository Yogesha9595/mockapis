"use client"

import { useState } from "react"
import SchemaEditor from "./SchemaEditor"
import ResultPanel from "./ResultPanel"

export default function ToolClient() {
  const [input, setInput] = useState("")
  const [mode, setMode] = useState<"json" | "url">("url")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleValidate = async () => {
    if (!input.trim()) {
      setResult({ error: "Please enter schema or URL" })
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/schema/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input, mode }),
      })

      const data = await res.json()
      setResult(data)
    } catch {
      setResult({
        valid: false,
        error: "Something went wrong",
      })
    }

    setLoading(false)
  }

  return (
    <div className="w-full py-10 px-4">

      {/* HEADER */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold">
          Schema Markup Validator
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Validate JSON-LD or extract schema from any URL instantly
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="max-w-6xl mx-auto bg-white border rounded-xl shadow-sm overflow-hidden">

        <div className="grid md:grid-cols-2 min-h-[500px]">

          {/* LEFT */}
          <div className="border-r">
            <SchemaEditor
              input={input}
              setInput={setInput}
              onRun={handleValidate}
              loading={loading}
              mode={mode}
              setMode={setMode}
            />
          </div>

          {/* RIGHT */}
          <div className="bg-gray-50">
            <ResultPanel result={result} />
          </div>

        </div>

      </div>

    </div>
  )
}