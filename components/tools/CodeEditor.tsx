"use client"

import Editor from "@monaco-editor/react"

interface Props {
value: string
onChange?: (value: string) => void
language?: string
readOnly?: boolean
}

export default function CodeEditor({
value,
onChange,
language = "json",
readOnly = false
}: Props) {

return ( <div className="border rounded-lg overflow-hidden">


  <Editor
    height="420px"
    language={language}
    theme="vs-dark"
    value={value}
    onChange={(v) => onChange?.(v || "")}
    options={{
      readOnly,
      minimap: { enabled: false },
      fontSize: 14,
      wordWrap: "on",
      automaticLayout: true,
      scrollBeyondLastLine: false
    }}
  />

</div>


)
}
