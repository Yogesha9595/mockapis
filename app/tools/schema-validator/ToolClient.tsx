"use client"

import { useState } from "react"
import SchemaEditor, { type SchemaInputMode } from "./SchemaEditor"
import ResultPanel from "./ResultPanel"
import { validateSchemaInput, type ValidationReport } from "@/lib/tools/schemaValidator"

export default function ToolClient() {
  const [input, setInput] = useState("")
  const [mode, setMode] = useState<SchemaInputMode>("json")
  const [result, setResult] = useState<ValidationReport | null>(null)

  /* Validation runs locally and synchronously; nothing is sent anywhere */
  const handleValidate = () => setResult(validateSchemaInput(input, mode))

  const handleModeChange = (next: SchemaInputMode) => {
    setMode(next)
    setInput("")
    setResult(null)
  }

  return (
    <div className="w-full py-10 px-4">

      {/* HEADER */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold">
          Schema Markup Validator
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Check Schema.org JSON-LD structured data, or extract it from a page&apos;s HTML source. Runs in your browser.
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="max-w-6xl mx-auto bg-white border rounded-xl shadow-sm overflow-hidden dark:bg-gray-950 dark:border-gray-800">

        <div className="grid md:grid-cols-2 min-h-[500px]">

          {/* LEFT */}
          <div className="border-b md:border-b-0 md:border-r dark:border-gray-800">
            <SchemaEditor
              input={input}
              setInput={setInput}
              onRun={handleValidate}
              mode={mode}
              setMode={handleModeChange}
            />
          </div>

          {/* RIGHT */}
          <div className="bg-gray-50 dark:bg-gray-900" aria-live="polite">
            <ResultPanel result={result} />
          </div>

        </div>

      </div>

    </div>
  )
}
