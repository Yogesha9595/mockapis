import { fail, ok, type ToolResult } from "./types"

/** Parse JSON, turning the engine's error into a message with line/column. */
export function parseJson(input: string): { ok: true; value: unknown } | { ok: false; error: string } {
  if (!input.trim()) return { ok: false, error: "Enter some JSON first." }
  try {
    return { ok: true, value: JSON.parse(input) }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, error: `Invalid JSON: ${withLineColumn(input, message)}` }
  }
}

/**
 * JS engines differ: some report "at position N", some "line X column Y",
 * and V8 reports nothing for "Unexpected token" errors. Always add a
 * line/column, locating the error ourselves when the engine doesn't.
 */
function withLineColumn(input: string, message: string): string {
  if (/line \d+ column \d+/.test(message)) return message
  const match = /at position (\d+)/.exec(message)
  const pos = match ? Number(match[1]) : findJsonErrorOffset(input)
  if (pos === null) return message
  const before = input.slice(0, pos).split("\n")
  // V8 echoes the whole input into the message; drop that noise
  // V8 echoes (part of) the input, sometimes prefixed with "...": drop it
  const short = message.replace(/,\s*(\.\.\.)?"[\s\S]*" is not valid JSON$/, "")
  return `${short} (line ${before.length} column ${before[before.length - 1].length + 1})`
}

/** Offset of the first JSON syntax error, or null if the text is valid. */
export function findJsonErrorOffset(text: string): number | null {
  let i = 0
  const ws = () => { while (i < text.length && " \t\n\r".includes(text[i])) i++ }
  const literal = (word: string) => {
    for (const ch of word) { if (text[i] !== ch) throw i; i++ }
  }
  const string = () => {
    i++ // opening quote
    while (i < text.length) {
      const ch = text[i]
      if (ch === '"') { i++; return }
      if (ch < " ") throw i
      if (ch === "\\") {
        i++
        if (text[i] === "u") {
          if (!/^[0-9a-fA-F]{4}$/.test(text.slice(i + 1, i + 5))) throw i
          i += 5
        } else if ('"\\/bfnrt'.includes(text[i] ?? "")) i++
        else throw i
      } else i++
    }
    throw i
  }
  const number = () => {
    const m = /^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/.exec(text.slice(i))
    if (!m) throw i
    i += m[0].length
  }
  const value = (): void => {
    ws()
    const ch = text[i]
    if (ch === "{") {
      i++; ws()
      if (text[i] === "}") { i++; return }
      for (;;) {
        ws()
        if (text[i] !== '"') throw i
        string(); ws()
        if (text[i] !== ":") throw i
        i++; value(); ws()
        if (text[i] === ",") { i++; continue }
        if (text[i] === "}") { i++; return }
        throw i
      }
    }
    if (ch === "[") {
      i++; ws()
      if (text[i] === "]") { i++; return }
      for (;;) {
        value(); ws()
        if (text[i] === ",") { i++; continue }
        if (text[i] === "]") { i++; return }
        throw i
      }
    }
    if (ch === '"') return string()
    if (ch === "t") return literal("true")
    if (ch === "f") return literal("false")
    if (ch === "n") return literal("null")
    return number()
  }
  try {
    value(); ws()
    return i < text.length ? i : null
  } catch (pos) {
    return typeof pos === "number" ? pos : null
  }
}

function describe(value: unknown): string {
  if (Array.isArray(value)) return `an array with ${value.length} item${value.length === 1 ? "" : "s"}`
  if (value === null) return "null"
  if (typeof value === "object") {
    const n = Object.keys(value as object).length
    return `an object with ${n} key${n === 1 ? "" : "s"}`
  }
  return `a ${typeof value}`
}

export function formatJson(input: string, indent = 2): ToolResult {
  const parsed = parseJson(input)
  if (!parsed.ok) return fail(parsed.error)
  return ok(JSON.stringify(parsed.value, null, indent))
}

export function minifyJson(input: string): ToolResult {
  const parsed = parseJson(input)
  if (!parsed.ok) return fail(parsed.error)
  return ok(JSON.stringify(parsed.value))
}

export function validateJson(input: string): ToolResult {
  const parsed = parseJson(input)
  if (!parsed.ok) return fail(parsed.error)
  return ok(`✓ Valid JSON — ${describe(parsed.value)}.`)
}
