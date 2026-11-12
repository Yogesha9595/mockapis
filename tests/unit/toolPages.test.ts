import { test } from "node:test"
import assert from "node:assert/strict"
import { createElement as h } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { toolPages } from "@/data/toolPages"
import { tools, standaloneTools, isLive } from "@/data/tools"
import { getToolDefinition } from "@/lib/tools/engine"
import { formatJson, minifyJson } from "@/lib/tools/json"
import Breadcrumb from "@/components/Breadcrumb"

/* ---------------- CONTENT INTEGRITY ---------------- */

test("every tool page entry belongs to a live tool with a definition", () => {
  for (const slug of Object.keys(toolPages)) {
    const tool = tools.find((t) => t.slug === slug)
    assert.ok(tool && isLive(tool), `${slug} is not a live tool`)
    assert.ok(getToolDefinition(slug), `${slug} has no tool definition`)
    const page = toolPages[slug]
    assert.ok(page.howTo.length > 0 && page.formats.length > 0 && page.limitations.length > 0, `${slug} content incomplete`)
  }
})

test("related tools listed in content exist", () => {
  for (const [slug, page] of Object.entries(toolPages)) {
    for (const r of page.related ?? []) {
      assert.ok([...tools, ...standaloneTools].some((t) => t.slug === r), `${slug} → unknown related ${r}`)
    }
  }
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
