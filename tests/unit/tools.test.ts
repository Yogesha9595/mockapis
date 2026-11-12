import { test } from "node:test"
import assert from "node:assert/strict"
import { tools, standaloneTools, isLive, liveToolLinks, categoryHref } from "@/data/tools"
import { toolDefinitions, getToolDefinition } from "@/lib/tools/engine"
import { formatJson, minifyJson, validateJson, findJsonErrorOffset } from "@/lib/tools/json"
import { decodeJwt } from "@/lib/tools/jwt"
import { convertTimestamp } from "@/lib/tools/timestamp"
import { generateUuids } from "@/lib/tools/uuid"
import { countWords, sortLines } from "@/lib/tools/text"
import { hashText } from "@/lib/tools/hash"

/* ---------------- REGISTRY CONSISTENCY ---------------- */

test("every live generic tool has a definition whose example works", () => {
  for (const tool of tools.filter(isLive)) {
    const def = getToolDefinition(tool.slug)
    assert.ok(def, `${tool.slug} is live but has no definition`)
    const result = def.primary.run(def.sample)
    assert.ok(result.ok, `${tool.slug} example failed: ${!result.ok && result.error}`)
    assert.ok(result.output.length > 0, `${tool.slug} example produced empty output`)
  }
})

test("every definition belongs to a registered tool", () => {
  for (const slug of Object.keys(toolDefinitions)) {
    assert.ok(tools.some((t) => t.slug === slug), `definition for unknown tool ${slug}`)
  }
})

test("liveToolLinks returns only working tools with real routes", () => {
  const links = liveToolLinks()
  const all = [...tools, ...standaloneTools]
  assert.ok(links.length > 0)
  for (const link of links) {
    const tool = all.find((t) => t.slug === link.slug)
    assert.ok(tool && isLive(tool), `${link.slug} is linked but not live`)
    assert.match(link.href, /^\/tools\/[a-z0-9-]+$/)
  }
  // Partial/planned tools never appear, standalone hrefs are used as-is
  assert.ok(!links.some((l) => l.slug === "json-to-csv" || l.slug === "url-encoder-decoder"))
  assert.equal(links.find((l) => l.slug === "view-source")?.href, "/tools/view-source")
  // Category pages are only linked when they contain a working generic tool
  assert.equal(categoryHref("json"), "/tools/category/json")
  assert.equal(categoryHref("yaml"), null) // no working YAML tool yet
  // Formatter and XML gained working generic tools (HTML/CSS/XML minifiers)
  assert.equal(categoryHref("formatter"), "/tools/category/formatter")
  assert.equal(categoryHref("xml"), "/tools/category/xml")
  // The rule itself: a category page is linked iff it has a working generic tool
  for (const id of new Set(tools.map((t) => t.category))) {
    assert.equal(categoryHref(id) !== null, tools.some((t) => t.category === id && isLive(t)), id)
  }
})

test("no tool runs JSON-only logic unless it is a JSON tool", () => {
  for (const [slug, def] of Object.entries(toolDefinitions)) {
    if (slug.startsWith("json-")) continue
    // Every action, given this tool's own sample, must not behave like a JSON tool
    for (const action of [def.primary, ...(def.extra ?? [])]) {
      const r = action.run(def.sample)
      assert.ok(r.ok || !/JSON/.test(r.error), `${slug} → ${action.label} gave a JSON error: ${!r.ok && r.error}`)
      if (r.ok) assert.doesNotMatch(r.output, /Valid JSON/, `${slug} → ${action.label} produced JSON validation output`)
    }
  }
})

/* ---------------- JSON ---------------- */

test("json format / minify / validate", () => {
  assert.deepEqual(formatJson('{"a":1,"b":[1,2]}'), { ok: true, output: '{\n  "a": 1,\n  "b": [\n    1,\n    2\n  ]\n}' })
  assert.deepEqual(minifyJson('{\n "a" : 1 }'), { ok: true, output: '{"a":1}' })
  assert.deepEqual(validateJson("[1,2,3]"), { ok: true, output: "✓ Valid JSON — an array with 3 items." })
  assert.deepEqual(formatJson('{"emoji":"🚀","hi":"नमस्ते"}', 0), { ok: true, output: '{"emoji":"🚀","hi":"नमस्ते"}' })
})

test("invalid JSON reports line and column", () => {
  const r = validateJson('{\n  "a": 1,\n  "b": }')
  assert.equal(r.ok, false)
  if (!r.ok) assert.match(r.error, /^Invalid JSON: .*line 3 column \d+/)
  assert.deepEqual(formatJson("   "), { ok: false, error: "Enter some JSON first." })

  // The engine's echo of the input (with or without a "..." prefix) is removed
  for (const bad of ['{\n  "a": 1,\n  "b": [1, 2,],\n}', '{"a":}', "[1,]"]) {
    const res = formatJson(bad)
    assert.equal(res.ok, false)
    if (!res.ok) {
      assert.doesNotMatch(res.error, /is not valid JSON/, res.error)
      assert.match(res.error, /\(line \d+ column \d+\)$/, res.error)
    }
  }
})

