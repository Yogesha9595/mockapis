"use client"

import { useState, useEffect, useRef } from "react"
import DomTree from "./DomTree"
import SeoPanel from "./SeoPanel"

type Props = {
  code: string
  children: React.ReactNode
  onSelect?: (tag: string) => void
}

export default function Layout({ code, children, onSelect }: Props) {
  const [leftWidth, setLeftWidth] = useState(22)
  const [isDragging, setIsDragging] = useState(false)

  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function move(e: MouseEvent) {
      if (!isDragging || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const percent = ((e.clientX - rect.left) / rect.width) * 100

      const clamped = Math.min(Math.max(percent, 18), 40)
      setLeftWidth(clamped)
    }

    function up() {
      setIsDragging(false)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }

    if (isDragging) {
      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"
    }

    window.addEventListener("mousemove", move)
    window.addEventListener("mouseup", up)

    return () => {
      window.removeEventListener("mousemove", move)
      window.removeEventListener("mouseup", up)
    }
  }, [isDragging])

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a]">

      {/* 🔥 HEADER */}
      <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/70 backdrop-blur flex items-center justify-between">
        <h1 className="text-sm font-semibold text-zinc-200">
          View Source Analyzer
        </h1>

        <span className="text-xs text-zinc-500">
          mockapis.in
        </span>
      </div>

      {/* 🔥 MAIN CONTENT */}
      <div
        ref={containerRef}
        className="flex flex-1 overflow-hidden p-3 gap-3"
      >

        {/* LEFT PANEL */}
        <div
          style={{ width: `${leftWidth}%` }}
          className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden min-w-[220px]"
        >
          <div className="px-3 py-2 border-b border-zinc-800 text-xs text-zinc-400">
            DOM Tree
          </div>

          <div className="h-full overflow-auto p-2">
            <DomTree html={code} onSelect={onSelect} />
          </div>
        </div>

        {/* RESIZER */}
        <div
          onMouseDown={() => setIsDragging(true)}
          onDoubleClick={() => setLeftWidth(22)}
          className={`w-[4px] rounded cursor-col-resize ${
            isDragging
              ? "bg-blue-500"
              : "bg-zinc-700 hover:bg-blue-500"
          }`}
        />

        {/* CENTER + RIGHT */}
        <div className="flex flex-1 gap-3 min-w-0">

          {/* CODE PANEL */}
          <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex flex-col">
            <div className="px-3 py-2 border-b border-zinc-800 text-xs text-zinc-400">
              Source Code
            </div>

            <div className="flex-1 overflow-hidden">
              {children}
            </div>
          </div>

          {/* SEO PANEL */}
          <div className="w-[280px] bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <div className="px-3 py-2 border-b border-zinc-800 text-xs text-zinc-400">
              SEO Insights
            </div>

            <div className="h-full overflow-auto">
              <SeoPanel html={code} />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}