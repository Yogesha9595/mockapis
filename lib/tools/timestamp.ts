import { fail, ok, type ToolResult } from "./types"

/**
 * Unix timestamp ⇄ date.
 *  - Numbers: up to 11 digits are treated as seconds, longer as milliseconds.
 *  - Anything else is parsed as a date (ISO 8601 recommended).
 */
export function convertTimestamp(input: string, timeZone?: string): ToolResult {
  const value = input.trim()
  if (!value) return fail("Enter a Unix timestamp (e.g. 1700000000) or a date (e.g. 2024-01-31T12:00:00Z).")

  let date: Date
  let detected: string

  if (/^-?\d+(\.\d+)?$/.test(value)) {
    const n = Number(value)
    const isMillis = Math.abs(Math.trunc(n)).toString().length > 11
    date = new Date(isMillis ? n : n * 1000)
    detected = isMillis ? "Unix timestamp in milliseconds" : "Unix timestamp in seconds"
  } else {
    date = new Date(value)
    detected = "Date string"
  }

  if (isNaN(date.getTime())) {
    return fail(`"${value}" is not a valid timestamp or date. Use digits for Unix time, or an ISO 8601 date such as 2024-01-31T12:00:00Z.`)
  }

  const local = date.toLocaleString(undefined, { timeZone, dateStyle: "full", timeStyle: "long" })

  return ok(
    [
      `Input:              ${detected}`,
      `ISO 8601 (UTC):     ${date.toISOString()}`,
      `UTC:                ${date.toUTCString()}`,
      `Local time:         ${local}`,
      `Unix seconds:       ${Math.floor(date.getTime() / 1000)}`,
      `Unix milliseconds:  ${date.getTime()}`,
    ].join("\n")
  )
}
