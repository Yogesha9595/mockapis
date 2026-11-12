import type { ReactNode } from "react"
import { cn } from "@/lib/cn"

export type AlertVariant = "info" | "success" | "warning" | "error"

const variants: Record<AlertVariant, string> = {
  info: "border-info-border bg-info-bg text-info",
  success: "border-success-border bg-success-bg text-success",
  warning: "border-warning-border bg-warning-bg text-warning",
  error: "border-danger-border bg-danger-bg text-danger",
}

type AlertProps = {
  variant?: AlertVariant
  title?: ReactNode
  children?: ReactNode
  className?: string
}

/**
 * Inline message. Errors use role="alert" (announced immediately);
 * other variants use role="status" (announced politely).
 */
export default function Alert({ variant = "info", title, children, className }: AlertProps) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn("rounded-control border px-4 py-3 text-sm leading-relaxed", variants[variant], className)}
    >
      {title && <p className="font-semibold">{title}</p>}
      {children && <div className={title ? "mt-1" : undefined}>{children}</div>}
    </div>
  )
}
