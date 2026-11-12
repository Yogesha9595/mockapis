import type { HTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/cn"

type CardProps = HTMLAttributes<HTMLDivElement> & {
  /** Adds hover elevation for clickable cards (wrap in a link yourself) */
  interactive?: boolean
  /** Removes inner padding, e.g. for edge-to-edge editors */
  flush?: boolean
}

export function Card({ interactive, flush, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-container border border-border bg-card text-foreground shadow-card",
        !flush && "p-5",
        interactive && "transition-shadow hover:shadow-raised hover:border-input",
        className
      )}
      {...props}
    />
  )
}

type CardHeaderProps = {
  title: ReactNode
  description?: ReactNode
  /** Heading level for the title; defaults to h3 */
  as?: "h2" | "h3" | "h4"
  /** Right-aligned content such as a badge or action */
  aside?: ReactNode
  className?: string
}

export function CardHeader({ title, description, as: Heading = "h3", aside, className }: CardHeaderProps) {
  return (
    <div className={cn("mb-3 flex items-start justify-between gap-3", className)}>
      <div className="min-w-0">
        <Heading className="text-base font-semibold leading-snug text-foreground">{title}</Heading>
        {description && <p className="mt-1 text-sm leading-relaxed text-muted">{description}</p>}
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </div>
  )
}
