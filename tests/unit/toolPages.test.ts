import { test } from "node:test"
import assert from "node:assert/strict"
import { createElement as h } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { toolPages, type ToolPageContent } from "@/data/toolPages"
import { tools, standaloneTools, isLive } from "@/data/tools"
import { getToolDefinition } from "@/lib/tools/engine"
import { formatJson, minifyJson } from "@/lib/tools/json"
import { sortLines } from "@/lib/tools/text"
import { urlEncode } from "@/lib/tools/url"
import Breadcrumb from "@/components/Breadcrumb"

/* ---------------- CONTENT INTEGRITY ---------------- */

test("every live tool has a complete page, and every page belongs to a live tool", () => {
  for (const tool of tools.filter(isLive)) {
    assert.ok(toolPages[tool.slug], `${tool.slug} is live but has no page content (it would 404)`)
  }
  for (const [slug, page] of Object.entries(toolPages)) {
    const tool = tools.find((t) => t.slug === slug)
    assert.ok(tool && isLive(tool), `${slug} is not a live tool`)
    assert.ok(getToolDefinition(slug), `${slug} has no tool definition`)
    assert.ok(page.title && page.h1 && page.metaDescription && page.intro, `${slug}: title, h1, metaDescription and intro are required`)
    assert.ok(page.howTo.length >= 3 && page.howTo.length <= 5, `${slug}: How to use needs 3 to 5 steps`)
    assert.ok(page.formats.length > 0 && page.limitations.length > 0, `${slug}: formats and limitations required`)
    assert.equal(page.examples.length, 2, `${slug}: exactly 2 worked examples`)
    assert.ok(page.errors.length >= 2, `${slug}: at least 2 common errors`)
    assert.equal(page.faq.length, 4, `${slug}: exactly 4 FAQ entries`)
  }
})

test("titles and H1s are unique across tool pages", () => {
  const pages = Object.values(toolPages)
  assert.equal(new Set(pages.map((p) => p.title)).size, pages.length)
  assert.equal(new Set(pages.map((p) => p.h1)).size, pages.length)
  assert.equal(new Set(pages.map((p) => p.metaDescription)).size, pages.length)
})

test("related tools listed in content exist", () => {
  for (const [slug, page] of Object.entries(toolPages)) {
    for (const r of page.related ?? []) {
      assert.ok([...tools, ...standaloneTools].some((t) => t.slug === r), `${slug} → unknown related ${r}`)
    }
  }
})

/* ---------------- EXAMPLES AND ERRORS ARE THE ENGINE'S REAL OUTPUT ---------------- */

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
const withoutLocalTime = (s: string) => s.split("\n").filter((l) => !l.startsWith("Local time:")).join("\n")

test("every worked example shows exactly what the tool produces", () => {
  for (const [slug, page] of Object.entries(toolPages)) {
    const def = getToolDefinition(slug)!
    for (const ex of page.examples) {
      const action = ex.action ? [def.primary, ...(def.extra ?? [])].find((a) => a.label === ex.action) : def.primary
      assert.ok(action, `${slug} "${ex.title}": no action labelled ${ex.action}`)
      const r = action.run(ex.input)
      const where = `${slug} "${ex.title}"`
      if (ex.error) {
        assert.deepEqual(r, { ok: false, error: ex.output }, where)
        continue
      }
      assert.ok(r.ok, `${where} failed: ${!r.ok && r.error}`)
      if (ex.variable === "uuid") {
        const lines = r.output.split("\n")
        assert.equal(lines.length, ex.output.split("\n").length, where)
        for (const line of [...lines, ...ex.output.split("\n")]) assert.match(line, UUID_V4, where)
      } else if (ex.variable === "local-time") {
        assert.equal(withoutLocalTime(r.output), withoutLocalTime(ex.output), where)
      } else {
        assert.equal(r.output, ex.output, where)
      }
    }
  }
})

test("every quoted error message is the tool's real message", () => {
  for (const [slug, page] of Object.entries(toolPages)) {
    const def = getToolDefinition(slug)!
    for (const e of page.errors) {
      if (e.verifyWith === undefined) continue
      assert.deepEqual(def.primary.run(e.verifyWith), { ok: false, error: e.message }, `${slug}: ${e.message}`)
    }
  }
})

