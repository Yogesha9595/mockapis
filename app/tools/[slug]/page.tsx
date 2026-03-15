"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
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

if (!tool) {
return ( <div className="py-20 text-center"> <h1 className="text-2xl font-semibold">
Tool not found </h1> </div>
)
}

/* ---------------- TOOL ACTIONS ---------------- */

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

try {
  await navigator.clipboard.writeText(output)
} catch {
  console.warn("Clipboard copy failed")
}

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

/* -------- Generate Categories From tools.ts -------- */

const categories = tools.reduce((acc: Record<string, Tool[]>, tool: Tool) => {

if (!tool.category) return acc

if (!acc[tool.category]) {
  acc[tool.category] = []
}

acc[tool.category].push(tool)

return acc

}, {})

return (

<div className="w-full px-6 py-10">

  {/* PAGE HEADER */}

  <h1 className="text-3xl font-bold">
    {tool.name}
  </h1>

  <p className="text-gray-500 mt-2">
    {tool.description ?? ""}
  </p>


  {/* ================= TOOL EDITOR ================= */}

  <div className="mt-8 grid grid-cols-12 gap-6">

    {/* INPUT */}

    <div className="col-span-5 border rounded-lg overflow-hidden">

      <CodeEditor
        value={input}
        onChange={setInput}
        language="json"
      />

    </div>


    {/* ACTION PANEL */}

    <div className="col-span-2 flex flex-col gap-3">

      <label className="bg-teal-500 text-white text-center py-2 rounded cursor-pointer">
        Upload JSON
        <input
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleUpload}
        />
      </label>

      <button
        onClick={handleValidate}
        className="bg-teal-500 text-white py-2 rounded"
      >
        Validate
      </button>

      <button
        onClick={handleRun}
        className="bg-teal-600 text-white py-2 rounded"
      >
        Format / Beautify
      </button>

      <button
        onClick={handleMinify}
        className="bg-teal-500 text-white py-2 rounded"
      >
        Minify / Compact
      </button>

      <button
        onClick={handleCopy}
        className="bg-green-600 text-white py-2 rounded"
      >
        Copy
      </button>

      <button
        onClick={handleDownload}
        className="bg-gray-700 text-white py-2 rounded"
      >
        Download
      </button>

      <button
        onClick={handleClear}
        className="bg-gray-200 py-2 rounded"
      >
        Clear
      </button>

    </div>


    {/* OUTPUT */}

    <div className="col-span-5 border rounded-lg overflow-hidden">

      <CodeEditor
        value={output}
        readOnly
        language="json"
      />

    </div>

  </div>


  {/* ================= BLOG CONTENT ================= */}

  <div className="mt-16 max-w-[1400px] mx-auto grid grid-cols-12 gap-8">

    {/* LEFT SIDEBAR */}

    <aside className="col-span-2 space-y-6 text-sm">

      {/* Developer Tools */}

      <div className="border rounded-xl p-5 bg-white shadow-sm">

        <h3 className="font-semibold mb-3 text-gray-800">
          Developer Tools
        </h3>

        <ul className="space-y-2 text-gray-700">

          <li><Link href="/tools/json-formatter">JSON Formatter</Link></li>
          <li><Link href="/tools/json-validator">JSON Validator</Link></li>
          <li><Link href="/tools/json-minify">JSON Minify</Link></li>
          <li><Link href="/tools/base64-encoder">Base64 Encoder</Link></li>
          <li><Link href="/tools/url-encoder">URL Encoder</Link></li>

        </ul>

      </div>


      {/* Popular Tools */}

      <div className="border rounded-xl p-5 bg-white shadow-sm">

        <h3 className="font-semibold mb-3 text-gray-800">
          Popular Tools
        </h3>

        <ul className="space-y-2 text-gray-700">

          <li><Link href="/tools/json-formatter">JSON Formatter</Link></li>
          <li><Link href="/tools/uuid-generator">UUID Generator</Link></li>
          <li><Link href="/tools/base64-decoder">Base64 Decoder</Link></li>
          <li><Link href="/tools/timestamp-converter">Timestamp Converter</Link></li>

        </ul>

      </div>


      {/* Tool Categories */}

      <div className="border rounded-xl p-5 bg-white shadow-sm">

        <h3 className="font-semibold mb-4 text-gray-800">
          Tool Categories
        </h3>

        <div className="space-y-4">

          {Object.entries(categories).map(([category, list]) => {

            const title =
              category.charAt(0).toUpperCase() + category.slice(1)

            const visibleTools = list.slice(0, 4)

            return (

              <div key={category}>

                <p className="font-medium text-gray-800 mb-1">
                  {title} Tools
                </p>

                <ul className="space-y-1 pl-2 text-gray-700">

                  {visibleTools.map((tool) => (

                    <li key={tool.slug}>

                      <Link
                        href={`/tools/${tool.slug}`}
                        className="hover:text-blue-600"
                      >
                        {tool.name}
                      </Link>

                    </li>

                  ))}

                  <li>

                    <Link
                      href={`/tools/category/${category}`}
                      className="text-blue-600 text-xs"
                    >
                      View all →
                    </Link>

                  </li>

                </ul>

              </div>

            )

          })}

        </div>

      </div>

    </aside>


    {/* MAIN CONTENT */}

    <main className="col-span-7 space-y-12">

      <section id="example">
        <ToolExample toolName={tool.name} />
      </section>

      <section id="content">
        <ToolContent toolName={tool.name} />
      </section>

      <section id="faq">
        <ToolFAQ toolName={tool.name} />
      </section>

      <section id="related">
        <ToolRelated currentSlug={slug} />
      </section>

    </main>


    {/* RIGHT SIDEBAR */}

    <aside className="col-span-3 space-y-6">

      <div className="border rounded-xl p-5 bg-white shadow-sm">

        <h3 className="font-semibold mb-3 text-gray-800">
          Table of Contents
        </h3>

        <ul className="space-y-2 text-sm text-gray-700">

          <li><a href="#example">Example Usage</a></li>
          <li><a href="#content">Tool Guide</a></li>
          <li><a href="#faq">FAQs</a></li>
          <li><a href="#related">Related Tools</a></li>

        </ul>

      </div>

      <div className="border rounded-xl h-[250px] flex items-center justify-center text-gray-400">
        Ad Banner
      </div>

      <div className="border rounded-xl h-[250px] flex items-center justify-center text-gray-400">
        Ad Banner
      </div>

    </aside>

  </div>

</div>


)
}
