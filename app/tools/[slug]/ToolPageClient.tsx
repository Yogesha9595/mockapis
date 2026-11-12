"use client"

import { useRef, useState } from "react"
import Link from "next/link"

import { tools, isLive } from "@/data/tools"
import { getToolDefinition, type ToolAction, type EditorLanguage } from "@/lib/tools/engine"

import CodeEditor from "@/components/tools/CodeEditor"
import ToolContent from "@/components/tools/ToolContent"
import ToolFAQ from "@/components/tools/ToolFAQ"
import ToolExample from "@/components/tools/ToolExample"
import ToolRelated from "@/components/tools/ToolRelated"

const FILE_EXTENSION: Record<EditorLanguage, string> = {
  json: "json",
  plaintext: "txt",
  html: "html",
  css: "css",
  xml: "xml",
  yaml: "yaml",
}

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024

/* Same quick links the sidebar always had; non-working tools are skipped */
const SIDEBAR_SLUGS = ["json-formatter", "json-validator", "json-minify", "base64-encoder", "url-encoder"]

const buttonBase =
  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
const primaryButton = `${buttonBase} bg-green-600 text-white hover:bg-green-700`
const secondaryButton = `${buttonBase} border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800`

// ✅ RECEIVE SLUG FROM SERVER
export default function ToolPageClient({ slug }: { slug: string }) {
  const tool = tools.find((t) => t.slug === slug)
  const definition = getToolDefinition(slug)

  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  /* ❌ NOT FOUND (unreachable: unknown slugs 404 on the server) */
  if (!tool) return null

  /* ---------------- UNFINISHED TOOL: no fake controls ---------------- */
  if (!definition || !isLive(tool)) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{tool.name}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">{tool.description}</p>

        <div
          role="status"
          className="mt-8 max-w-2xl rounded-xl border border-amber-300 bg-amber-50 p-5 text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100"
        >
          <p className="font-semibold">This tool is not available yet.</p>
          <p className="mt-1 text-sm">
            We list it so you know it is planned, but it does not work yet, so there is nothing to run here.
          </p>
          <Link href="/tools" className="mt-3 inline-block text-sm font-medium underline">
            Browse working tools →
          </Link>
        </div>

        <section id="related" className="mt-12">
          <ToolRelated currentSlug={slug} />
        </section>
      </div>
    )
  }

  /* ---------------- ACTIONS ---------------- */

  const runAction = (action: ToolAction) => {
    setNotice("")
    const result = action.run(input)
    if (result.ok) {
      setOutput(result.output)
      setError("")
    } else {
      setOutput("")
      setError(result.error)
    }
  }

  const handleClear = () => {
    setInput("")
    setOutput("")
    setError("")
    setNotice("")
  }

  const handleExample = () => {
    setInput(definition.sample)
    setOutput("")
    setError("")
    setNotice("Example loaded. Press " + definition.primary.label + ".")
  }

  const handleCopy = async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setNotice("Copied to clipboard.")
    } catch {
      setNotice("Copy failed: your browser blocked clipboard access. Select the output and copy it manually.")
    }
  }

  const handleDownload = () => {
    if (!output) return
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${slug}-result.${FILE_EXTENSION[definition.outputLanguage]}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    if (file.size > MAX_UPLOAD_BYTES) {
      setError(`That file is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is 5 MB.`)
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setInput(reader.result)
        setError("")
        setNotice(`Loaded ${file.name}.`)
      }
    }
    reader.onerror = () => setError(`Could not read ${file.name}.`)
    reader.readAsText(file)
  }

  const actions = [definition.primary, ...(definition.extra ?? [])]

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10">

      {/* HEADER */}
      <div className="max-w-5xl mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{tool.name}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">{tool.description}</p>
      </div>

      {/* ACTION BAR */}
      <div className="flex flex-wrap items-center gap-2 mb-4" role="toolbar" aria-label={`${tool.name} actions`}>
        {actions.map((action, i) => (
          <button
            key={action.label}
            type="button"
            onClick={() => runAction(action)}
            className={i === 0 ? primaryButton : secondaryButton}
          >
            {action.label}
          </button>
        ))}

        <span className="mx-1 hidden h-6 w-px bg-gray-300 dark:bg-gray-700 sm:block" aria-hidden="true" />

        <button type="button" onClick={handleExample} className={secondaryButton}>
          Load example
        </button>

        {definition.accept && (
          <>
            <button type="button" onClick={() => fileInputRef.current?.click()} className={secondaryButton}>
              Upload file
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept={definition.accept}
              className="hidden"
              onChange={handleUpload}
              aria-label="Upload a file as input"
            />
          </>
        )}

        <button type="button" onClick={handleCopy} disabled={!output} className={secondaryButton}>
          Copy output
        </button>
        <button type="button" onClick={handleDownload} disabled={!output} className={secondaryButton}>
          Download
        </button>
        <button type="button" onClick={handleClear} disabled={!input && !output && !error} className={secondaryButton}>
          Clear
        </button>
      </div>

      {/* FEEDBACK */}
      <div aria-live="polite" className="min-h-6 mb-3 text-sm">
        {error ? (
          <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            {error}
          </p>
        ) : (
          notice && <p className="text-gray-600 dark:text-gray-400">{notice}</p>
        )}
      </div>

      {/* EDITORS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section aria-label={definition.inputLabel}>
          <h2 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">{definition.inputLabel}</h2>
          <CodeEditor
            value={input}
            onChange={setInput}
            language={definition.inputLanguage}
            ariaLabel={definition.inputLabel}
            placeholder={definition.inputPlaceholder}
          />
        </section>

        <section aria-label={definition.outputLabel}>
          <h2 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">{definition.outputLabel}</h2>
          <CodeEditor
            value={output}
            readOnly
            language={definition.outputLanguage}
            ariaLabel={definition.outputLabel}
          />
        </section>
      </div>

      {/* CONTENT + SIDEBAR */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3 lg:order-2" aria-label="Developer tools">
          <nav className="rounded-xl border border-gray-200 bg-white p-5 text-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="font-semibold mb-3">Developer Tools</h2>
            <ul className="space-y-2">
              {SIDEBAR_SLUGS.filter((s) => s !== slug).map((s) => {
                const t = tools.find((x) => x.slug === s)
                if (!t || !isLive(t)) return null
                return (
                  <li key={s}>
                    <Link href={`/tools/${s}`} className="text-gray-600 hover:text-green-700 hover:underline dark:text-gray-400 dark:hover:text-green-400">
                      {t.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>

        <div className="lg:col-span-9 lg:order-1 max-w-4xl space-y-12">
          <section id="example"><ToolExample toolName={tool.name} /></section>
          <section id="content"><ToolContent toolName={tool.name} /></section>
          <section id="faq"><ToolFAQ toolName={tool.name} /></section>
          <section id="related"><ToolRelated currentSlug={slug} /></section>
        </div>
      </div>

    </div>
  )
}
