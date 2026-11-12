import { test } from "node:test"
import assert from "node:assert/strict"
import { validateSchemaInput, extractJsonLdBlocks } from "@/lib/tools/schemaValidator"

type Report = Exclude<ReturnType<typeof validateSchemaInput>, { error: string }>
const report = (input: string, mode: "json" | "html" = "json"): Report => {
  const r = validateSchemaInput(input, mode)
  assert.ok(!("error" in r), "error" in r ? r.error : "")
  return r as Report
}

test("valid Product with offers passes", () => {
  const r = report(JSON.stringify({
    "@context": "https://schema.org", "@type": "Product", name: "Mouse", image: "x.png", description: "d", brand: "B", sku: "1",
    offers: { "@type": "Offer", price: "29.99", priceCurrency: "USD", availability: "https://schema.org/InStock", url: "https://e.com" },
  }))
  assert.equal(r.valid, true)
  assert.equal(r.score, 100)
})

test("missing required properties (including nested entities) are reported", () => {
  const r = report(JSON.stringify({ "@context": "https://schema.org", "@type": "Product", offers: { "@type": "Offer", price: "1" } }))
  assert.equal(r.valid, false)
  const errors = r.results[0].missing.join("\n")
  assert.match(errors, /required property "name" is missing \(Product\)/)
  assert.match(errors, /Product\.offers: required property "priceCurrency" is missing \(Offer\)/)
})

test("Product needs offers, review or aggregateRating", () => {
  const r = report(JSON.stringify({ "@context": "https://schema.org", "@type": "Product", name: "X" }))
  assert.match(r.results[0].missing.join(), /needs at least one of "offers", "review", "aggregateRating"/)
})

test("missing @context and @type are errors", () => {
  const r = report(JSON.stringify({ name: "x" }))
  const errors = r.results[0].missing.join("\n")
  assert.match(errors, /missing @context/)
  assert.match(errors, /missing @type/)
})

test("FAQPage checks nested questions and answers", () => {
  const r = report(JSON.stringify({
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: [{ "@type": "Question", name: "Q1", acceptedAnswer: { "@type": "Answer", text: "A1" } }, { "@type": "Question", name: "Q2", acceptedAnswer: { "@type": "Answer" } }],
  }))
  assert.equal(r.valid, false)
  assert.deepEqual(r.results[0].missing, ['FAQPage.mainEntity[1].acceptedAnswer: required property "text" is missing (Answer)'])
})

test("@graph entities inherit @context", () => {
  const r = report(JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [{ "@type": "WebSite", name: "S", url: "https://e.com" }, { "@type": "Organization", name: "O", url: "https://e.com", logo: "l.png" }],
  }))
  assert.equal(r.count, 2)
  assert.equal(r.valid, true)
})

test("invalid JSON is reported, not thrown", () => {
  const r = report('{"@type": "Product",}')
  assert.equal(r.valid, false)
  assert.match(r.results[0].missing[0], /JSON syntax error/)
})

test("unknown types are checked honestly", () => {
  const r = report(JSON.stringify({ "@context": "https://schema.org", "@type": "Dataset", name: "d" }))
  assert.equal(r.valid, true)
  assert.match(r.results[0].suggestions.join(), /no type-specific checks are available for Dataset/)
})

test("HTML mode extracts every JSON-LD block", () => {
  const html = `<html><head>
    <script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"A"}</script>
    <script type='application/ld+json'>{"@context":"https://schema.org","@type":"Event"}</script>
    <script type="text/javascript">var x = 1</script></head></html>`
  assert.equal(extractJsonLdBlocks(html).length, 2)
  const r = report(html, "html")
  assert.equal(r.count, 2)
  assert.equal(r.results[0].valid, true)
  assert.equal(r.results[1].valid, false)
  assert.equal("error" in validateSchemaInput("<html>no schema</html>", "html"), true)
})
