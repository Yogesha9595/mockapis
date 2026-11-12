"use client"

import { useEffect, useMemo, useRef } from "react"
import { buildPreviewDocument, isInspectorMessage, type InspectorMessage } from "@/lib/tools/previewSandbox"

type Props = {
  html: string
  onHover?: (el: InspectorMessage["element"]) => void
  onSelect?: (el: InspectorMessage["element"]) => void
}

/**
 * Renders untrusted HTML safely. See lib/tools/previewSandbox.ts for the
 * layers of protection. NEVER add "allow-same-origin" to this sandbox:
 * combined with "allow-scripts" it would let the previewed page escape it.
 */
export default function LivePreview({ html, onHover, onSelect }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const srcDoc = useMemo(() => buildPreviewDocument(html), [html])

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      // Only accept messages from this exact iframe (its origin is opaque: "null")
      if (event.source !== iframeRef.current?.contentWindow) return
      if (!isInspectorMessage(event.data)) return

      if (event.data.type === "hover") onHover?.(event.data.element)
      else onSelect?.(event.data.element)
    }

    window.addEventListener("message", handler)
    return () => window.removeEventListener("message", handler)
  }, [onHover, onSelect])

  return (
    <iframe
      ref={iframeRef}
      title="HTML preview (scripts from the pasted page are disabled)"
      srcDoc={srcDoc}
      sandbox="allow-scripts"
      referrerPolicy="no-referrer"
      className="w-full h-[450px] border rounded bg-white"
    />
  )
}
