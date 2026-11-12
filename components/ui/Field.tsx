"use client"

import {
  createContext,
  useContext,
  useId,
  type AriaAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react"
import { cn } from "@/lib/cn"

/* ---------------- FIELD (label + hint + error wiring) ---------------- */

type FieldContextValue = { id: string; describedBy?: string; invalid: boolean }
const FieldContext = createContext<FieldContextValue | null>(null)

type FieldProps = {
  label: ReactNode
  /** Help text shown under the label */
  hint?: ReactNode
  /** Error message; marks the control aria-invalid and announces it */
  error?: ReactNode
  /** Visually hide the label (still read by screen readers) */
  hideLabel?: boolean
  /** Optional explicit id for the control */
  id?: string
  className?: string
  children: ReactNode
}

/**
 * Wraps one Input / Textarea / Select and connects label, hint and error to it
 * (id, aria-describedby, aria-invalid) automatically.
 */
export function Field({ label, hint, error, hideLabel, id, className, children }: FieldProps) {
  const autoId = useId()
  const controlId = id ?? `field-${autoId}`
  const hintId = hint ? `${controlId}-hint` : undefined
  const errorId = error ? `${controlId}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined

  return (
    <FieldContext.Provider value={{ id: controlId, describedBy, invalid: Boolean(error) }}>
      <div className={cn("space-y-1.5", className)}>
        <label htmlFor={controlId} className={cn("block text-sm font-medium text-foreground", hideLabel && "sr-only")}>
          {label}
        </label>
        {hint && (
          <p id={hintId} className="text-xs leading-relaxed text-muted">
            {hint}
          </p>
        )}
        {children}
        {error && (
          <p id={errorId} role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    </FieldContext.Provider>
  )
}

/** Props a control takes from its surrounding Field (explicit props win). */
function useFieldControl(props: { id?: string } & Pick<AriaAttributes, "aria-describedby" | "aria-invalid">) {
  const field = useContext(FieldContext)
  return {
    id: props.id ?? field?.id,
    "aria-describedby": props["aria-describedby"] ?? field?.describedBy,
    "aria-invalid": props["aria-invalid"] ?? (field?.invalid || undefined),
  }
}

/* ---------------- CONTROLS ---------------- */

const control =
  "block w-full rounded-control border border-input bg-card text-foreground shadow-card transition-colors " +
  "placeholder:text-muted/70 hover:border-muted focus-visible:border-ring " +
  "disabled:cursor-not-allowed disabled:bg-surface disabled:opacity-60 " +
  "read-only:bg-surface aria-invalid:border-danger"

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const a11y = useFieldControl(props)
  return <input {...props} {...a11y} className={cn(control, "h-10 px-3 text-sm", className)} />
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  /** Monospace text for code/data (default true: most tool input is code) */
  code?: boolean
}

export function Textarea({ className, code = true, spellCheck, ...props }: TextareaProps) {
  const a11y = useFieldControl(props)
  return (
    <textarea
      {...props}
      {...a11y}
      spellCheck={spellCheck ?? !code}
      className={cn(control, "min-h-40 resize-y p-3 text-sm leading-relaxed", code && "font-mono", className)}
    />
  )
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  const a11y = useFieldControl(props)
  return (
    <select {...props} {...a11y} className={cn(control, "h-10 px-3 pr-8 text-sm", className)}>
      {children}
    </select>
  )
}
