import { fail, lineAt, ok, sizeNote, type ToolResult } from "./types"

/**
 * XML minifier with a well-formedness check (no dependencies).
 *
 * Removes comments, whitespace-only text between elements and redundant
 * spacing inside tags. Honours xml:space="preserve" (nothing is removed inside).
 *
 * Never changes: text that contains non-whitespace characters (it is data,
 * so it is kept exactly, including surrounding spaces), attribute values,
 * CDATA, processing instructions, the XML declaration or the DOCTYPE.
 */

const NAME = /^[A-Za-z_:][\w.:-]*/

/** Spacing inside a start/end tag; quoted attribute values are copied as-is. */
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
      if (next !== "=" && next !== ">" && !(next === "/" && raw[j + 2] === ">") && !out.endsWith("=")) out += " "
      i = j
      continue
    }
    out += c
  }
  return out
}

/** Check that "&" in text/attributes starts a valid reference. */
function badAmpersand(s: string): number {
  const re = /&(?!(?:[A-Za-z_][\w.-]*|#\d+|#x[0-9A-Fa-f]+);)/g
  const m = re.exec(s)
  return m ? m.index : -1
}

export function minifyXmlText(xml: string): { ok: true; output: string } | { ok: false; error: string } {
  if (!xml.trim()) return { ok: false, error: "Enter some XML first." }

  const stack: { name: string; line: number; preserve: boolean }[] = []
  let out = ""
  let rootSeen = false
  let rootClosed = false
  let i = 0

  const preserving = () => stack.length > 0 && stack[stack.length - 1].preserve
  const err = (msg: string, at: number) => ({ ok: false as const, error: `${msg} (line ${lineAt(xml, at)}).` })

  while (i < xml.length) {
    if (xml.startsWith("<!--", i)) {
      const end = xml.indexOf("-->", i + 4)
      if (end === -1) return err("Unclosed comment", i)
      if (preserving()) out += xml.slice(i, end + 3)
      i = end + 3
      continue
    }
    if (xml.startsWith("<![CDATA[", i)) {
      if (!stack.length) return err("CDATA is only allowed inside an element", i)
      const end = xml.indexOf("]]>", i)
      if (end === -1) return err("Unclosed CDATA section", i)
      out += xml.slice(i, end + 3)
      i = end + 3
      continue
    }
    if (xml.startsWith("<?", i)) {
      const end = xml.indexOf("?>", i)
      if (end === -1) return err("Unclosed processing instruction", i)
      out += xml.slice(i, end + 2)
      i = end + 2
      continue
    }
    if (xml.startsWith("<!DOCTYPE", i) || xml.startsWith("<!doctype", i)) {
      // Internal subset [ … ] may contain ">"
      const bracket = xml.indexOf("[", i)
      const gt = xml.indexOf(">", i)
      let end = gt
      if (bracket !== -1 && bracket < gt) {
        const close = xml.indexOf("]", bracket)
        end = close === -1 ? -1 : xml.indexOf(">", close)
      }
      if (end === -1) return err("Unclosed DOCTYPE", i)
      out += xml.slice(i, end + 1)
      i = end + 1
      continue
    }
    if (xml[i] === "<") {
      const closing = xml[i + 1] === "/"
      const nameMatch = NAME.exec(xml.slice(i + (closing ? 2 : 1), i + 200))
      if (!nameMatch) return err(`"<" must start a tag; write &lt; for a literal "<"`, i)
      const name = nameMatch[0]

      let j = i + (closing ? 2 : 1) + name.length
      let quote: string | null = null
      for (; j < xml.length; j++) {
        const c = xml[j]
        if (quote) {
          if (c === quote) quote = null
          else if (c === "<") return err(`"<" is not allowed inside the attribute value of <${name}>`, j)
        } else if (c === '"' || c === "'") quote = c
        else if (c === ">") break
      }
      if (j >= xml.length) return err(`Unclosed tag <${closing ? "/" : ""}${name}>`, i)

      const raw = xml.slice(i, j + 1)
      const amp = badAmpersand(raw)
      if (amp !== -1) return err(`"&" in <${name}> must be written as &amp;`, i + amp)

      if (closing) {
        const top = stack.pop()
        if (!top) return err(`Closing tag </${name}> has no matching opening tag`, i)
        if (top.name !== name) return err(`Closing tag </${name}> does not match <${top.name}> opened on line ${top.line}`, i)
        if (!stack.length) rootClosed = true
        out += `</${name}>`
      } else {
        if (rootClosed) return err(`A document can only have one root element; <${name}> is a second one`, i)
        rootSeen = true
        const selfClosing = /\/\s*>$/.test(raw)
        // Attribute names must be unique
        const outsideValues = raw.slice(name.length + 1).replace(/"[^"]*"|'[^']*'/g, '""')
        const attrs = [...outsideValues.matchAll(/([A-Za-z_:][\w.:-]*)\s*=/g)].map((m) => m[1])
        const dup = attrs.find((a, k) => attrs.indexOf(a) !== k)
        if (dup) return err(`Attribute "${dup}" appears twice in <${name}>`, i)
        const space = /\bxml:space\s*=\s*["'](preserve|default)["']/.exec(raw)?.[1]
        const preserve = space ? space === "preserve" : preserving()
        out += tidyTag(raw)
        if (!selfClosing) stack.push({ name, line: lineAt(xml, i), preserve })
        else if (!stack.length) rootClosed = true
      }
      i = j + 1
      continue
    }

    // Text
    const next = xml.indexOf("<", i)
    const end = next === -1 ? xml.length : next
    const text = xml.slice(i, end)
    if (text.trim()) {
      if (!stack.length) return err("Text is only allowed inside the root element", i + text.search(/\S/))
      const amp = badAmpersand(text)
      if (amp !== -1) return err(`"&" must be written as &amp; unless it starts an entity such as &lt;`, i + amp)
      out += text // data: kept exactly
    } else if (preserving()) {
      out += text
    }
    i = end
  }

  if (stack.length) {
    const open = stack[stack.length - 1]
    return { ok: false, error: `<${open.name}> opened on line ${open.line} is never closed.` }
  }
  if (!rootSeen) return { ok: false, error: "No root element found. XML needs exactly one element that contains everything else." }
  return { ok: true, output: out }
}

export function minifyXml(input: string): ToolResult {
  const r = minifyXmlText(input)
  return r.ok ? ok(r.output, sizeNote(input, r.output)) : fail(r.error)
}
