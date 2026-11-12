import { fail, lineAt, ok, sizeNote, type ToolResult } from "./types"

/**
 * Conservative CSS minifier (no dependencies).
 *
 * Removes: comments (except /*! … *\/ license comments), redundant whitespace,
 * the last semicolon in a block, and empty declarations.
 * Never changes: strings, url(…), selectors' meaning (spaces before ":" in
 * selectors are kept: "a :hover" ≠ "a:hover"), property values beyond spacing,
 * or rule order. It does not merge rules, shorten colours or rewrite values.
 */

const OPEN = ""
const CLOSE = ""

type ScanResult = { text: string; protectedChunks: string[] } | { error: string }

/** Pass 1: protect strings/url()/license comments, drop comments, check balance. */
function scan(css: string): ScanResult {
  const chunks: string[] = []
  const protect = (s: string) => `${OPEN}${chunks.push(s) - 1}${CLOSE}`
  let out = ""
  const braces: number[] = []
  let parens = 0
  let i = 0

  while (i < css.length) {
    const ch = css[i]

    // Escapes (e.g. ".a\{b", "\:") are copied as-is and never treated as syntax
    if (ch === "\\") {
      out += css.slice(i, i + 2)
      i += 2
      continue
    }

    // Comments
    if (ch === "/" && css[i + 1] === "*") {
      const end = css.indexOf("*/", i + 2)
      if (end === -1) return { error: `Unclosed comment starting on line ${lineAt(css, i)}.` }
      const comment = css.slice(i, end + 2)
      out += comment.startsWith("/*!") ? protect(comment) : " "
      i = end + 2
      continue
    }

    // Strings
    if (ch === '"' || ch === "'") {
      let j = i + 1
      while (j < css.length && css[j] !== ch) {
        if (css[j] === "\\") j++
        else if (css[j] === "\n") return { error: `Unclosed string starting on line ${lineAt(css, i)}.` }
        j++
      }
      if (j >= css.length) return { error: `Unclosed string starting on line ${lineAt(css, i)}.` }
      out += protect(css.slice(i, j + 1))
      i = j + 1
      continue
    }

    // Unquoted url(...)
    if ((ch === "u" || ch === "U") && /^url\(\s*[^"'\s)]/i.test(css.slice(i, i + 6)) && !/[\w-]/.test(css[i - 1] ?? "")) {
      const end = css.indexOf(")", i)
      if (end === -1) return { error: `Unclosed url( on line ${lineAt(css, i)}.` }
      out += protect(css.slice(i, end + 1).replace(/^url\(\s*/i, "url(").replace(/\s*\)$/, ")"))
      i = end + 1
      continue
    }

    if (ch === "{") braces.push(i)
    else if (ch === "}") {
      if (!braces.length) return { error: `Unexpected "}" on line ${lineAt(css, i)}: there is no matching "{".` }
      braces.pop()
    } else if (ch === "(") parens++
    else if (ch === ")") {
      if (parens === 0) return { error: `Unexpected ")" on line ${lineAt(css, i)}.` }
      parens--
    }

    out += ch
    i++
  }

  if (braces.length) return { error: `Missing "}": the block opened on line ${lineAt(css, braces[braces.length - 1])} is never closed.` }
  if (parens) return { error: `Missing ")": ${parens} parenthesis${parens > 1 ? "es are" : " is"} never closed.` }
  return { text: out, protectedChunks: chunks }
}

/** Remove spaces just inside parentheses and around commas (safe in selectors and values). */
const tidyCommon = (s: string) => s.replace(/\(\s+/g, "(").replace(/\s+\)/g, ")").replace(/\s*,\s*/g, ",")

/** Selectors / at-rule preludes: also tighten combinators outside parentheses. */
function minifyPrelude(prelude: string): string {
  const s = tidyCommon(prelude.trim())
  if (s.startsWith("@")) return s // at-rule preludes (media queries etc.): spacing kept apart from the above
  let out = ""
  let depth = 0
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (c === "\\") {
      out += s.slice(i, i + 2)
      i++
      continue
    }
    if (c === "(" || c === "[") depth++
    if (c === ")" || c === "]") depth--
    if (depth === 0 && (c === ">" || c === "+" || c === "~")) {
      out = out.replace(/ $/, "") + c
      if (s[i + 1] === " ") i++
      continue
    }
    out += c
  }
  return out
}

function minifyDeclaration(decl: string): string {
  const d = decl.trim()
  if (!d) return ""
  const colon = d.indexOf(":")
  if (colon === -1 || d.startsWith("@")) return tidyCommon(d) // e.g. @import url(x) screen
  const prop = d.slice(0, colon).trim()
  const value = d.slice(colon + 1).trim()
  // Custom properties: whitespace runs are collapsed (equivalent in CSS) but nothing else is tidied
  return `${prop}:${prop.startsWith("--") ? value : tidyCommon(value).replace(/\s*!\s*important$/i, "!important")}`
}

export function minifyCssText(css: string): { ok: true; output: string } | { ok: false; error: string } {
  if (!css.trim()) return { ok: false, error: "Enter some CSS first." }

  const scanned = scan(css)
  if ("error" in scanned) return { ok: false, error: scanned.error }

  const text = scanned.text.replace(/\s+/g, " ")
  let out = ""
  let segment = ""
  let parens = 0

  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (c === "\\") {
      segment += text.slice(i, i + 2)
      i++
      continue
    }
    if (c === "(") parens++
    if (c === ")") parens--
    if (parens === 0 && (c === "{" || c === ";" || c === "}")) {
      if (c === "{") {
        out += minifyPrelude(segment) + "{"
      } else {
        const decl = minifyDeclaration(segment)
        if (decl) out += decl + ";"
        if (c === "}") out = out.replace(/;$/, "") + "}"
      }
      segment = ""
      continue
    }
    segment += c
  }
  // Trailing content without a terminator (e.g. a lone declaration)
  const tail = minifyDeclaration(segment)
  if (tail) out += tail

  // Restore protected chunks; a license comment needs no space after it
  const restored = out.replace(new RegExp(`${OPEN}(\\d+)${CLOSE}( ?)`, "g"), (_, n, space) => {
    const chunk = scanned.protectedChunks[Number(n)]
    return chunk.startsWith("/*!") ? chunk : chunk + space
  })
  return { ok: true, output: restored }
}

export function minifyCss(input: string): ToolResult {
  const r = minifyCssText(input)
  return r.ok ? ok(r.output, sizeNote(input, r.output)) : fail(r.error)
}
