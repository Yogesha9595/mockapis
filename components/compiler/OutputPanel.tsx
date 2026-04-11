"use client"

import { useState, useEffect } from "react"
import { FiTrash2, FiCopy } from "react-icons/fi"

export default function OutputPanel({
  stdout,
  stderr,
  info,
  execution,
  testResults,
  loading,
  onClear
}: any) {

  const [activeTab, setActiveTab] = useState<"output" | "error" | "info" | "tests">("output")

  // 🔥 Auto switch to error tab
  useEffect(() => {
    if (stderr) setActiveTab("error")
    else setActiveTab("output")
  }, [stdout, stderr])

  // 📋 COPY
  function copyOutput() {
    const text =
      activeTab === "output"
        ? stdout
        : activeTab === "error"
        ? stderr
        : activeTab === "info"
        ? `${info}

Execution Time: ${execution?.time || "N/A"}
Memory: ${execution?.memory || "N/A"}`
        : testResults?.join("\n\n")

    navigator.clipboard.writeText(text || "")
  }

  const tabs = [
    { key: "output", label: "Output" },
    { key: "error", label: "Errors" },
    { key: "info", label: "Info" },
    { key: "tests", label: "Tests" }
  ]

  // 🎯 STATUS
  const status = loading
    ? "Running"
    : stderr
    ? "Error"
    : "Success"

  return (
    <div className="flex flex-col h-full bg-zinc-950 border-b border-zinc-800">

      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">

        {/* LEFT */}
        <div className="flex items-center gap-3">

          {/* TABS */}
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-3 py-1 text-xs rounded-md transition capitalize
                  ${
                    activeTab === tab.key
                      ? "bg-blue-600 text-white shadow"
                      : "text-zinc-400 hover:bg-zinc-800"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* STATUS BADGE */}
          <span
            className={`text-[10px] px-2 py-0.5 rounded
              ${
                status === "Running"
                  ? "bg-yellow-600 text-white"
                  : status === "Error"
                  ? "bg-red-600 text-white"
                  : "bg-green-600 text-white"
              }`}
          >
            {status}
          </span>

        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">

          <button
            onClick={copyOutput}
            className="flex items-center gap-1 text-xs text-zinc-300 hover:text-white"
          >
            <FiCopy size={14} />
            Copy
          </button>

          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs text-zinc-300 hover:text-red-400"
          >
            <FiTrash2 size={14} />
            Clear
          </button>

        </div>

      </div>

      {/* CONTENT */}
      <pre
        className={`flex-1 p-4 overflow-auto text-sm font-mono leading-relaxed
        ${
          activeTab === "error"
            ? "text-red-400"
            : activeTab === "info"
            ? "text-yellow-400"
            : activeTab === "tests"
            ? "text-blue-400"
            : "text-green-400"
        }`}
      >

        {loading
          ? "Running..."
          : activeTab === "output"
          ? stdout || "No output available"
          : activeTab === "error"
          ? stderr || "No errors"
          : activeTab === "info"
          ? `${info || "No info available"}

Execution Time: ${execution?.time || "N/A"}
Memory Used: ${execution?.memory || "N/A"}`
          : testResults?.length
          ? testResults.map((r: string, i: number) =>
              `Test Case ${i + 1}:\n${r}`
            ).join("\n\n")
          : "No test results"}

      </pre>

    </div>
  )
}