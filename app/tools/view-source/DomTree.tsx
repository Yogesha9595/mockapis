"use client"

import { useMemo, useState, useEffect } from "react"

/**
 * 🌳 DOM Node Type
 */
export type Node = {
  id: number
  tag: string
  startIndex: number
  endIndex: number
  depth: number
  children: Node[]
}

/**
 * 🔥 HTML → Tree Parser
 */
function parseHtmlToTree(html: string): Node[] {
  const stack: Node[] = []
  const root: Node[] = []

  const tagRegex = /<\/?([a-zA-Z0-9-]+)([^>]*)>/g

  let match
  let id = 0

  while ((match = tagRegex.exec(html))) {
    const fullMatch = match[0]
    const tag = match[1].toLowerCase()
    const isClosing = fullMatch.startsWith("</")

    const isSelfClosing =
      fullMatch.endsWith("/>") ||
      ["meta", "img", "link", "br", "hr", "input"].includes(tag)

    if (!isClosing) {
      const node: Node = {
        id: id++,
        tag,
        startIndex: match.index,
        endIndex: match.index + fullMatch.length,
        depth: stack.length,
        children: [],
      }

      if (stack.length === 0) {
        root.push(node)
      } else {
        stack[stack.length - 1].children.push(node)
      }

      if (!isSelfClosing) {
        stack.push(node)
      }
    } else {
      if (stack.length > 0) {
        const last = stack.pop()
        if (last) {
          last.endIndex = match.index + fullMatch.length
        }
      }
    }
  }

  return root
}

/**
 * 🔍 FILTER TREE (NEW)
 */
function filterTree(nodes: Node[], query: string): Node[] {
  if (!query) return nodes

  return nodes
    .map((node) => {
      const match = node.tag.includes(query.toLowerCase())

      const children = filterTree(node.children, query)

      if (match || children.length > 0) {
        return { ...node, children }
      }

      return null
    })
    .filter(Boolean) as Node[]
}

/**
 * 🌳 Tree Node UI
 */
function TreeNode({
  node,
  onHover,
  onSelect,
  activeId,
  expandAll,
}: any) {
  const [open, setOpen] = useState(true)

  // 🔥 Sync expand/collapse all
  useEffect(() => {
    setOpen(expandAll)
  }, [expandAll])

  return (
    <li className="my-0.5">

      {/* Node */}
      <div
        className={`flex items-center gap-1 px-1 rounded cursor-pointer ${
          activeId === node.id
            ? "bg-yellow-200 text-black"
            : "hover:bg-gray-100 text-blue-600"
        }`}
        onMouseEnter={() => onHover(node)}
        onMouseLeave={() => onHover(null)}
        onClick={() => onSelect(node)}
      >
        {/* Toggle */}
        {node.children.length > 0 && (
          <span
            onClick={(e) => {
              e.stopPropagation()
              setOpen(!open)
            }}
            className="text-gray-400 text-xs"
          >
            {open ? "▼" : "▶"}
          </span>
        )}

        <span className="text-gray-400">&lt;</span>
        <span className="font-medium">{node.tag}</span>
        <span className="text-gray-400">&gt;</span>
      </div>

      {/* Children */}
      {open && node.children.length > 0 && (
        <ul className="pl-4 border-l border-gray-200">
          {node.children.map((child: Node) => (
            <TreeNode
              key={child.id}
              node={child}
              onHover={onHover}
              onSelect={onSelect}
              activeId={activeId}
              expandAll={expandAll}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

/**
 * 🚀 MAIN COMPONENT
 */
export default function DomTree({
  html,
  onHover,
  onSelect,
  activeId,
  searchQuery = "",
  expandAll = true,
}: {
  html: string
  onHover: (node: Node | null) => void
  onSelect: (node: Node) => void
  activeId: number | null
  searchQuery?: string
  expandAll?: boolean
}) {
  const parsedTree = useMemo(() => {
    if (!html) return []
    return parseHtmlToTree(html)
  }, [html])

  // 🔥 Apply search filter
  const filteredTree = useMemo(() => {
    return filterTree(parsedTree, searchQuery)
  }, [parsedTree, searchQuery])

  return (
    <div className="h-full overflow-auto p-3 bg-white text-xs">

      {filteredTree.length === 0 ? (
        <p className="text-gray-400">No results</p>
      ) : (
        <ul>
          {filteredTree.slice(0, 300).map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              onHover={onHover}
              onSelect={onSelect}
              activeId={activeId}
              expandAll={expandAll}
            />
          ))}
        </ul>
      )}
    </div>
  )
}