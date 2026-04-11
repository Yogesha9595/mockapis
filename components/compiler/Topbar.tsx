"use client"

import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { FiMoon, FiSun } from "react-icons/fi"

import { languages } from "@/data/compilerLanguages"
import Topbar from "@/components/compiler/Topbar"
import Sidebar from "@/components/compiler/Sidebar"
import OutputPanel from "@/components/compiler/OutputPanel"

// ✅ SAFE MONACO LOAD
const Editor = dynamic(
  () => import("@monaco-editor/react"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full text-zinc-500">
        Loading editor...
      </div>
    )
  }
)

export default function ClientCompiler({ lang }: any) {

  const config = languages[lang]
  const searchParams = useSearchParams()

  const [code, setCode] = useState("")
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState("")
  const [dark, setDark] = useState(true)

  const [isMobile, setIsMobile] = useState(false)

  // 📱 Mobile detect
  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768)
    resize()
    window.addEventListener("resize", resize)
    return () => window.removeEventListener("resize", resize)
  }, [])

  // 🔥 LOAD CODE (SAFE)
  useEffect(() => {
    const urlCode = searchParams.get("code")

    if (urlCode) {
      try {
        const decoded = decodeURIComponent(escape(atob(urlCode)))
        setCode(decoded)
        return
      } catch {}
    }

    const saved = localStorage.getItem(`code-${lang}`)
    if (saved) setCode(saved)
    else setCode(config?.template || "")

  }, [lang, searchParams])

  // 🔥 AUTO SAVE
  useEffect(() => {
    if (code) localStorage.setItem(`code-${lang}`, code)
  }, [code, lang])

  // ⌨️ SHORTCUTS
  useEffect(() => {
    function handler(e: KeyboardEvent) {

      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault()
        runCode()
      }

      if (e.ctrlKey && e.key === "s") {
        e.preventDefault()
        localStorage.setItem(`code-${lang}`, code)
      }
    }

    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [code, lang])

  if (!config || !config.editor) {
    return (
      <div className="p-10 text-center text-red-500">
        Language not supported: {lang}
      </div>
    )
  }

  // 🚀 RUN
  async function runCode() {
    try {
      setLoading(true)
      setOutput("Running...")

      const res = await fetch("/api/compiler/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language_id: config.id,
          stdin: input
        })
      })

      const data = await res.json()

      const result =
        data.output ||
        data.stdout ||
        data.stderr ||
        data.compile_output ||
        "No output"

      setOutput(result)

    } catch {
      setOutput("Error running code")
    } finally {
      setLoading(false)
    }
  }

  // 🔗 SHARE
  function shareCode() {
    try {
      const encoded = btoa(unescape(encodeURIComponent(code)))
      const url = `${window.location.origin}/compiler/${lang}?code=${encoded}`
      navigator.clipboard.writeText(url)
    } catch {}
  }

  // 💾 DOWNLOAD
  function downloadCode() {
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `main.${getExtension(lang)}`
    a.click()

    URL.revokeObjectURL(url)
  }

  // 📋 COPY OUTPUT
  function copyOutput() {
    navigator.clipboard.writeText(output || "")
  }

  return (
    <div className={`${dark ? "bg-zinc-950 text-white" : "bg-white text-black"} min-h-screen`}>

      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        {!isMobile && <Sidebar />}

        <div className="flex-1 flex flex-col">

          {/* 🔥 TOPBAR + ACTIONS */}
          <div className="flex items-center justify-between border-b border-zinc-800 px-3">

            <Topbar
              onRun={runCode}
              onShare={shareCode}
              onDownload={downloadCode}
              loading={loading}
              language={lang}
              onClear={() => setOutput("")}
            />

            {/* DARK MODE */}
            <button
              onClick={() => setDark(!dark)}
              className="p-2 hover:bg-zinc-800 rounded"
            >
              {dark ? <FiSun /> : <FiMoon />}
            </button>

          </div>

          <div className={`flex flex-1 min-h-0 ${isMobile ? "flex-col" : ""}`}>

            {/* EDITOR */}
            <div className="flex-1 min-h-0 border-r border-zinc-800">

              <Editor
                height="100%"
                language={config.editor || "plaintext"}
                theme={dark ? "vs-dark" : "light"}
                value={code}
                onChange={(v)=>setCode(v || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  smoothScrolling: true,
                  padding: { top: 10 }
                }}
              />

            </div>

            {/* RIGHT PANEL */}
            <div className="flex flex-col w-full md:w-[40%] min-h-0 border-l border-zinc-800">

              {/* OUTPUT */}
              <div className="relative flex-1 min-h-0">

                <OutputPanel output={output} onClear={() => setOutput("")} />

                <button
                  onClick={copyOutput}
                  className="absolute top-2 right-2 text-xs bg-zinc-700 px-2 py-1 rounded hover:bg-zinc-600"
                >
                  Copy
                </button>

              </div>

              {/* INPUT */}
              <div className="p-3 border-t border-zinc-800">

                <label className="text-xs text-zinc-400 mb-1 block">
                  Input (stdin)
                </label>

                <textarea
                  value={input}
                  onChange={(e)=>setInput(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Enter input here..."
                />

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

/* helper */
function getExtension(lang: string) {
  switch (lang) {
    case "python": return "py"
    case "javascript": return "js"
    case "java": return "java"
    case "cpp": return "cpp"
    case "c": return "c"
    case "go": return "go"
    case "rust": return "rs"
    case "php": return "php"
    default: return "txt"
  }
}