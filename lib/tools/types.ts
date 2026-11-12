/**
 * Result of running a tool. Tools never throw for bad user input; they
 * return a human-readable error instead so the UI can show it directly.
 * A successful result may carry a short note (e.g. size savings).
 */
export type ToolResult =
  | { ok: true; output: string; note?: string }
  | { ok: false; error: string }

export const ok = (output: string, note?: string): ToolResult => (note ? { ok: true, output, note } : { ok: true, output })
export const fail = (error: string): ToolResult => ({ ok: false, error })

/** 1-based line number of a character offset (for error messages). */
export function lineAt(text: string, index: number): number {
  let line = 1
  for (let i = 0; i < index && i < text.length; i++) if (text.charCodeAt(i) === 10) line++
  return line
}

/** "Minified from 2,048 to 1,310 bytes (36% smaller)." — UTF-8 byte sizes. */
export function sizeNote(before: string, after: string): string {
  const enc = new TextEncoder()
  const a = enc.encode(before).length
  const b = enc.encode(after).length
  const pct = a === 0 ? 0 : Math.round(((a - b) / a) * 100)
  const fmt = (n: number) => n.toLocaleString("en-US")
  return b < a
    ? `Minified from ${fmt(a)} to ${fmt(b)} bytes (${pct}% smaller).`
    : `Already minimal: ${fmt(a)} bytes, nothing to remove.`
}
