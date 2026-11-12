import { cn } from "@/lib/cn"

type SpinnerProps = {
  size?: "sm" | "md"
  /** Accessible text. Omit when the spinner sits inside a labelled control. */
  label?: string
  className?: string
}

/** Loading indicator. Rotation is disabled under prefers-reduced-motion (see globals.css). */
export default function Spinner({ size = "md", label, className }: SpinnerProps) {
  const svg = (
    <svg
      className={cn("animate-spin", size === "sm" ? "h-4 w-4" : "h-5 w-5", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )

  if (!label) return svg

  return (
    <span role="status" className="inline-flex items-center gap-2 text-sm text-muted">
      {svg}
      <span>{label}</span>
    </span>
  )
}
