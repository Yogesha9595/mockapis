import { test } from "node:test"
import assert from "node:assert/strict"
import { minifyXml, minifyXmlText } from "@/lib/tools/xmlMinify"

const min = (xml: string) => {
  const r = minifyXmlText(xml)
  assert.ok(r.ok, r.ok ? "" : r.error)
  return r.output
}

test("removes comments and whitespace between elements; keeps declaration", () => {
  assert.equal(
    min(`<?xml version="1.0" encoding="UTF-8"?>\n<!-- catalog -->\n<catalog>\n  <book id="1">\n    <title>XML Basics</title>\n    <price currency="USD">29.99</price>\n  </book>\n  <empty   />\n</catalog>\n`),
    '<?xml version="1.0" encoding="UTF-8"?><catalog><book id="1"><title>XML Basics</title><price currency="USD">29.99</price></book><empty/></catalog>'
  )
})

test("text with data is kept exactly, including its spaces", () => {
  assert.equal(min("<a><name>  Alice  Smith </name></a>"), "<a><name>  Alice  Smith </name></a>")
  assert.equal(min("<p>Hello <b>World</b>!</p>"), "<p>Hello <b>World</b>!</p>")
})

test("xml:space=preserve, CDATA, entities, namespaces and attribute values are untouched", () => {
  assert.equal(min('<r>\n  <code xml:space="preserve">\n  keep  <!-- me -->\n  </code>\n  <x/>\n</r>'), '<r><code xml:space="preserve">\n  keep  <!-- me -->\n  </code><x/></r>')
  assert.equal(min("<r>\n  <![CDATA[ <not> a tag  ]]>\n</r>"), "<r><![CDATA[ <not> a tag  ]]></r>")
  assert.equal(min("<r a = 'x  y'  b=\"1 = 2\">&lt;&amp;&#169;&#xA9;</r>"), "<r a='x  y' b=\"1 = 2\">&lt;&amp;&#169;&#xA9;</r>")
  assert.equal(min('<ns:root xmlns:ns="urn:x">\n <ns:item/>\n</ns:root>'), '<ns:root xmlns:ns="urn:x"><ns:item/></ns:root>')
  assert.equal(min('<!DOCTYPE note [\n<!ENTITY w "Writer">\n]>\n<note>&w;</note>'), '<!DOCTYPE note [\n<!ENTITY w "Writer">\n]><note>&w;</note>')
})

test("minifying is idempotent", () => {
  const once = min("<a>\n <b> x </b>\n <c/>\n</a>")
  assert.equal(min(once), once)
})

test("well-formedness errors point to the problem", () => {
  const cases: [string, RegExp][] = [
    ["<a>\n  <b>text</c>\n</a>", /Closing tag <\/c> does not match <b> opened on line 2 \(line 2\)/],
    ["<a>\n  <b>", /<b> opened on line 2 is never closed/],
    ["<a/>\n<b/>", /only have one root element; <b> is a second one \(line 2\)/],
    ["<a>x</a>\ntrailing", /Text is only allowed inside the root element \(line 2\)/],
    ["<a>Tom & Jerry</a>", /"&" must be written as &amp;/],
    ['<a x="1" x="2"/>', /Attribute "x" appears twice in <a>/],
    ['<a title="a=b" title2="c=d"/>', null as unknown as RegExp], // no false duplicate from values
    ["<a>1 < 2</a>", /"<" must start a tag/],
    ["<a>\n<!-- open", /Unclosed comment \(line 2\)/],
    ["<!-- only a comment -->", /No root element found/],
    [" ", /Enter some XML first/],
  ]
  for (const [xml, re] of cases) {
    const r = minifyXmlText(xml)
    if (re === null) {
      assert.equal(r.ok, true, xml)
      continue
    }
    assert.equal(r.ok, false, xml)
    if (!r.ok) assert.match(r.error, re, xml)
  }
})

test("tool result reports size savings", () => {
  const r = minifyXml("<a>\n  <b>1</b>\n</a>\n")
  assert.ok(r.ok)
  if (r.ok) {
    assert.equal(r.output, "<a><b>1</b></a>")
    assert.equal(r.note, "Minified from 20 to 15 bytes (25% smaller).")
  }
})
