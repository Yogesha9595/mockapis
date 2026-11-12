"use client"

import CodeEditor from "@/components/tools/CodeEditor"

export type SchemaInputMode = "json" | "html"

type Props = {
  input: string
  setInput: (value: string) => void
  onRun: () => void
  mode: SchemaInputMode
  setMode: (mode: SchemaInputMode) => void
}

const SAMPLE_JSON_LD = JSON.stringify(
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Wireless Mouse",
    image: "https://example.com/mouse.jpg",
    offers: { "@type": "Offer", price: "29.99", priceCurrency: "USD" },
  },
  null,
  2
)

const MODES: { value: SchemaInputMode; label: string; hint: string }[] = [
  { value: "json", label: "JSON-LD", hint: "Paste a JSON-LD object, array or @graph." },
  {
    value: "html",
    label: "Page HTML",
    hint: "Paste a page's HTML source (in most browsers: Ctrl+U / ⌘⌥U, then select all). Every JSON-LD block is checked.",
  },
]

export default function SchemaEditor({ input, setInput, onRun, mode, setMode }: Props) {
  const active = MODES.find((m) => m.value === mode) ?? MODES[0]

  return (
    <div className="p-6 h-full flex flex-col">

      {/* HEADER */}
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          Input
        </h2>
        <p className="text-xs text-gray-500">{active.hint}</p>
      </div>

      {/* TABS */}
      <div role="tablist" aria-label="Input type" className="flex gap-6 mb-4 text-sm font-medium border-b dark:border-gray-800">
        {MODES.map((m) => (
          <button
            key={m.value}
            type="button"
            role="tab"
            aria-selected={mode === m.value}
            onClick={() => setMode(m.value)}
            className={`pb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              mode === m.value ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* INPUT AREA */}
      <div className="flex-1">
        <CodeEditor
          value={input}
          onChange={setInput}
          language={mode === "json" ? "json" : "html"}
          ariaLabel={mode === "json" ? "JSON-LD input" : "Page HTML input"}
          height={360}
        />
      </div>

      {/* ACTIONS */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onRun}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Validate Schema
        </button>
        {mode === "json" && (
          <button
            type="button"
            onClick={() => setInput(SAMPLE_JSON_LD)}
            className="py-3 px-4 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Load example
          </button>
        )}
      </div>

      <p className="mt-4 text-xs text-gray-500">
        Checks JSON syntax, @context, @type, and the required/recommended properties Google documents for common types
        (Product, Article, FAQPage, BreadcrumbList, Event, Recipe, JobPosting, LocalBusiness and more). It does not
        validate every Schema.org property or guarantee rich results; confirm with Google&apos;s Rich Results Test.
      </p>

    </div>
  )
}