test("error-offset scanner agrees with JSON.parse on validity", () => {
  const cases = [
    '{"a":1}', "[1,2,3]", '"x"', "true", "null", "-0.5e+10", '{"a":{"b":[{}, [], "\\u00e9"]}}', " [ ] ",
    "{", "[1,]", '{"a":1,}', "{a:1}", "'x'", "01", "tru", '"\\x"', '"a\nb"', "[1 2]", "{} {}", "", "1.", '{"a" 1}',
  ]
  for (const c of cases) {
    let valid = true
    try { JSON.parse(c) } catch { valid = false }
    assert.equal(findJsonErrorOffset(c) === null, valid, JSON.stringify(c))
  }
  assert.equal(findJsonErrorOffset('{\n  "a": 1,\n  "b": }'), 19)
})

/* ---------------- JWT ---------------- */

const b64url = (o: unknown) => Buffer.from(JSON.stringify(o)).toString("base64url")

test("jwt decodes header, payload (UTF-8) and time claims", () => {
  const token = `${b64url({ alg: "HS256", typ: "JWT" })}.${b64url({ name: "José 🚀", exp: 1700003600, iat: 1700000000 })}.sig`
  const r = decodeJwt(`Bearer ${token}`, new Date("2030-01-01"))
  assert.ok(r.ok)
  assert.match(r.output, /"alg": "HS256"/)
  assert.match(r.output, /"name": "José 🚀"/)
  assert.match(r.output, /Expires \(exp\): 2023-11-14T23:13:20.000Z {2}\(expired\)/)
  assert.match(r.output, /Signature: not verified/)
})

test("jwt rejects malformed tokens clearly", () => {
  assert.equal(decodeJwt("abc").ok, false)
  assert.equal(decodeJwt("a.b").ok, false)
  const r = decodeJwt(`${b64url({ alg: "none" })}.!!!.x`)
  assert.equal(r.ok, false)
  if (!r.ok) assert.match(r.error, /payload is not valid Base64URL/)
})

/* ---------------- TIMESTAMP ---------------- */

test("timestamp: seconds, milliseconds and ISO dates", () => {
  const s = convertTimestamp("1700000000", "UTC")
  assert.ok(s.ok)
  assert.match(s.output, /seconds/)
  assert.match(s.output, /2023-11-14T22:13:20.000Z/)

  const ms = convertTimestamp("1700000000000", "UTC")
  assert.ok(ms.ok)
  assert.match(ms.output, /milliseconds/)
  assert.match(ms.output, /2023-11-14T22:13:20.000Z/)

  const iso = convertTimestamp("2024-01-31T12:00:00Z", "UTC")
  assert.ok(iso.ok)
  assert.match(iso.output, /Unix seconds: +1706702400/)

  assert.equal(convertTimestamp("not a date").ok, false)
  assert.equal(convertTimestamp("").ok, false)
})

/* ---------------- UUID ---------------- */

test("uuid v4 generation and count validation", () => {
  const v4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
  const one = generateUuids("")
  assert.ok(one.ok && v4.test(one.output))
  const five = generateUuids("5")
  assert.ok(five.ok)
  const list = five.output.split("\n")
  assert.equal(list.length, 5)
  assert.equal(new Set(list).size, 5)
  list.forEach((u) => assert.match(u, v4))
  for (const bad of ["0", "-1", "1.5", "abc", "1001"]) assert.equal(generateUuids(bad).ok, false, bad)
})

/* ---------------- HASH ---------------- */

test("SHA hashes match known vectors (UTF-8)", async () => {
  assert.equal(await hashText("abc", "SHA-256"), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad")
  assert.equal(await hashText("", "SHA-1"), "da39a3ee5e6b4b0d3255bfef95601890afd80709")
  const { createHash } = await import("node:crypto")
  assert.equal(await hashText("नमस्ते 🚀", "SHA-512"), createHash("sha512").update("नमस्ते 🚀", "utf8").digest("hex"))
})

/* ---------------- TEXT ---------------- */

test("text sort is natural and locale-aware", () => {
  assert.deepEqual(sortLines("banana\nApple\nitem10\ncherry\nitem2"), { ok: true, output: "Apple\nbanana\ncherry\nitem2\nitem10" })
  assert.deepEqual(sortLines("a\nc\nb", "desc"), { ok: true, output: "c\nb\na" })
})

test("word counter handles English, Hindi and emoji", () => {
  const r = countWords("Hello world. How are you?\n\nनमस्ते दुनिया! 🚀")
  assert.ok(r.ok)
  assert.match(r.output, /Words: +7\n/)
  assert.match(r.output, /Sentences: +3\n/)
  assert.match(r.output, /Paragraphs: +2\n/)
  assert.match(countWords("").ok ? (countWords("") as { output: string }).output : "", /Words: +0\n/)
})
