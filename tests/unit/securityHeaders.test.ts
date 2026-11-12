import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { SECURITY_HEADERS, CONTENT_SECURITY_POLICY } from "@/lib/securityHeaders"

test("public/_headers matches lib/securityHeaders.ts", () => {
  const file = readFileSync("public/_headers", "utf8")
  const globalBlock = file.split(/^\/\*\s*$/m)[1].split(/^\/\S/m)[0]
  const parsed = new Map(
    globalBlock
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#"))
      .map((l) => {
        const i = l.indexOf(":")
        return [l.slice(0, i).trim(), l.slice(i + 1).trim()] as const
      })
  )
  assert.equal(parsed.size, SECURITY_HEADERS.length)
  for (const { key, value } of SECURITY_HEADERS) assert.equal(parsed.get(key), value, key)
})

test("CSP never allows dangerous sources", () => {
  assert.doesNotMatch(CONTENT_SECURITY_POLICY, /unsafe-eval/)
  assert.match(CONTENT_SECURITY_POLICY, /object-src 'none'/)
  assert.match(CONTENT_SECURITY_POLICY, /frame-ancestors 'self'/)
  assert.doesNotMatch(CONTENT_SECURITY_POLICY, /script-src[^;]*\s\*/)
})
