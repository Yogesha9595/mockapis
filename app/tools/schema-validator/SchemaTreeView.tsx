"use client"

import { useState } from "react"

function TreeNode({ data, name }: any) {
  const [open, setOpen] = useState(true)

  const isObject =
    typeof data === "object" && data !== null

  if (!isObject) {
    return (
      <div className="ml-4 text-xs">
        <span className="text-gray-500">{name}: </span>
        <span className="text-green-700">
          {JSON.stringify(data)}
        </span>
      </div>
    )
  }

  return (
    <div className="ml-2 text-xs">

      {/* Node Header */}
      <div
        onClick={() => setOpen(!open)}
        className="cursor-pointer flex items-center gap-1 text-gray-800"
      >
        <span className="text-gray-400">
          {open ? "▼" : "▶"}
        </span>

        <span className="font-medium">
          {name}
        </span>

        <span className="text-gray-400">
          {Array.isArray(data) ? "[ ]" : "{ }"}
        </span>
      </div>

      {/* Children */}
      {open && (
        <div className="ml-4 border-l pl-2 mt-1">
          {Object.entries(data).map(
            ([key, value], idx) => (
              <TreeNode
                key={idx}
                name={key}
                data={value}
              />
            )
          )}
        </div>
      )}
    </div>
  )
}

export default function SchemaTreeView({ data }: any) {
  if (!data) return null

  return (
    <div className="bg-gray-100 p-3 rounded overflow-auto max-h-72 text-xs">
      <TreeNode name="root" data={data} />
    </div>
  )
}