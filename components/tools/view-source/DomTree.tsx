"use client"

import { useEffect, useMemo, useState } from "react"

type NodeType = {
  id: string
  tag: string
  children: NodeType[]
}

type Props = {
  html: string
  onSelect?: (tag: string) => void
}

// Parse HTML safely
function parseHtml(html: string): NodeType[] {
  if (!html) return []

  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")

    let idCounter = 0

    function walk(node: Element): NodeType[] {
      return Array.from(node.children).map((child) => ({
        id: `node-${idCounter++}`,
        tag: child.tagName.toLowerCase(),
        children: walk(child as Element),
      }))
    }

    return walk(doc.body)
  } catch (err) {
    console.error("DOM parse error:", err)
    return []
  }
}

export default function DomTree({ html, onSelect }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // 🔥 Memoized parsing (IMPORTANT)
  const tree = useMemo(() => parseHtml(html), [html])

  // Auto expand first level
  useEffect(() => {
    const initial: Record<string, boolean> = {}
    tree.forEach((n) => (initial[n.id] = true))
    setExpanded(initial)
  }, [tree])

  const toggle = (id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleSelect = (node: NodeType) => {
    setSelectedId(node.id)
    onSelect?.(node.tag) // 🔥 IMPORTANT: pass tag (for editor scroll)
  }

  function renderNode(node: NodeType, depth = 0): React.ReactNode {
    const isOpen = expanded[node.id]
    const isSelected = selectedId === node.id

    return (
      <div key={node.id}>
        {/* Node Row */}
        <div
          className={`flex items-center gap-1 text-xs cursor-pointer group rounded px-1 ${
            isSelected ? "bg-zinc-800" : ""
          }`}
          style={{ paddingLeft: depth * 12 }}
        >
          {/* Expand icon */}
          {node.children.length > 0 ? (
            <span
              onClick={() => toggle(node.id)}
              className="text-zinc-500 group-hover:text-white"
            >
              {isOpen ? "▾" : "▸"}
            </span>
          ) : (
            <span className="w-[10px]" />
          )}

          {/* Tag */}
          <span
            onClick={() => handleSelect(node)}
            className="text-blue-400 hover:text-blue-300"
          >
            {"<"}
            {node.tag}
            {">"}
          </span>
        </div>

        {/* Children */}
        {isOpen &&
          node.children.map((child) =>
            renderNode(child, depth + 1)
          )}
      </div>
    )
  }

  return (
    <div className="p-2 text-xs font-mono text-zinc-300 h-full overflow-auto">

      {/* Header */}
      <div className="mb-2 text-zinc-500 flex justify-between">
        <span>DOM Tree</span>

        {/* Expand / Collapse All */}
        {tree.length > 0 && (
          <button
            onClick={() => {
              const all: Record<string, boolean> = {}
              const walk = (nodes: NodeType[]) => {
                nodes.forEach((n) => {
                  all[n.id] = true
                  walk(n.children)
                })
              }
              walk(tree)
              setExpanded(all)
            }}
            className="hover:text-white"
          >
            Expand All
          </button>
        )}
      </div>

      {/* Content */}
      {tree.length === 0 ? (
        <div className="text-zinc-500">No DOM available</div>
      ) : (
        tree.map((node) => renderNode(node))
      )}
    </div>
  )
}