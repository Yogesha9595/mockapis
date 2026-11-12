import { minifyCssText } from "./cssMinify"
import { fail, lineAt, ok, sizeNote, type ToolResult } from "./types"

/**
 * Conservative HTML minifier (no dependencies).
 *
 * Removes comments (keeps IE conditional comments), collapses whitespace in
 * text, drops whitespace next to block-level elements (it is not rendered
 * there), tidies spacing inside tags and minifies <style> CSS.
 *
 * Never changes: <pre>/<textarea> content, <script> content, attribute
 * values, tag/attribute name case (SVG), entities, or the document's
 * element structure. Whitespace between inline elements is kept as one space.
 */

/** Elements whose surrounding whitespace is not rendered with default CSS. */
const BLOCK = new Set([
  "html", "head", "body", "title", "meta", "link", "style", "script", "base", "noscript", "template",
  "address", "article", "aside", "blockquote", "details", "dialog", "dd", "div", "dl", "dt", "fieldset",
  "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr",
  "li", "main", "nav", "ol", "p", "pre", "section", "summary", "table", "caption", "colgroup", "col",
  "thead", "tbody", "tfoot", "tr", "td", "th", "ul", "option", "optgroup", "br", "legend", "menu", "search",
])

/** Content copied verbatim up to the matching closing tag. */
const RAW_TEXT = new Set(["script", "style", "textarea"])

type Token =
  | { kind: "tag"; name: string; closing: boolean; text: string }
  | { kind: "text"; text: string; preserve: boolean }
  | { kind: "other"; text: string } // doctype, conditional comment, CDATA, raw element content

/**
 * Collapse whitespace inside a tag, never touching quoted attribute values:
 * runs become one space, spaces around "=" and before ">" or "/>" go away.
 */
function tidyTag(raw: string): string {
  let out = ""
  let quote: string | null = null
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i]
    if (quote) {
      out += c
      if (c === quote) quote = null
      continue
    }
    if (c === '"' || c === "'") {
      quote = c
      out += c
      continue
    }
    if (/\s/.test(c)) {
      let j = i
      while (j + 1 < raw.length && /\s/.test(raw[j + 1])) j++
      const next = raw[j + 1]
      // No space before "=", after "=", or before the end of the tag
      if (next !== "=" && next !== ">" && !(next === "/" && raw[j + 2] === ">") && !out.endsWith("=")) out += " "
      i = j
      continue
    }
    out += c
  }
  return out
}

export function minifyHtmlText(html: string): { ok: true; output: string } | { ok: false; error: string } {
  if (!html.trim()) return { ok: false, error: "Enter some HTML first." }

  const tokens: Token[] = []
  let preDepth = 0
  let i = 0

  while (i < html.length) {
    // Comments (conditional comments are kept)
    if (html.startsWith("<!--", i)) {
      const end = html.indexOf("-->", i + 4)
      if (end === -1) return { ok: false, error: `Unclosed comment "<!--" on line ${lineAt(html, i)}.` }
      const comment = html.slice(i, end + 3)
      if (/^<!--\[if|<!\[endif\]-->$/i.test(comment)) tokens.push({ kind: "other", text: comment })
      i = end + 3
      continue
    }
    // CDATA (SVG/MathML)
    if (html.startsWith("<![CDATA[", i)) {
      const end = html.indexOf("]]>", i)
      if (end === -1) return { ok: false, error: `Unclosed CDATA section on line ${lineAt(html, i)}.` }
      tokens.push({ kind: "other", text: html.slice(i, end + 3) })
      i = end + 3
      continue
    }
    // Doctype, processing instructions
    if (html.startsWith("<!", i) || html.startsWith("<?", i)) {
      const end = html.indexOf(">", i)
      if (end === -1) return { ok: false, error: `Unclosed "${html.slice(i, i + 9)}" on line ${lineAt(html, i)}.` }
      tokens.push({ kind: "other", text: html.slice(i, end + 1).replace(/\s+/g, " ") })
      i = end + 1
      continue
    }
    // Tags
    const tagMatch = /^<(\/?)([A-Za-z][A-Za-z0-9:-]*)/.exec(html.slice(i, i + 64))
    if (tagMatch) {
      // Find the closing ">" outside quotes
      let j = i + tagMatch[0].length
      let quote: string | null = null
      for (; j < html.length; j++) {
        const c = html[j]
        if (quote) {
          if (c === quote) quote = null
        } else if (c === '"' || c === "'") quote = c
        else if (c === ">") break
      }
      if (j >= html.length) {
        return { ok: false, error: `Unclosed tag <${tagMatch[2]}> on line ${lineAt(html, i)}${quote ? " (an attribute value's quote is never closed)" : ""}.` }
      }
      const closing = tagMatch[1] === "/"
      const name = tagMatch[2]
      const lower = name.toLowerCase()
      const raw = html.slice(i, j + 1)
      tokens.push({ kind: "tag", name: lower, closing, text: tidyTag(raw) })
      i = j + 1

      if (lower === "pre") preDepth += closing ? -1 : 1
      if (preDepth < 0) preDepth = 0

      // Raw text elements: copy content verbatim (style content is CSS-minified)
      if (!closing && RAW_TEXT.has(lower) && !raw.endsWith("/>")) {
        const closeRe = new RegExp(`</${lower}\\s*>`, "i")
        const rest = html.slice(i)
        const m = closeRe.exec(rest)
        if (!m) return { ok: false, error: `<${name}> on line ${lineAt(html, i)} is never closed with </${lower}>.` }
        let content = rest.slice(0, m.index)
        if (lower === "style") {
          const css = content.trim() ? minifyCssText(content) : null
          content = css && css.ok ? css.output : content
        }
        if (content) tokens.push({ kind: "other", text: content })
        tokens.push({ kind: "tag", name: lower, closing: true, text: `</${name}>` })
        i += m.index + m[0].length
      }
      continue
    }
    // Text (a "<" that does not start a tag is text, e.g. "a < b")
    const next = html.indexOf("<", i + 1)
    const end = next === -1 ? html.length : next
    const piece = html.slice(i, end)
    const last = tokens[tokens.length - 1]
    // Merge with preceding text (e.g. text split by a removed comment)
    if (last && last.kind === "text" && last.preserve === preDepth > 0) last.text += piece
    else tokens.push({ kind: "text", text: piece, preserve: preDepth > 0 })
    i = end
  }

  // Whitespace handling for text tokens, based on neighbouring tags
  const isBlockTag = (t: Token | undefined) => !t || (t.kind === "tag" && BLOCK.has(t.name))
  let out = ""
  tokens.forEach((t, k) => {
    if (t.kind !== "text") {
      out += t.text
      return
    }
    if (t.preserve) {
      out += t.text
      return
    }
    let text = t.text.replace(/\s+/g, " ")
    if (isBlockTag(tokens[k - 1])) text = text.replace(/^ /, "")
    if (isBlockTag(tokens[k + 1])) text = text.replace(/ $/, "")
    out += text
  })

  return { ok: true, output: out }
}

export function minifyHtml(input: string): ToolResult {
  const r = minifyHtmlText(input)
  return r.ok ? ok(r.output, sizeNote(input, r.output)) : fail(r.error)
}
