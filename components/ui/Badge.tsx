import type { ReactNode } from "react"
import { cn } from "@/lib/cn"

export type BadgeVariant = "neutral" | "success" | "warning" | "danger" | "info"

const variants: Record<BadgeVariant, string> = {
  neutral: "border-border bg-surface text-muted",
  success: "border-success-border bg-success-bg text-success",
  warning: "border-warning-border bg-warning-bg text-warning",
  danger: "border-danger-border bg-danger-bg text-danger",
  info: "border-info-border bg-info-bg text-info",
}

/** Small status label, e.g. "Coming soon" or "Runs in your browser". */
export default function Badge({
  variant = "neutral",
  className,
  children,
}: {
  variant?: BadgeVariant
  className?: string
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium leading-5",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
