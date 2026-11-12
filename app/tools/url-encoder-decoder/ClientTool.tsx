"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

import { urlDecode, urlEncode, URL_MODES, type UrlMode } from "@/lib/tools/url"
import { base64DecodeTool, base64EncodeTool } from "@/lib/tools/base64"
import { hashText, HASH_ALGORITHMS, type HashAlgorithm } from "@/lib/tools/hash"
import type { ToolResult } from "@/lib/tools/types"

type Tool = "url" | "base64" | "hash"
type Direction = "encode" | "decode"

const TOOLS: { value: Tool; label: string }[] = [
  { value: "url", label: "URL" },
  { value: "base64", label: "Base64" },
  { value: "hash", label: "Hash (SHA)" },
]

const MAX_FILE_BYTES = 5 * 1024 * 1024
/* Keep shared links to a size browsers and servers reliably accept */
const MAX_SHARE_CHARS = 2000

const btn =
  "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
const btnSecondary = `${btn} border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800`
const segment = (active: boolean) =>
  `${btn} ${active ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"}`
const textarea =
  "block w-full min-h-48 resize-y rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"

export default function ClientTool() {
  const searchParams = useSearchParams()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [tool, setTool] = useState<Tool>("url")
  const [direction, setDirection] = useState<Direction>("encode")
  const [urlMode, setUrlMode] = useState<UrlMode>("component")
  const [hashType, setHashType] = useState<HashAlgorithm>("SHA-256")
  const [input, setInput] = useState("")
  const [hashOutput, setHashOutput] = useState("")
  const [notice, setNotice] = useState("")

  /* ✅ INIT FROM SHARED LINK */
  useEffect(() => {
    const t = searchParams.get("tool")
    const d = searchParams.get("mode")
    const m = searchParams.get("variant")
    const val = searchParams.get("input")
    if (t === "url" || t === "base64" || t === "hash") setTool(t)
    if (d === "encode" || d === "decode") setDirection(d)
    if (m === "component" || m === "full" || m === "form") setUrlMode(m)
    // searchParams.get() already decodes the value once
    if (val) setInput(val)
  }, [searchParams])

  /* ✅ CONVERT (synchronous tools) */
  const result: ToolResult | null = useMemo(() => {
    if (tool === "hash") return null
    if (tool === "url") return direction === "encode" ? urlEncode(input, urlMode) : urlDecode(input, urlMode)
    return direction === "encode" ? base64EncodeTool(input) : base64DecodeTool(input)
  }, [tool, direction, urlMode, input])

  /* ✅ HASH (async Web Crypto) */
  useEffect(() => {
    if (tool !== "hash") return
    let cancelled = false
    hashText(input, hashType).then((h) => !cancelled && setHashOutput(h))
    return () => {
      cancelled = true
    }
  }, [tool, input, hashType])

  const output = tool === "hash" ? hashOutput : result?.ok ? result.output : ""
  const error = tool !== "hash" && result && !result.ok ? result.error : ""

  /* ---------------- ACTIONS ---------------- */

  const copy = async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setNotice("Output copied to clipboard.")
    } catch {
      setNotice("Copy failed: your browser blocked clipboard access.")
    }
  }

  const share = async () => {
    if (input.length > MAX_SHARE_CHARS) {
      setNotice(`The input is too long to share as a link (limit ${MAX_SHARE_CHARS} characters).`)
      return
    }
    const params = new URLSearchParams({ tool, mode: direction, variant: urlMode, input })
    const link = `${window.location.origin}/tools/url-encoder-decoder?${params}`
    try {
      await navigator.clipboard.writeText(link)
      setNotice("Shareable link copied. Anyone with the link can see the input text.")
    } catch {
      setNotice("Copy failed: your browser blocked clipboard access.")
    }
  }

  const swap = () => {
    if (!output || tool === "hash") return
    setInput(output)
    setDirection(direction === "encode" ? "decode" : "encode")
    setNotice("Output moved to input and direction reversed.")
  }

  const download = () => {
    if (!output) return
    const url = URL.createObjectURL(new Blob([output], { type: "text/plain;charset=utf-8" }))
    const a = document.createElement("a")
    a.href = url
    a.download = `${tool}-${tool === "hash" ? hashType.toLowerCase() : direction}d.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const clear = () => {
    setInput("")
    setNotice("")
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    if (file.size > MAX_FILE_BYTES) {
      setNotice(`That file is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is 5 MB.`)
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setInput(typeof reader.result === "string" ? reader.result : "")
      setNotice(`Loaded ${file.name} as text.`)
    }
    reader.onerror = () => setNotice(`Could not read ${file.name}.`)
    reader.readAsText(file)
  }

  const modeHint = URL_MODES.find((m) => m.value === urlMode)?.hint

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">URL Encoder &amp; Decoder</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Percent-encode or decode URLs and query strings, including Unicode text and emoji. Also converts Base64 and
          computes SHA hashes. Everything runs in your browser; nothing is uploaded.
        </p>
      </header>

      {/* CONTROLS */}
      <div className="flex flex-wrap items-center gap-3">
        <div role="tablist" aria-label="Tool" className="inline-flex rounded-lg border border-gray-300 p-1 dark:border-gray-700">
          {TOOLS.map((t) => (
            <button key={t.value} role="tab" aria-selected={tool === t.value} type="button" onClick={() => setTool(t.value)} className={segment(tool === t.value)}>
              {t.label}
            </button>
          ))}
        </div>

        {tool !== "hash" && (
          <div role="radiogroup" aria-label="Direction" className="inline-flex rounded-lg border border-gray-300 p-1 dark:border-gray-700">
            {(["encode", "decode"] as Direction[]).map((d) => (
              <button key={d} role="radio" aria-checked={direction === d} type="button" onClick={() => setDirection(d)} className={segment(direction === d)}>
                {d === "encode" ? "Encode" : "Decode"}
              </button>
            ))}
          </div>
        )}

        {tool === "url" && (
          <label className="flex items-center gap-2 text-sm">
            <span className="text-gray-700 dark:text-gray-300">Type</span>
            <select
              value={urlMode}
              onChange={(e) => setUrlMode(e.target.value as UrlMode)}
              className="rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
            >
              {URL_MODES.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </label>
        )}

        {tool === "hash" && (
          <label className="flex items-center gap-2 text-sm">
            <span className="text-gray-700 dark:text-gray-300">Algorithm</span>
            <select
              value={hashType}
              onChange={(e) => setHashType(e.target.value as HashAlgorithm)}
              className="rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
            >
              {HASH_ALGORITHMS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </label>
        )}
      </div>

      {tool === "url" && modeHint && <p className="text-sm text-gray-600 dark:text-gray-400">{modeHint}</p>}

      {/* EDITORS */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label htmlFor="udt-input" className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Input
          </label>
          <textarea
            id="udt-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={tool === "url" && direction === "decode" ? "e.g. caf%C3%A9%20%26%20co" : "Type or paste text"}
            spellCheck={false}
            className={textarea}
          />
        </div>
        <div>
          <label htmlFor="udt-output" className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Output <span className="font-normal text-gray-500">(updates as you type)</span>
          </label>
          <textarea id="udt-output" value={output} readOnly spellCheck={false} className={`${textarea} bg-gray-50 dark:bg-gray-900`} />
        </div>
      </div>

      {/* FEEDBACK */}
      <div aria-live="polite" className="min-h-6 text-sm">
        {error ? (
          <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            {error}
          </p>
        ) : (
          notice && <p className="text-gray-600 dark:text-gray-400">{notice}</p>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={copy} disabled={!output} className={btnSecondary}>Copy output</button>
        {tool !== "hash" && (
          <button type="button" onClick={swap} disabled={!output} className={btnSecondary}>Use output as input</button>
        )}
        <button type="button" onClick={download} disabled={!output} className={btnSecondary}>Download</button>
        <button type="button" onClick={share} disabled={!input} className={btnSecondary}>Copy share link</button>
        <button type="button" onClick={() => fileInputRef.current?.click()} className={btnSecondary}>Load text file</button>
        <input ref={fileInputRef} type="file" accept=".txt,.csv,.json,.html,.xml,text/*" className="hidden" onChange={handleFile} aria-label="Load a text file as input" />
        <button type="button" onClick={clear} disabled={!input} className={btnSecondary}>Clear</button>
      </div>

      <p className="text-sm">
        <Link href="/tools" className="text-green-700 underline hover:text-green-800 dark:text-green-400">← All tools</Link>
      </p>
    </div>
  )
}
