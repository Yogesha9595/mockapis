"use client"

import { useState } from "react"
import DomTree, { Node } from "./DomTree"
import BoxModel from "./BoxModel"

type Props = {
  insights: any
  html: string
  onSelect: (node: Node) => void
  onHover: (node: Node | null) => void
  activeId: number | null
  hoveredElement?: any
}

export default function RightPanel({
  insights,
  html,
  onSelect,
  onHover,
  activeId,
  hoveredElement,
}: Props) {
  const [tab, setTab] = useState<"structure" | "insights" | "box">("structure")

  // 🔥 NEW STATES
  const [search, setSearch] = useState("")
  const [expandAll, setExpandAll] = useState(true)

  return (
    <div className="w-[320px] border-l bg-white flex flex-col">

      {/* 🔹 Tabs */}
      <div className="flex border-b text-sm">
        <TabButton
          active={tab === "structure"}
          onClick={() => setTab("structure")}
        >
          Structure
        </TabButton>

        <TabButton
          active={tab === "insights"}
          onClick={() => setTab("insights")}
        >
          Insights
        </TabButton>

        <TabButton
          active={tab === "box"}
          onClick={() => setTab("box")}
        >
          Box
        </TabButton>
      </div>

      {/* 🔹 Content */}
      <div className="flex-1 overflow-auto">

        {/* 🌳 DOM TREE */}
        {tab === "structure" && (
          <>
            {/* 🔥 SEARCH + CONTROLS */}
            <div className="p-2 border-b flex items-center gap-2 bg-gray-50">

              <input
                placeholder="Search tag (div, img, h1...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 border px-2 py-1 text-xs rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />

              <button
                onClick={() => setExpandAll(true)}
                className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Expand
              </button>

              <button
                onClick={() => setExpandAll(false)}
                className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Collapse
              </button>
            </div>

            <DomTree
              html={html}
              onSelect={onSelect}
              onHover={onHover}
              activeId={activeId}
              searchQuery={search}
              expandAll={expandAll}
            />
          </>
        )}

        {/* 📊 SEO INSIGHTS */}
        {tab === "insights" && insights && (
          <div className="p-4 text-sm space-y-3">

            <Section title="SEO">
              <Row label="Title" value={insights.title} />
              <Row label="Description" value={insights.metaDescription} />
              <Row label="Canonical" value={insights.canonical} />
            </Section>

            <Section title="Headings">
              <Row label="H1" value={insights.headings.h1.length} />
              <Row label="H2" value={insights.headings.h2.length} />
              <Row label="H3" value={insights.headings.h3.length} />
            </Section>

            <Section title="Links">
              <Row label="Total" value={insights.links.total} />
              <Row label="Internal" value={insights.links.internal} />
              <Row label="External" value={insights.links.external} />
            </Section>

            <Section title="Media">
              <Row label="Images" value={insights.images.total} />
              <Row label="Missing Alt" value={insights.images.missingAlt} />
            </Section>

            <Section title="Scripts">
              <Row label="Total" value={insights.scripts} />
            </Section>

          </div>
        )}

        {/* 📦 BOX MODEL */}
        {tab === "box" && (
          <BoxModel element={hoveredElement || null} />
        )}
      </div>
    </div>
  )
}

/**
 * 🔹 Tab Button
 */
function TabButton({
  children,
  active,
  onClick,
}: any) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 p-3 transition ${
        active
          ? "bg-gray-100 font-semibold"
          : "hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  )
}

/**
 * 🔹 Section Wrapper
 */
function Section({ title, children }: any) {
  return (
    <div>
      <h3 className="font-semibold text-gray-700 mb-1">
        {title}
      </h3>
      <div className="space-y-1">{children}</div>
    </div>
  )
}

/**
 * 🔹 Row
 */
function Row({ label, value }: any) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800 truncate max-w-[140px]">
        {value || "-"}
      </span>
    </div>
  )
}