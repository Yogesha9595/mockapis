import { fail, ok, type ToolResult } from "./types"

/**
 * UTF-8 Base64 encoding/decoding.
 *
 * `btoa`/`atob` work on Latin-1 "binary strings" only, so they reject emoji
 * and silently produce non-standard output for characters like "é".
 * These helpers go through UTF-8 bytes (TextEncoder/TextDecoder) instead,
 * matching `base64` on the command line and other standard tools.
 */

const CHUNK = 0x8000

function bytesToBinary(bytes: Uint8Array): string {
  let binary = ""
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK))
  }
  return binary
}

/** Encode any Unicode text as standard Base64 (UTF-8 bytes, with padding). */
export function encodeBase64(text: string): string {
  return btoa(bytesToBinary(new TextEncoder().encode(text)))
}

/** Allowed alphabets: standard (+/) and URL-safe (-_), optional "=" padding. */
const BASE64_PATTERN = /^[A-Za-z0-9+/\-_]*={0,2}$/

/**
 * Normalize user-supplied Base64: strips whitespace/line breaks, accepts the
 * URL-safe alphabet, and restores missing padding.
 * Returns null if the input cannot be valid Base64.
 */
export function normalizeBase64(input: string): string | null {
  const compact = input.replace(/\s+/g, "")
  if (!BASE64_PATTERN.test(compact)) return null

  const unpadded = compact.replace(/=+$/, "").replace(/-/g, "+").replace(/_/g, "/")
  // A single leftover character can never encode a whole byte
  if (unpadded.length % 4 === 1) return null

  return unpadded + "=".repeat((4 - (unpadded.length % 4)) % 4)
}

/** Decode Base64 to bytes, or null if the input is not valid Base64. */
export function decodeBase64ToBytes(input: string): Uint8Array | null {
  const normalized = normalizeBase64(input)
  if (normalized === null) return null

  try {
    const binary = atob(normalized)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    return bytes
  } catch {
    return null
  }
}

export function base64EncodeTool(input: string): ToolResult {
  return ok(encodeBase64(input))
}

export function base64DecodeTool(input: string): ToolResult {
  if (!input.trim()) return ok("")

  const bytes = decodeBase64ToBytes(input)
  if (!bytes) {
    return fail(
      "This is not valid Base64. Base64 may only contain A–Z, a–z, 0–9, + and / (or - and _ for URL-safe Base64), optionally ending with = padding."
    )
  }

  try {
    return ok(new TextDecoder("utf-8", { fatal: true }).decode(bytes))
  } catch {
    return fail(
      `The Base64 is valid, but the decoded ${bytes.length} bytes are not UTF-8 text (it is probably binary data such as an image or archive).`
    )
  }
}
