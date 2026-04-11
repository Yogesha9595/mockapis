"use client"

import Editor from "@monaco-editor/react"
import { useRef, useEffect } from "react"

export default function MonacoViewer({
  code,
  onMount,
  highlightRange,
}: {
  code: string
  onMount?: (editor: any, monaco: any) => void
  highlightRange?: any
}) {
  const editorRef = useRef<any>(null)
  const monacoRef = useRef<any>(null)
  const decorationsRef = useRef<string[]>([])

  /**
   * 🔥 Mount editor
   */
  function handleMount(editor: any, monaco: any) {
    editorRef.current = editor
    monacoRef.current = monaco

    onMount?.(editor, monaco)
  }

  /**
   * 🎯 Highlight logic (SAFE + CLEAN)
   */
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current || !highlightRange) return

    const editor = editorRef.current
    const monaco = monacoRef.current

    // 🧹 Clear previous highlights
    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      []
    )

    // 🎯 Apply new highlight
    decorationsRef.current = editor.deltaDecorations([], [
      {
        range: new monaco.Range(
          highlightRange.startLineNumber,
          highlightRange.startColumn || 1,
          highlightRange.endLineNumber,
          highlightRange.endColumn || 200
        ),
        options: {
          className: "bg-yellow-400/30",
          inlineClassName: "bg-yellow-400/30",
        },
      },
    ])

    // 🔥 Smooth scroll
    editor.revealLineInCenter(highlightRange.startLineNumber)

  }, [highlightRange])

  return (
    <div className="h-[600px] w-full border rounded overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage="html"
        value={code}
        theme="vs-dark"
        onMount={handleMount}
        options={{
          minimap: { enabled: true },
          fontSize: 13,
          wordWrap: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          lineNumbers: "on",
          tabSize: 2,
          smoothScrolling: true,
          cursorBlinking: "smooth",
        }}
      />
    </div>
  )
}