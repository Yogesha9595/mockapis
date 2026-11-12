import type { ReactNode } from "react"
import { cn } from "@/lib/cn"

/* ==========================================================================
   Tool container — consistent frame for every tool page:

   <ToolLayout title="JSON Formatter" description="…" badges={…} toolbar={…}>
     <ToolGrid>
       <ToolPanel title="Input" htmlFor="input-id">…</ToolPanel>
       <ToolPanel title="Output" actions={<Button size="sm">Copy</Button>}>…</ToolPanel>
     </ToolGrid>
   </ToolLayout>
   ========================================================================== */

type ToolLayoutProps = {
  /** Rendered as the page's single H1 */
  title: ReactNode
  description?: ReactNode
  /** Small status labels next to the title (e.g. "Runs in your browser") */
  badges?: ReactNode
  /** Primary actions shown above the working area */
  toolbar?: ReactNode
  /** Feedback area (errors, notices) between toolbar and work area */
  feedback?: ReactNode
  children: ReactNode
  className?: string
}

export function ToolLayout({ title, description, badges, toolbar, feedback, children, className }: ToolLayoutProps) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl", className)}>
      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
          {badges}
        </div>
        {description && <p className="mt-2 max-w-3xl text-base leading-relaxed text-muted">{description}</p>}
      </header>

      {toolbar && <ToolToolbar>{toolbar}</ToolToolbar>}

      {/* Always rendered so screen readers announce feedback that appears later */}
      <div aria-live="polite" className={cn(feedback ? "mb-4" : "sr-only")}>
        {feedback}
      </div>

      {children}
    </div>
  )
}

/** Wrapping row of actions; stays usable on narrow screens. */
export function ToolToolbar({ children, label = "Tool actions" }: { children: ReactNode; label?: string }) {
  return (
    <div role="toolbar" aria-label={label} className="mb-4 flex flex-wrap items-center gap-2">
      {children}
    </div>
  )
}

/** Input/output grid: stacked on mobile, side by side from lg. */
export function ToolGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("grid grid-cols-1 gap-4 lg:grid-cols-2", className)}>{children}</div>
}

type ToolPanelProps = {
  title: ReactNode
  /** id of the control inside, so the title acts as its label */
  htmlFor?: string
  /** Panel-level actions (Copy, Clear, …) */
  actions?: ReactNode
  children: ReactNode
  className?: string
}

/** Bordered panel with a header bar; holds one editor/textarea/result. */
export function ToolPanel({ title, htmlFor, actions, children, className }: ToolPanelProps) {
  const Title = htmlFor ? "label" : "h2"
  return (
    <section className={cn("flex min-w-0 flex-col overflow-hidden rounded-container border border-border bg-card shadow-card", className)}>
      <div className="flex min-h-11 items-center justify-between gap-2 border-b border-border bg-surface px-3 py-1.5">
        <Title {...(htmlFor ? { htmlFor } : {})} className="min-w-0 truncate text-sm font-semibold text-foreground">
          {title}
        </Title>
        {actions && <div className="flex flex-wrap items-center gap-1">{actions}</div>}
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </section>
  )
}

export default ToolLayout
