"use client"

import dynamic from "next/dynamic"
import { useSyncExternalStore } from "react"

/* Monaco is large; load it only when a code editor is actually rendered */
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-muted" role="status">
      Loading editor…
    </div>
  ),
})

/* Site theme = "dark" class on <html> (see ThemeToggle) */
function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
  return () => observer.disconnect()
}
const siteIsDark = () => document.documentElement.classList.contains("dark")

interface Props {
  value: string
  onChange?: (value: string) => void
  language?: string
  readOnly?: boolean
  /** Accessible name for the editor */
  ariaLabel: string
  /** id for the plain-text <textarea>, so a visible <label htmlFor> can name it */
  id?: string
  placeholder?: string
  /** Editor height in px (default 420) */
  height?: number
  /** "dark" (default, unchanged behaviour) or "auto" to follow the site theme */
  theme?: "dark" | "auto"
  /** Render without its own border (when placed inside a bordered panel) */
  bare?: boolean
}

const frame =
  "rounded-lg border border-gray-300 bg-white overflow-hidden dark:border-gray-700 dark:bg-gray-950"

export default function CodeEditor({
  value,
  onChange,
  language = "json",
  readOnly = false,
  ariaLabel,
  id,
  placeholder,
  height = 420,
  theme = "dark",
  bare = false,
}: Props) {
  const dark = useSyncExternalStore(subscribeTheme, siteIsDark, () => false)
  const box = bare ? "bg-card" : frame

  /* Plain text: a native textarea is lighter, mobile-friendly and accessible */
  if (language === "plaintext") {
    return (
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={readOnly}
        // A visible <label htmlFor={id}> names it when present; otherwise aria-label
        aria-label={id ? undefined : ariaLabel}
        placeholder={placeholder}
        spellCheck={false}
        style={{ height }}
        className={`${box} block w-full resize-y p-3 font-mono text-sm leading-relaxed text-foreground placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          readOnly ? "bg-surface" : ""
        }`}
      />
    )
  }

  return (
    <div className={box} style={{ height }}>
      <MonacoEditor
        height="100%"
        language={language}
        theme={theme === "auto" ? (dark ? "vs-dark" : "vs") : "vs-dark"}
        value={value}
        onChange={(v) => onChange?.(v ?? "")}
        options={{
          readOnly,
          ariaLabel,
          placeholder,
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on",
          automaticLayout: true,
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  )
}
