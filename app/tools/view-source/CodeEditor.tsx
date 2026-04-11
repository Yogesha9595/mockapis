"use client"

import Editor from "@monaco-editor/react"
import { useRef, useEffect } from "react"

export default function CodeEditor({
  code,
  highlightRange,
}: {
  code: string
  highlightRange: any
}) {
  const editorRef = useRef<any>(null)
  const monacoRef = useRef<any>(null)
  const decorationsRef = useRef<string[]>([])

  /**
   * 🔥 Mount editor safely
   */
  function handleMount(editor: any, monaco: any) {
    editorRef.current = editor
    monacoRef.current = monaco
  }

  /**
   * 🎯 Apply highlight (SAFE + CLEAN)
   */
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current || !highlightRange) return

    const editor = editorRef.current
    const monaco = monacoRef.current

    // 🧹 Remove old highlights
    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      []
    )

    // 🎯 Add new highlight
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

    // 🔥 Smooth scroll to element
    editor.revealLineInCenter(highlightRange.startLineNumber)

  }, [highlightRange])

  return (
    <Editor
      height="100%"
      defaultLanguage="html"
      value={code}
      onMount={handleMount}
      theme="vs-dark"
      options={{
        fontSize: 14,
        minimap: { enabled: true },
        wordWrap: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        lineNumbers: "on",
        tabSize: 2,
      }}
    />
  )
}