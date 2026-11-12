"use client"

import { useEffect, useId, useRef, useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/cn"
import type { NavCategory } from "./navData"

/**
 * "Tools" disclosure navigation (desktop). A button toggles a panel of links:
 * the recommended pattern for site navigation (not role="menu", which is for
 * application menus). Escape closes and returns focus to the button; clicking
 * outside or tabbing out closes it.
 */
export default function ToolsMenu({ categories, active }: { categories: NavCategory[]; active: boolean }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onPointer)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onPointer)
    }
  }, [open])

  return (
    // Not `relative`: the panel is positioned against the header's content
    // container (see Header.tsx) so it always fits inside the viewport.
    <div
      ref={rootRef}
      onBlur={(e) => {
        // Close when keyboard focus leaves the button + panel
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false)
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex items-center gap-1 rounded-control px-3 py-2 text-sm font-medium transition-colors",
          active || open ? "bg-surface text-foreground" : "text-muted hover:bg-surface hover:text-foreground"
        )}
      >
        Tools
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute left-0 top-full z-50 w-full max-w-2xl rounded-container border border-border bg-card p-4 shadow-raised"
      >
        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          {categories.map((category) => (
            <section key={category.id} aria-labelledby={`${panelId}-${category.id}`}>
              {/* Not a heading: this panel is in every page's header and must not add to its outline */}
              <p id={`${panelId}-${category.id}`} className="text-xs font-semibold uppercase tracking-wide text-muted">
                {category.href ? (
                  <Link href={category.href} onClick={() => setOpen(false)} className="hover:text-foreground">
                    {category.name}
                  </Link>
                ) : (
                  category.name
                )}
              </p>
              <ul className="mt-2 space-y-1">
                {category.tools.map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      href={tool.href}
                      onClick={() => setOpen(false)}
                      className="-mx-2 block rounded-control px-2 py-1 text-sm text-foreground hover:bg-surface hover:text-primary"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <div className="mt-4 border-t border-border pt-3">
          <Link href="/tools" onClick={() => setOpen(false)} className="text-sm font-medium text-primary hover:underline">
            All tools, including coming soon →
          </Link>
        </div>
      </div>
    </div>
  )
}
