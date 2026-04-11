"use client"

import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { languages } from "@/data/compilerLanguages"
import Sidebar from "@/components/compiler/Sidebar"
import OutputPanel from "@/components/compiler/OutputPanel"
import {
  FiPlay,
  FiShare2,
  FiPlus,
  FiX,
  FiCode,
  FiDownload,
  FiSun,
  FiMoon
} from "react-icons/fi"

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false })

export default function ClientCompiler({ lang }: any) {

  const config = languages[lang]
  const searchParams = useSearchParams()

  const [files, setFiles] = useState([
    { id: 1, name: `main.${getExtension(lang)}`, code: "" }
  ])
  const [activeFile, setActiveFile] = useState(1)

  const [stdout, setStdout] = useState("")
  const [stderr, setStderr] = useState("")
  const [info, setInfo] = useState("")
  const [execution, setExecution] = useState<any>(null)

  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState("")
  const [theme, setTheme] = useState<"dark" | "light">("dark")

  const [leftWidth, setLeftWidth] = useState(60)
  const [isDragging, setIsDragging] = useState(false)

  const currentFile = files.find(f => f.id === activeFile) || files[0]

  // 🔥 LOAD CODE
  useEffect(() => {
    let initial = config?.template || ""
    const urlCode = searchParams.get("code")

    if (urlCode) {
      try {
        initial = decodeURIComponent(escape(atob(urlCode)))
      } catch {}
    }

    setFiles([{ id: 1, name: `main.${getExtension(lang)}`, code: initial }])
    setActiveFile(1)

  }, [lang, searchParams])

  // 🔥 RESIZE FIX (NO OVERFLOW ISSUE)
  useEffect(() => {
    function move(e: MouseEvent) {
      if (!isDragging) return
      const w = (e.clientX / window.innerWidth) * 100
      if (w > 30 && w < 70) setLeftWidth(w)
    }
    function up() { setIsDragging(false) }

    window.addEventListener("mousemove", move)
    window.addEventListener("mouseup", up)

    return () => {
      window.removeEventListener("mousemove", move)
      window.removeEventListener("mouseup", up)
    }
  }, [isDragging])

  // 🚀 RUN (FIXED OUTPUT BUG)
  async function runCode() {
    if (!currentFile) return

    try {
      setLoading(true)
      setStdout("Running...")
      setStderr("")
      setInfo("")

      const res = await fetch("/api/compiler/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: currentFile.code,
          language_id: config.id,
          stdin: input
        })
      })

      const data = await res.json()

      // ✅ FIX: PROPER OUTPUT HANDLING
      setStdout(data.output || data.stdout || "")
      setStderr(data.stderr || data.compile_output || "")
      setInfo(data.status || "")
      setExecution({
        time: data.time,
        memory: data.memory
      })

    } catch {
      setStdout("")
      setStderr("Execution failed")
    } finally {
      setLoading(false)
    }
  }

  // ✨ BEAUTIFY
  function beautifyCode() {
    if (!currentFile) return

    const formatted = currentFile.code
      .replace(/;/g, ";\n")
      .replace(/{/g, "{\n")
      .replace(/}/g, "\n}")
      .replace(/\n\s*\n/g, "\n")

    updateCode(formatted)
  }

  // 🔗 SHARE
  async function shareCode() {
    if (!currentFile) return

    const encoded = btoa(unescape(encodeURIComponent(currentFile.code)))
    const url = `${window.location.origin}/compiler/${lang}?code=${encoded}`

    try {
      await navigator.clipboard.writeText(url)
      alert("Link copied!")
    } catch {
      alert("Share failed")
    }
  }

  function downloadCode() {
    if (!currentFile) return

    const blob = new Blob([currentFile.code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = currentFile.name
    a.click()

    URL.revokeObjectURL(url)
  }

  function updateCode(newCode: string) {
    setFiles(prev =>
      prev.map(f =>
        f.id === activeFile ? { ...f, code: newCode } : f
      )
    )
  }

  function addFile() {
    const id = Date.now()
    setFiles(prev => [
      ...prev,
      { id, name: `file${prev.length + 1}.${getExtension(lang)}`, code: "" }
    ])
    setActiveFile(id)
  }

  function removeFile(id: number) {
    if (files.length === 1) return
    const updated = files.filter(f => f.id !== id)
    setFiles(updated)
    setActiveFile(updated[0].id)
  }

  if (!config) return null

  return (
    <div className={`w-full h-screen flex overflow-hidden ${
      theme === "dark" ? "bg-zinc-950 text-white" : "bg-white text-black"
    }`}>

      <Sidebar />

      <div className="flex-1 flex flex-col h-full">

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
          <div className="flex items-center gap-2 font-semibold">
            <FiCode />
            {config.name} Compiler
          </div>

          <div className="flex gap-2 items-center">
            <FiDownload onClick={downloadCode} className="cursor-pointer" />
            <FiShare2 onClick={shareCode} className="cursor-pointer" />
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <FiSun /> : <FiMoon />}
            </button>
          </div>
        </div>

        {/* PREMIUM TABS */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800 overflow-x-auto">

          {files.map(file => (
            <div
              key={file.id}
              onClick={() => setActiveFile(file.id)}
              className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm cursor-pointer transition
              ${
                activeFile === file.id
                  ? "bg-zinc-800 border border-zinc-700 shadow"
                  : "bg-zinc-700 hover:bg-zinc-600"
              }`}
            >
              {file.name}

              <FiX
                size={12}
                className="opacity-60 hover:opacity-100"
                onClick={(e)=>{
                  e.stopPropagation()
                  removeFile(file.id)
                }}
              />
            </div>
          ))}

          <button onClick={addFile} className="p-1 hover:bg-zinc-700 rounded">
            <FiPlus />
          </button>

          <div className="ml-auto flex gap-2">
            <button onClick={beautifyCode} className="px-2 py-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded text-xs">
              ✨
            </button>

            <button onClick={runCode} className="px-3 py-1 bg-blue-600 rounded text-xs flex items-center gap-1">
              <FiPlay size={12}/> Run
            </button>
          </div>

        </div>

        {/* MAIN */}
        <div className="flex flex-1 overflow-hidden">

          {/* EDITOR */}
          <div style={{ width: `${leftWidth}%` }} className="h-full">
            <Editor
              height="100%"
              language={config.editor}
              theme={theme === "dark" ? "vs-dark" : "light"}
              value={currentFile.code}
              onChange={(v)=>updateCode(v || "")}
              options={{ minimap: { enabled: false }, automaticLayout: true }}
            />
          </div>

          {/* RESIZER */}
          <div
            onMouseDown={() => setIsDragging(true)}
            className="w-1 bg-zinc-700 cursor-col-resize"
          />

          {/* OUTPUT */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <OutputPanel
              stdout={stdout}
              stderr={stderr}
              info={info}
              execution={execution}
              loading={loading}
              onClear={()=>{ setStdout(""); setStderr(""); setInfo("") }}
            />

            <textarea
              value={input}
              onChange={(e)=>setInput(e.target.value)}
              className="p-2 border-t border-zinc-700 text-sm resize-none"
              placeholder="Input..."
            />
          </div>

        </div>

      </div>
    </div>
  )
}

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