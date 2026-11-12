import { fail, ok, type ToolResult } from "./types"

export const MAX_UUIDS = 1000

/** Generate RFC 4122 version 4 UUIDs using the browser's CSPRNG. */
export function generateUuids(countInput: string): ToolResult {
  const raw = countInput.trim()
  const count = raw === "" ? 1 : Number(raw)

  if (!Number.isInteger(count) || count < 1 || count > MAX_UUIDS) {
    return fail(`Enter how many UUIDs to generate: a whole number from 1 to ${MAX_UUIDS} (leave empty for 1).`)
  }

  return ok(Array.from({ length: count }, () => crypto.randomUUID()).join("\n"))
}
