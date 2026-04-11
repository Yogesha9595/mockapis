"use client"

import { useParams } from "next/navigation"
import { useState, useMemo } from "react"
import Link from "next/link"

import { tools } from "@/data/tools"
import { runTool } from "@/lib/tools/engine"

import CodeEditor from "@/components/tools/CodeEditor"
import ToolContent from "@/components/tools/ToolContent"
import ToolFAQ from "@/components/tools/ToolFAQ"
import ToolExample from "@/components/tools/ToolExample"
import ToolRelated from "@/components/tools/ToolRelated"

type Tool = {
  slug: string
  name: string
  description?: string
  category?: string
}

const DEFAULT_JSON = `{
  "name": "MockAPIs",
  "type": "Developer Tools",
  "version": "1.0",
  "features": [
    "JSON Formatter",
    "API Playground",
    "Developer Utilities"
  ],
  "active": true
}`

export default function ToolPage() {
  const params = useParams()

  const slug =
    typeof params.slug === "string"
      ? params.slug
      : params.slug?.[0] ?? ""

  const tool = tools.find((t: Tool) => t.slug === slug)

  const [input, setInput] = useState<string>(() =>
    slug === "json-formatter" ? DEFAULT_JSON : ""
  )

  const [output, setOutput] = useState<string>("")

  /* ❌ NOT FOUND */
  if (!tool) {
    return (
      <div className="py-20 text-center text-foreground">
        <h1 className="text-2xl font-semibold">Tool not found</h1>
        <p className="text-muted mt-2">
          This tool may not exist or is under development.
        </p>

        <Link
          href="/tools"
          className="inline-block mt-4 text-primary hover:underline"
        >
          ← Back to tools
        </Link>
      </div>
    )
  }

  /* ---------------- ACTIONS ---------------- */

  const handleRun = () => {
    const result = runTool(slug, input)
    setOutput(result ?? "")
  }

  const handleClear = () => {
    setInput("")
    setOutput("")
  }

  const handleCopy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
  }

  const handleValidate = () => {
    try {
      JSON.parse(input)
      setOutput("Valid JSON ✅")
    } catch {
      setOutput("Invalid JSON ❌")
    }
  }

  const handleMinify = () => {
    try {
      const minified = JSON.stringify(JSON.parse(input))
      setOutput(minified)
    } catch {
      setOutput("Invalid JSON")
    }
  }

  const handleDownload = () => {
    if (!output) return

    const blob = new Blob([output], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "result.json"
    a.click()

    URL.revokeObjectURL(url)
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result
      if (typeof result === "string") {
        setInput(result)
      }
    }
    reader.readAsText(file)
  }

  /* ---------------- CATEGORY ---------------- */

  const categories = useMemo(() => {
    return tools.reduce((acc: Record<string, Tool[]>, tool: Tool) => {
      if (!tool.category) return acc
      if (!acc[tool.category]) acc[tool.category] = []
      acc[tool.category].push(tool)
      return acc
    }, {})
  }, [])

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10 bg-background text-foreground">

      {/* HEADER */}
      <div className="max-w-5xl mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          {tool.name}
        </h1>

        <p className="text-muted mt-2 text-lg">
          {tool.description ?? ""}
        </p>
      </div>

      {/* TOOL UI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* INPUT */}
        <div className="lg:col-span-5 bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <CodeEditor value={input} onChange={setInput} language="json" />
        </div>

        {/* ACTIONS */}
        <div className="lg:col-span-2 flex flex-col gap-3">

          <label className="btn-green text-center cursor-pointer">
            Upload
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleUpload}
            />
          </label>

          <button onClick={handleValidate} className="btn-green">
            Validate
          </button>

          <button onClick={handleRun} className="btn-green">
            Run
          </button>

          <button onClick={handleMinify} className="btn-green">
            Minify
          </button>

          <button onClick={handleCopy} className="btn-dark">
            Copy
          </button>

          <button onClick={handleDownload} className="btn-dark">
            Download
          </button>

          <button onClick={handleClear} className="border border-border rounded-lg py-2 hover:bg-card transition">
            Clear
          </button>
        </div>

        {/* OUTPUT */}
        <div className="lg:col-span-5 bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <CodeEditor value={output} readOnly language="json" />
        </div>

      </div>

      {/* CONTENT */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT SIDEBAR */}
        <aside className="lg:col-span-2 space-y-6 text-sm hidden lg:block">

          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold mb-3">Developer Tools</h3>
            <ul className="space-y-2 text-muted">
              <li><Link href="/tools/json-formatter">JSON Formatter</Link></li>
              <li><Link href="/tools/json-validator">JSON Validator</Link></li>
              <li><Link href="/tools/json-minify">JSON Minify</Link></li>
              <li><Link href="/tools/base64-encoder">Base64 Encoder</Link></li>
              <li><Link href="/tools/url-encoder">URL Encoder</Link></li>
            </ul>
          </div>

        </aside>

        {/* MAIN */}
        <main className="lg:col-span-7 space-y-12">
          <section id="example"><ToolExample toolName={tool.name} /></section>
          <section id="content"><ToolContent toolName={tool.name} /></section>
          <section id="faq"><ToolFAQ toolName={tool.name} /></section>
          <section id="related"><ToolRelated currentSlug={slug} /></section>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="lg:col-span-3 space-y-6">

          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold mb-3">Table of Contents</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li><a href="#example">Example Usage</a></li>
              <li><a href="#content">Tool Guide</a></li>
              <li><a href="#faq">FAQs</a></li>
              <li><a href="#related">Related Tools</a></li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-xl h-[250px] flex items-center justify-center text-muted">
            Ad Banner
          </div>

        </aside>

      </div>

    </div>
  )
}