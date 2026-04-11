"use client"

import Editor from "@monaco-editor/react"

export default function SchemaEditor({
  input,
  setInput,
  onRun,
  loading,
  mode,
  setMode,
}: any) {
  return (
    <div className="p-6 h-full flex flex-col">

      {/* HEADER */}
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-gray-800">
          Input
        </h2>
        <p className="text-xs text-gray-500">
          Paste JSON-LD or enter a URL to extract schema
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-6 mb-4 text-sm font-medium border-b">
        <button
          onClick={() => setMode("json")}
          className={`pb-2 ${
            mode === "json"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
        >
          JSON-LD
        </button>

        <button
          onClick={() => setMode("url")}
          className={`pb-2 ${
            mode === "url"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
        >
          URL
        </button>
      </div>

      {/* INPUT AREA */}
      <div className="flex-1">

        {mode === "json" ? (
          <div className="h-full border rounded-lg overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="json"
              value={input}
              onChange={(value) => setInput(value || "")}
              theme="vs-light"
              options={{
                fontSize: 13,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: "on",
              }}
            />
          </div>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <p className="text-xs text-gray-400">
              We will extract structured data from this page
            </p>
          </div>
        )}

      </div>

      {/* ACTION BUTTON */}
      <button
        onClick={onRun}
        disabled={loading}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-sm font-medium transition"
      >
        {loading ? "Validating..." : "Validate Schema"}
      </button>

    </div>
  )
}