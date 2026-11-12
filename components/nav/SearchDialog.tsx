"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { Search, X } from "lucide-react"
import ToolSearch from "@/components/home/ToolSearch"
import { buttonVariants } from "@/components/ui/Button"
import type { ToolLink } from "@/data/tools"

/** True when the keyboard event happens while the user is typing somewhere. */
function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null
  return !!el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName))
}

/**
 * Site-wide tool search in a native modal <dialog>: the browser provides the
 * focus trap, Escape-to-close, inert background and focus return.
 * Opens from the header button, Ctrl/⌘+K, or "/" (when not typing).
 */
export default function SearchDialog({ tools }: { tools: ToolLink[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const pathname = usePathname()
  // Remount the search each time the dialog opens, so it starts empty and autofocuses
  const [session, setSession] = useState(0)

  const open = useCallback(() => {
    const dialog = dialogRef.current
    if (!dialog || dialog.open) return
    setSession((s) => s + 1)
    dialog.showModal()
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const combo = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k"
      const slash = e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey && !isTyping(e.target)
      if (combo || slash) {
        e.preventDefault()
        open()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  // Close after navigating to a result (the header persists across pages)
  useEffect(() => {
    dialogRef.current?.close()
  }, [pathname])

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        aria-keyshortcuts="Control+K Meta+K /"
        className={buttonVariants({ variant: "secondary", className: "w-10 px-0 text-muted lg:w-56 lg:justify-start lg:px-3" })}
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="sr-only lg:not-sr-only lg:flex-1 lg:text-left">Search tools…</span>
        <kbd className="hidden rounded border border-border bg-surface px-1.5 font-mono text-xs text-muted lg:inline">Ctrl K</kbd>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClick={(e) => {
          // Clicking the backdrop (the dialog element itself) closes it
          if (e.target === e.currentTarget) e.currentTarget.close()
        }}
        className="m-0 mx-auto mt-[10vh] w-[calc(100%-2rem)] max-w-2xl rounded-container border border-border bg-background p-0 text-foreground shadow-raised backdrop:bg-black/40"
      >
        <div className="p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 id={titleId} className="text-base font-semibold">Search tools</h2>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Close search"
              className={buttonVariants({ variant: "ghost", size: "icon", className: "h-8 w-8" })}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            <ToolSearch key={session} tools={tools} autoFocus />
          </div>
          <p className="mt-3 text-xs text-muted">
            Press <kbd className="font-mono">Enter</kbd> to open the first result, <kbd className="font-mono">Esc</kbd> to close.
          </p>
        </div>
      </dialog>
    </>
  )
}
