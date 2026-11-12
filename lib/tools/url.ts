import { fail, ok, type ToolResult } from "./types"

/**
 * Percent-encoding (RFC 3986) helpers. Text is encoded as UTF-8 bytes,
 * so "é" → "%C3%A9" and "😀" → "%F0%9F%98%80".
 *
 * Modes:
 *  - "component": for a single value (query value, path segment). Encodes
 *                 everything except A–Z a–z 0–9 - _ . ! ~ * ' ( )
 *                 (JavaScript's encodeURIComponent).
 *  - "full":      for a whole URL. Keeps URL structure characters such as
 *                 : / ? # & = intact (JavaScript's encodeURI).
 *  - "form":      application/x-www-form-urlencoded (HTML form / query string
 *                 bodies): like "component" but spaces become "+".
 */
export type UrlMode = "component" | "full" | "form"

export const URL_MODES: { value: UrlMode; label: string; hint: string }[] = [
  { value: "component", label: "Component", hint: "Encodes a single value such as a query parameter or path segment." },
  { value: "full", label: "Full URL", hint: "Keeps URL structure characters ( : / ? # & = ) and encodes the rest." },
  { value: "form", label: "Form / query string", hint: "Like Component, but spaces become + (HTML forms, application/x-www-form-urlencoded)." },
]

const LONE_SURROGATE =
  "The text contains an invalid Unicode character (an unpaired surrogate), which cannot be URL-encoded."

export function urlEncode(text: string, mode: UrlMode = "component"): ToolResult {
  try {
    switch (mode) {
      case "full":
        return ok(encodeURI(text))
      case "form":
        return ok(
          encodeURIComponent(text)
            // URLSearchParams leaves only * - . _ unescaped (plus alphanumerics)
            .replace(/[!'()~]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase())
            .replace(/%20/g, "+")
        )
      default:
        return ok(encodeURIComponent(text))
    }
  } catch {
    return fail(LONE_SURROGATE)
  }
}

/** Find the first malformed escape so the error can point at it. */
function describeMalformed(text: string): string {
  const badEscape = /%(?![0-9A-Fa-f]{2})/.exec(text)
  if (badEscape) {
    const snippet = text.slice(badEscape.index, badEscape.index + 3)
    return `Malformed escape "${snippet}" at position ${badEscape.index + 1}: "%" must be followed by two hexadecimal digits (for a literal percent sign, use %25).`
  }
  return "The percent-encoded bytes do not form valid UTF-8 text (for example, an incomplete multi-byte sequence such as %E0%A4 without its final byte)."
}

export function urlDecode(text: string, mode: UrlMode = "component"): ToolResult {
  const source = mode === "form" ? text.replace(/\+/g, " ") : text
  try {
    return ok(mode === "full" ? decodeURI(source) : decodeURIComponent(source))
  } catch {
    return fail(describeMalformed(source))
  }
}
