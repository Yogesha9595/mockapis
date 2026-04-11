"use client"

import { useEffect, useRef } from "react"

type Props = {
  html: string
  onHover?: (el: any) => void
  onSelect?: (el: any) => void
}

export default function LivePreview({
  html,
  onHover,
  onSelect,
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const doc = iframe.contentDocument
    if (!doc) return

    // ✅ Write HTML (safe fallback)
    doc.open()
    doc.write(html || "<html><body></body></html>")
    doc.close()

    // ✅ Wait for iframe to fully load
    const handleLoad = () => {
      const safeDoc = iframe.contentDocument
      if (!safeDoc || !safeDoc.body) return

      // 🔥 Prevent duplicate injection
      if (safeDoc.getElementById("__inspector__")) return

      const script = safeDoc.createElement("script")
      script.id = "__inspector__"

      script.innerHTML = `
        (function() {
          let overlay = null

          function createOverlay() {
            const div = document.createElement("div")
            div.style.position = "absolute"
            div.style.pointerEvents = "none"
            div.style.border = "2px solid #3b82f6"
            div.style.backgroundColor = "rgba(59,130,246,0.1)"
            div.style.zIndex = "999999"
            document.body.appendChild(div)
            return div
          }

          function getBoxModel(el) {
            const rect = el.getBoundingClientRect()
            const style = window.getComputedStyle(el)

            const parse = (v) => parseFloat(v) || 0

            return {
              width: rect.width,
              height: rect.height,
              margin: {
                top: parse(style.marginTop),
                right: parse(style.marginRight),
                bottom: parse(style.marginBottom),
                left: parse(style.marginLeft),
              },
              padding: {
                top: parse(style.paddingTop),
                right: parse(style.paddingRight),
                bottom: parse(style.paddingBottom),
                left: parse(style.paddingLeft),
              },
              border: {
                top: parse(style.borderTopWidth),
                right: parse(style.borderRightWidth),
                bottom: parse(style.borderBottomWidth),
                left: parse(style.borderLeftWidth),
              },
            }
          }

          document.addEventListener("mouseover", function(e) {
            const el = e.target
            if (!el || el === document.body || el === document.documentElement) return

            if (!overlay) overlay = createOverlay()

            const rect = el.getBoundingClientRect()

            overlay.style.top = rect.top + window.scrollY + "px"
            overlay.style.left = rect.left + window.scrollX + "px"
            overlay.style.width = rect.width + "px"
            overlay.style.height = rect.height + "px"

            const box = getBoxModel(el)

            window.parent.postMessage({
              type: "hover",
              element: {
                tag: el.tagName.toLowerCase(),
                className: el.className,
                id: el.id,
                ...box
              }
            }, "*")
          })

          document.addEventListener("click", function(e) {
            e.preventDefault()
            e.stopPropagation()

            const el = e.target
            if (!el) return

            const box = getBoxModel(el)

            window.parent.postMessage({
              type: "select",
              element: {
                tag: el.tagName.toLowerCase(),
                className: el.className,
                id: el.id,
                ...box
              }
            }, "*")
          })
        })();
      `

      safeDoc.body.appendChild(script)
    }

    iframe.onload = handleLoad

    // ✅ Message listener
    const handler = (event: MessageEvent) => {
      if (!event.data) return

      if (event.data.type === "hover") {
        onHover?.(event.data.element)
      }

      if (event.data.type === "select") {
        onSelect?.(event.data.element)
      }
    }

    window.addEventListener("message", handler)

    return () => {
      window.removeEventListener("message", handler)
    }
  }, [html, onHover, onSelect])

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-[450px] border rounded bg-white"
      sandbox="allow-scripts allow-same-origin"
    />
  )
}