import type { ButtonHTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/cn"
import Spinner from "./Spinner"

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger"
export type ButtonSize = "sm" | "md" | "lg" | "icon"

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control font-medium transition-colors " +
  "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50"

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-card",
  secondary: "border border-input bg-card text-foreground hover:bg-surface shadow-card",
  ghost: "text-foreground hover:bg-surface",
  danger: "bg-danger text-white hover:opacity-90 dark:text-danger-bg",
}

/* Heights meet the 24px minimum target size (WCAG 2.2); md/lg/icon reach 40px+ */
const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
  icon: "h-10 w-10",
}

/** Class string for button-styled elements that are not <button>, e.g. next/link. */
export function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}): string {
  return cn(base, variants[variant], sizes[size], className)
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Shows a spinner, sets aria-busy and disables the button */
  loading?: boolean
  /** Icon rendered before the label (hidden from assistive tech) */
  icon?: ReactNode
}

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonVariants({ variant, size, className })}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : icon && <span aria-hidden="true" className="inline-flex">{icon}</span>}
      {children}
    </button>
  )
}
