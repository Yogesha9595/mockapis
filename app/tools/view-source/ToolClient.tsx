"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { beautifyHtml } from "@/lib/beautifyHtml"
import { extractInsights } from "@/lib/extractInsights"
import MonacoViewer from "./MonacoViewer"
import RightPanel from "./RightPanel"
import LivePreview from "./LivePreview"
import { getRangeFromNode } from "@/lib/htmlPositionMapper"

export default function ToolClient() {
  // 🔹 Core state
  const [url, setUrl] = useState("")
  const [inputHtml, setInputHtml] = useState("")
  const [output, setOutput] = useState("")
  const [insights, setInsights] = useState<any>(null)

  // 🔹 UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  // 🔹 DevTools state
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null)
  const [hoveredElement, setHoveredElement] = useState<any>(null)

  // 🔹 Resizable panels
  const [leftWidth, setLeftWidth] = useState(55)
  const [rightWidth, setRightWidth] = useState(25)

  const containerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<any>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const draggingLeft = useRef(false)
  const draggingRight = useRef(false)

  // 🚀 PROCESS HTML
  const processHtml = useCallback(async (html: string) => {
    if (!html?.trim()) {
      setOutput("")
      setInsights(null)
      return
    }

    try {
      const pretty = await beautifyHtml(html)
      const safe = pretty || html.replace(/></g, ">\n<")

      setOutput(safe)
      setInsights(extractInsights(html))
      setError("")
    } catch {
      const fallback = html.replace(/></g, ">\n<")
      setOutput(fallback)
      setInsights(extractInsights(html))
      setError("Beautifier fallback used")
    }
  }, [])

  // ⏱️ Debounce
  const handleInputChange = (val: string) => {
    setInputHtml(val)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      processHtml(val)
    }, 400)
  }

  // 🌐 Fetch
  const fetchHtml = async () => {
    if (!url.trim()) return setError("Enter a valid URL")

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/fetch-html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setInputHtml(data.html)
      processHtml(data.html)
    } catch (err: any) {
      setError(err.message)
      setOutput("")
    } finally {
      setLoading(false)
    }
  }

  // 🎯 Node select
  const handleNodeSelect = (node: any) => {
    setActiveNodeId(node.id)

    const range = getRangeFromNode(output, node)
    if (!range || !editorRef.current) return

    editorRef.current.deltaDecorations([], [
      {
        range,
        options: { className: "bg-yellow-400/40" },
      },
    ])

    editorRef.current.revealLineInCenter(range.startLineNumber)
  }

  // 📦 Actions
  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const download = () => {
    const blob = new Blob([output], { type: "text/html" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = "source.html"
    a.click()
  }

  const share = () => {
    const encoded = encodeURIComponent(inputHtml.slice(0, 2000))
    const link = `${window.location.origin}${window.location.pathname}?input=${encoded}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 🧠 Resize logic
  const onMouseMove = (e: MouseEvent) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const percent = ((e.clientX - rect.left) / rect.width) * 100

    if (draggingLeft.current && percent > 20 && percent < 70) {
      setLeftWidth(percent)
    }

    if (draggingRight.current) {
      const right = 100 - percent
      if (right > 20 && right < 40) setRightWidth(right)
    }
  }

  const stopDrag = () => {
    draggingLeft.current = false
    draggingRight.current = false
    document.removeEventListener("mousemove", onMouseMove)
    document.removeEventListener("mouseup", stopDrag)
  }

  const startLeftDrag = () => {
    draggingLeft.current = true
    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", stopDrag)
  }

  const startRightDrag = () => {
    draggingRight.current = true
    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", stopDrag)
  }

  const centerWidth = 100 - leftWidth - rightWidth

  return (
    <div className="w-full space-y-8">

      {/* 🔥 HERO */}
      <div className="bg-white border rounded-xl p-6 shadow-sm max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">
          View Page Source & HTML Beautifier
        </h1>

        <div className="flex gap-3">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            onClick={fetchHtml}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-lg text-sm"
          >
            {loading ? "Fetching..." : "Fetch"}
          </button>
        </div>

        <textarea
          value={inputHtml}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Paste HTML..."
          className="w-full mt-4 h-32 border rounded-lg p-3 text-sm"
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {/* 🔥 DEVTOOLS */}
      {output && (
        <>
          <div
            ref={containerRef}
            className="w-full h-[650px] flex border rounded-xl overflow-hidden"
          >
            {/* Editor */}
            <div style={{ width: `${leftWidth}%` }}>
              <MonacoViewer
                code={output}
                onMount={(ed: any) => (editorRef.current = ed)}
              />
            </div>

            {/* Divider */}
            <div onMouseDown={startLeftDrag} className="w-1 bg-gray-300 cursor-col-resize hover:bg-blue-500" />

            {/* Preview */}
            <div style={{ width: `${centerWidth}%` }}>
              <LivePreview html={output} onHover={setHoveredElement} />
            </div>

            {/* Divider */}
            <div onMouseDown={startRightDrag} className="w-1 bg-gray-300 cursor-col-resize hover:bg-blue-500" />

            {/* Right Panel */}
            <div style={{ width: `${rightWidth}%` }}>
              <RightPanel
                html={output}
                insights={insights}
                onSelect={handleNodeSelect}
                onHover={setHoveredElement}
                activeId={activeNodeId}
                hoveredElement={hoveredElement}
              />
            </div>
          </div>

          {/* 🔥 ACTION BUTTONS (CENTERED CLEAN) */}
          <div className="flex justify-center">
            <div className="flex gap-4 bg-white px-6 py-3 rounded-xl shadow border">
              <button onClick={copy} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                {copied ? "Copied!" : "Copy"}
              </button>

              <button onClick={download} className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg">
                Download
              </button>

              <button onClick={share} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
                Share
              </button>
            </div>
          </div>

          {/* 💰 AD BLOCK */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-gray-100 border rounded-lg text-center py-6 text-sm text-gray-500">
              Ad Banner (728x90)
            </div>
          </div>
        </>
      )}
    </div>
  )
}