"use client"

import { useId, useRef, useState } from "react"
import { Copy, Download, Eraser, FileUp, Sparkles } from "lucide-react"

import CodeEditor from "@/components/tools/CodeEditor"
import { ToolGrid, ToolPanel, ToolToolbar } from "@/components/tools/ToolLayout"
import Button from "@/components/ui/Button"
import Alert from "@/components/ui/Alert"
import { getToolDefinition, type EditorLanguage, type ToolAction } from "@/lib/tools/engine"

const FILE_EXTENSION: Record<EditorLanguage, string> = {
  json: "json",
  plaintext: "txt",
  html: "html",
  css: "css",
  xml: "xml",
  yaml: "yaml",
}

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
const EDITOR_HEIGHT = 380

type Feedback = { kind: "error" | "success" | "info"; message: string } | null

/**
 * The interactive part of a tool page: actions, input/output panels and
 * feedback. Behaviour comes from the tool's definition in lib/tools/engine.ts.
 */
export default function ToolWorkbench({ slug }: { slug: string }) {
  const definition = getToolDefinition(slug)
  const inputId = useId()
  const outputId = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [feedback, setFeedback] = useState<Feedback>(null)

  if (!definition) return null

  const actions = [definition.primary, ...(definition.extra ?? [])]

  const run = (action: ToolAction) => {
    const result = action.run(input)
    if (result.ok) {
      setOutput(result.output)
      setFeedback(null)
    } else {
      setOutput("")
      setFeedback({ kind: "error", message: result.error })
    }
  }

  const loadExample = () => {
    setInput(definition.sample)
    setOutput("")
    setFeedback({ kind: "info", message: `Example loaded. Press ${definition.primary.label} to run it.` })
  }

  const clearAll = () => {
    setInput("")
    setOutput("")
    setFeedback(null)
  }

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(output)
      setFeedback({ kind: "success", message: "Output copied to clipboard." })
    } catch {
      setFeedback({ kind: "error", message: "Your browser blocked clipboard access. Select the output and copy it manually." })
    }
  }

  const downloadOutput = () => {
    const url = URL.createObjectURL(new Blob([output], { type: "text/plain;charset=utf-8" }))
    const a = document.createElement("a")
    a.href = url
    a.download = `${slug}-result.${FILE_EXTENSION[definition.outputLanguage]}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    if (file.size > MAX_UPLOAD_BYTES) {
      setFeedback({ kind: "error", message: `${file.name} is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is 5 MB.` })
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setInput(typeof reader.result === "string" ? reader.result : "")
      setOutput("")
      setFeedback({ kind: "info", message: `Loaded ${file.name}.` })
    }
    reader.onerror = () => setFeedback({ kind: "error", message: `Could not read ${file.name}.` })
    reader.readAsText(file)
  }

  /* Ctrl/⌘+Enter runs the primary action, even inside the code editor */
  const onKeyDownCapture = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault()
      e.stopPropagation()
      run(definition.primary)
    }
  }

  return (
    <div onKeyDownCapture={onKeyDownCapture}>
      <ToolToolbar label="Tool actions">
        {actions.map((action, i) => (
          <Button
            key={action.label}
            variant={i === 0 ? "primary" : "secondary"}
            onClick={() => run(action)}
            aria-keyshortcuts={i === 0 ? "Control+Enter Meta+Enter" : undefined}
          >
            {action.label}
          </Button>
        ))}
        <span className="mx-1 hidden h-6 w-px bg-border sm:block" aria-hidden="true" />
        <Button variant="ghost" icon={<Sparkles className="h-4 w-4" />} onClick={loadExample}>
          Load example
        </Button>
        {definition.accept && (
          <>
            <Button variant="ghost" icon={<FileUp className="h-4 w-4" />} onClick={() => fileInputRef.current?.click()}>
              Upload file
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept={definition.accept}
              onChange={onFile}
              className="hidden"
              tabIndex={-1}
              aria-hidden="true"
            />
          </>
        )}
        <Button variant="ghost" icon={<Eraser className="h-4 w-4" />} onClick={clearAll} disabled={!input && !output && !feedback}>
          Clear
        </Button>
      </ToolToolbar>

      {/* Keyboard tip is irrelevant on touch-only phones */}
      <p className="mb-3 hidden text-xs text-muted sm:block">
        Tip: press <kbd className="rounded border border-border bg-surface px-1 font-mono">Ctrl</kbd>+
        <kbd className="rounded border border-border bg-surface px-1 font-mono">Enter</kbd> to {definition.primary.label.toLowerCase()}.
      </p>

      {/* Feedback region is always present so screen readers announce changes */}
      <div aria-live="polite" className={feedback ? "mb-4" : undefined}>
        {feedback && (
          <Alert variant={feedback.kind === "error" ? "error" : feedback.kind === "success" ? "success" : "info"}>
            {feedback.message}
          </Alert>
        )}
      </div>

      <ToolGrid>
        <ToolPanel title={definition.inputLabel} htmlFor={definition.inputLanguage === "plaintext" ? inputId : undefined}>
          <CodeEditor
            id={inputId}
            value={input}
            onChange={setInput}
            language={definition.inputLanguage}
            ariaLabel={definition.inputLabel}
            placeholder={definition.inputPlaceholder}
            height={EDITOR_HEIGHT}
            theme="auto"
            bare
          />
        </ToolPanel>

        <ToolPanel
          title={definition.outputLabel}
          htmlFor={definition.outputLanguage === "plaintext" ? outputId : undefined}
          actions={
            <>
              {/* Icon-only on phones; the text stays available to screen readers */}
              <Button size="sm" variant="ghost" icon={<Copy className="h-4 w-4" />} onClick={copyOutput} disabled={!output}>
                <span className="sr-only sm:not-sr-only">Copy</span>
              </Button>
              <Button size="sm" variant="ghost" icon={<Download className="h-4 w-4" />} onClick={downloadOutput} disabled={!output}>
                <span className="sr-only sm:not-sr-only">Download</span>
              </Button>
            </>
          }
        >
          <CodeEditor
            id={outputId}
            value={output}
            readOnly
            language={definition.outputLanguage}
            ariaLabel={definition.outputLabel}
            placeholder={`Press ${definition.primary.label} to see the result here.`}
            height={EDITOR_HEIGHT}
            theme="auto"
            bare
          />
        </ToolPanel>
      </ToolGrid>
    </div>
  )
}
