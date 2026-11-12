import { decodeBase64ToBytes } from "./base64"
import { fail, ok, type ToolResult } from "./types"

function decodeSegment(segment: string, name: string): { ok: true; value: unknown } | { ok: false; error: string } {
  const bytes = decodeBase64ToBytes(segment)
  if (!bytes) return { ok: false, error: `The ${name} is not valid Base64URL.` }
  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes)
    return { ok: true, value: JSON.parse(text) }
  } catch {
    return { ok: false, error: `The ${name} does not decode to JSON.` }
  }
}

const TIME_CLAIMS: Record<string, string> = { exp: "Expires", iat: "Issued at", nbf: "Not before" }

/**
 * Decode (not verify) a JWT: shows header, payload and human-readable
 * time claims. The signature is never checked — this is stated in the output.
 */
export function decodeJwt(input: string, now: Date = new Date()): ToolResult {
  const token = input.trim().replace(/^Bearer\s+/i, "")
  if (!token) return fail("Paste a JWT (three Base64URL parts separated by dots).")

  const parts = token.split(".")
  if (parts.length !== 3) {
    return fail(
      `A JWT has 3 parts separated by dots (header.payload.signature); this has ${parts.length}.` +
        (parts.length === 5 ? " Five parts means an encrypted JWE, which cannot be decoded without the key." : "")
    )
  }

  const header = decodeSegment(parts[0], "header")
  if (!header.ok) return fail(header.error)
  const payload = decodeSegment(parts[1], "payload")
  if (!payload.ok) return fail(payload.error)

  const lines = [
    "// Header",
    JSON.stringify(header.value, null, 2),
    "",
    "// Payload",
    JSON.stringify(payload.value, null, 2),
  ]

  if (payload.value && typeof payload.value === "object") {
    const claims = payload.value as Record<string, unknown>
    const times = Object.entries(TIME_CLAIMS)
      .filter(([key]) => typeof claims[key] === "number")
      .map(([key, label]) => {
        const date = new Date((claims[key] as number) * 1000)
        let note = ""
        if (key === "exp") note = date < now ? "  (expired)" : "  (not yet expired)"
        return `// ${label} (${key}): ${date.toISOString()}${note}`
      })
    if (times.length) lines.push("", ...times)
  }

  lines.push("", "// Signature: not verified. Decoding does not prove the token is authentic.")
  return ok(lines.join("\n"))
}
