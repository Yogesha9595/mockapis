import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { createElement as h } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { Button, buttonVariants, Card, CardHeader, Field, Input, Textarea, Select, Alert, Badge, Spinner } from "@/components/ui"
import { ToolLayout, ToolPanel, ToolGrid } from "@/components/tools/ToolLayout"

const html = (el: Parameters<typeof renderToStaticMarkup>[0]) => renderToStaticMarkup(el)

test("Button: defaults to type=button, variants use tokens, loading disables and sets aria-busy", () => {
  const plain = html(h(Button, null, "Format"))
  assert.match(plain, /type="button"/)
  assert.match(plain, /bg-primary text-primary-foreground/)

  const loading = html(h(Button, { loading: true, variant: "secondary" }, "Saving"))
  assert.match(loading, /disabled=""/)
  assert.match(loading, /aria-busy="true"/)
  assert.match(loading, /<svg[^>]*aria-hidden="true"/)

  assert.match(buttonVariants({ variant: "ghost", size: "sm" }), /h-8/)
  assert.doesNotMatch(buttonVariants({ variant: "ghost" }), /bg-primary/)
})

test("Field connects label, hint and error to its control", () => {
  const out = html(
    h(Field, { label: "JSON input", hint: "Paste JSON", error: "Invalid JSON", id: "json", children: h(Textarea, { value: "", readOnly: true }) })
  )
  assert.match(out, /<label for="json"[^>]*>JSON input<\/label>/)
  assert.match(out, /<textarea[^>]*id="json"/)
  assert.match(out, /aria-describedby="json-hint json-error"/)
  assert.match(out, /aria-invalid="true"/)
  assert.match(out, /<p id="json-error" role="alert"/)
  assert.match(out, /font-mono/) // code textarea by default
  assert.match(out, /spellCheck="false"|spellcheck="false"/i)
})

test("Field without error does not mark the control invalid; auto ids are generated", () => {
  const out = html(h(Field, { label: "Count", children: h(Input, { type: "number" }) }))
  assert.doesNotMatch(out, /aria-invalid="/) // attribute absent (the class aria-invalid:… is expected)
  const id = /<input[^>]*id="([^"]+)"/.exec(out)?.[1]
  assert.ok(id, "input has an id")
  assert.match(out, new RegExp(`<label for="${id}"`))
})

test("Select and Input accept explicit a11y props that override Field", () => {
  const out = html(h(Field, { label: "Mode", id: "mode", children: h(Select, { id: "custom", children: h("option", null, "A") }) }))
  assert.match(out, /<select[^>]*id="custom"/)
})

test("Alert: errors are role=alert, others role=status", () => {
  assert.match(html(h(Alert, { variant: "error", title: "Failed" }, "Details")), /role="alert"[^>]*text-danger/)
  assert.match(html(h(Alert, { variant: "success" }, "Copied")), /role="status"/)
})

test("Card, CardHeader, Badge and Spinner render with tokens", () => {
  const card = html(h(Card, { interactive: true }, h(CardHeader, { title: "Base64", description: "Encode text", aside: h(Badge, { variant: "warning", children: "Coming soon" }) })))
  assert.match(card, /rounded-container border border-border bg-card/)
  assert.match(card, /<h3[^>]*>Base64<\/h3>/)
  assert.match(card, /text-warning/)
  assert.match(html(h(Spinner, { label: "Loading editor…" })), /role="status"/)
})

test("ToolLayout renders one H1, labelled panels and a live feedback region", () => {
  const out = html(
    h(ToolLayout, {
      title: "URL Encoder", description: "Encode URLs", toolbar: h(Button, null, "Encode"),
      children: h(ToolGrid, {
        children: [
          h(ToolPanel, { key: "in", title: "Input", htmlFor: "in", children: h(Textarea, { id: "in", value: "", readOnly: true }) }),
          h(ToolPanel, { key: "out", title: "Output", children: "result" }),
        ],
      }),
    })
  )
  assert.equal((out.match(/<h1/g) ?? []).length, 1)
  assert.match(out, /role="toolbar"/)
  assert.match(out, /<label for="in"[^>]*>Input<\/label>/)
  assert.match(out, /<h2[^>]*>Output<\/h2>/)
  assert.match(out, /aria-live="polite"/)
})

test("token colour pairs meet WCAG 2.2 AA contrast in both themes", () => {
  const css = readFileSync("app/globals.css", "utf8")
  const parse = (block: string) =>
    Object.fromEntries([...block.matchAll(/--([a-z-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2]]))
  const themes = {
    light: parse(css.slice(css.indexOf(":root {"), css.indexOf(".dark {"))),
    dark: parse(css.slice(css.indexOf(".dark {"), css.indexOf("@theme inline"))),
  }
  const lum = (hex: string) => {
    const [r, g, b] = [1, 3, 5]
      .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const ratio = (a: string, b: string) => {
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
    return (hi + 0.05) / (lo + 0.05)
  }
  // 4.5:1 for text, 3:1 for focus indicators and form-control borders (WCAG 1.4.3 / 1.4.11)
  const pairs: [string, string, number][] = [
    ["foreground", "background", 4.5], ["foreground", "card", 4.5], ["foreground", "surface", 4.5],
    ["muted", "background", 4.5], ["muted", "card", 4.5], ["muted", "surface", 4.5],
    ["primary-foreground", "primary", 4.5], ["primary-foreground", "primary-hover", 4.5],
    ["primary", "card", 4.5], ["primary", "background", 4.5],
    ["success", "success-bg", 4.5], ["warning", "warning-bg", 4.5], ["danger", "danger-bg", 4.5], ["info", "info-bg", 4.5],
    ["ring", "background", 3], ["ring", "card", 3], ["input", "card", 3], ["input", "background", 3],
  ]
  for (const [name, t] of Object.entries(themes)) {
    for (const [fg, bg, min] of pairs) {
      const r = ratio(t[fg], t[bg])
      assert.ok(r >= min, `${name}: --${fg} on --${bg} is ${r.toFixed(2)}:1 (needs ${min}:1)`)
    }
  }
})

test("every token used by the components is defined for light and dark themes", () => {
  const css = readFileSync("app/globals.css", "utf8")
  const light = css.slice(css.indexOf(":root {"), css.indexOf(".dark {"))
  const dark = css.slice(css.indexOf(".dark {"), css.indexOf("@theme inline"))
  for (const token of ["background", "foreground", "card", "surface", "border", "input", "muted", "primary", "primary-hover",
    "primary-foreground", "ring", "success", "warning", "danger", "info", "danger-bg", "danger-border"]) {
    assert.match(light, new RegExp(`--${token}:`), `light --${token}`)
    assert.match(dark, new RegExp(`--${token}:`), `dark --${token}`)
    assert.match(css, new RegExp(`--color-${token}: var\\(--${token}\\)`), `@theme --color-${token}`)
  }
  assert.match(css, /@custom-variant dark \(&:where\(\.dark, \.dark \*\)\)/)
})