/* ---------------- NO SENTENCE ON MORE THAN ONE PAGE ---------------- */

/** Every prose sentence a tool page shows (code samples in examples are data, not prose). */
function pageSentences(page: ToolPageContent): string[] {
  const prose = [
    page.title,
    page.h1,
    page.metaDescription,
    page.intro,
    ...page.howTo,
    ...page.formats,
    ...page.limitations,
    ...page.examples.flatMap((e) => [e.title, e.note]),
    ...page.errors.flatMap((e) => [e.message, e.cause, e.fix]),
    ...page.faq.flatMap((f) => [f.question, f.answer]),
  ]
  return prose.flatMap((text) =>
    text
      // split after . ! ? when the next sentence starts with a capital, quote or digit
      .split(/(?<=[.!?])\s+(?=[A-Z"“'(0-9])/)
      .map((s) => s.trim().replace(/\s+/g, " ").toLowerCase())
      .filter(Boolean)
  )
}

test("no sentence appears on more than one tool page", () => {
  const seen = new Map<string, string>()
  const clashes: string[] = []
  for (const [slug, page] of Object.entries(toolPages)) {
    for (const sentence of new Set(pageSentences(page))) {
      const other = seen.get(sentence)
      if (other && other !== slug) clashes.push(`"${sentence}" on ${other} and ${slug}`)
      else seen.set(sentence, slug)
    }
  }
  assert.deepEqual(clashes, [])
})

/* ---------------- CLAIMS ON OTHER PAGES ---------------- */

test("claim (text-sort): leading spaces count, so an indented line sorts first", () => {
  assert.deepEqual(sortLines("apple\n  zebra\nbanana"), { ok: true, output: "  zebra\napple\nbanana" })
})

test("claim (text-sort): lines equal except for case keep their input order", () => {
  assert.deepEqual(sortLines("apple\nApple\nAPPLE"), { ok: true, output: "apple\nApple\nAPPLE" })
})

test("claim (url-encoder): Encode full URL escapes an existing %20", () => {
  assert.deepEqual(urlEncode("a%20b", "full"), { ok: true, output: "a%2520b" })
})

/* ---------------- JSON FORMATTER: every documented claim is true ---------------- */

test("claim: comments, trailing commas, single quotes and unquoted keys are errors", () => {
  for (const bad of ['{"a":1, // c\n}', '{"a":1,}', "{'a':1}", "{a:1}"]) {
    assert.equal(formatJson(bad).ok, false, bad)
  }
})

test("claim: integers above 2^53-1 lose precision (documented example is exact)", () => {
  assert.deepEqual(formatJson('{"id":9007199254740993}'), { ok: true, output: '{\n  "id": 9007199254740992\n}' })
  assert.deepEqual(formatJson('{"id":9007199254740991}'), { ok: true, output: '{\n  "id": 9007199254740991\n}' })
})

test("claim: duplicate keys keep only the last value; key order is preserved", () => {
  assert.deepEqual(minifyJson('{"b":1,"a":2,"b":3}'), { ok: true, output: '{"b":3,"a":2}' })
  assert.deepEqual(minifyJson('{"z":1,"a":2,"m":3}'), { ok: true, output: '{"z":1,"a":2,"m":3}' })
})

test("claim: output uses 2-space indentation and keeps Unicode", () => {
  const r = formatJson('{"x":{"y":"नमस्ते 🚀"}}')
  assert.deepEqual(r, { ok: true, output: '{\n  "x": {\n    "y": "नमस्ते 🚀"\n  }\n}' })
})

/* ---------------- BREADCRUMB ---------------- */

test("breadcrumb: ordered list, current page not linked, JSON-LD mirrors items", () => {
  const html = renderToStaticMarkup(
    h(Breadcrumb, { items: [{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }, { label: "JSON Formatter" }] })
  )
  assert.match(html, /<nav aria-label="Breadcrumb"/)
  assert.match(html, /<ol/)
  assert.match(html, /<a[^>]*href="\/tools"/)
  assert.match(html, /<span aria-current="page"[^>]*>JSON Formatter<\/span>/)
  assert.doesNotMatch(html, /href="[^"]*json/)
  assert.match(html, /"@type":"BreadcrumbList"/)
  assert.match(html, /"item":"https:\/\/devutilitieslab\.com\/tools"/)
})
