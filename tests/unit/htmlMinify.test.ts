import { test } from "node:test"
import assert from "node:assert/strict"
import { minifyHtml, minifyHtmlText } from "@/lib/tools/htmlMinify"

const min = (html: string) => {
  const r = minifyHtmlText(html)
  assert.ok(r.ok, r.ok ? "" : r.error)
  return r.output
}

test("removes comments and whitespace between block elements", () => {
  assert.equal(
    min(`<!DOCTYPE html>\n<html>\n  <head>\n    <!-- meta -->\n    <title>  My   Page </title>\n  </head>\n  <body>\n    <div>\n      <p>\n        Hello   world\n      </p>\n    </div>\n  </body>\n</html>\n`),
    "<!DOCTYPE html><html><head><title>My Page</title></head><body><div><p>Hello world</p></div></body></html>"
  )
})

test("keeps a single space between inline elements and inside text", () => {
  assert.equal(min("<p>Hi <b>bold</b>   <i>italic</i>\n<a href=\"#\">link</a>.</p>"), '<p>Hi <b>bold</b> <i>italic</i> <a href="#">link</a>.</p>')
  assert.equal(min("<p>a <!-- c --> b</p>"), "<p>a b</p>")
  assert.equal(min("<p>a<!-- c -->b</p>"), "<p>ab</p>")
  assert.equal(min("<label>Name <input name=n> </label>"), "<label>Name <input name=n> </label>")
})

test("preserves pre, textarea and script content exactly", () => {
  const pre = "<pre>\n  line 1\n    indented  <b>x</b>  y\n</pre>"
  assert.equal(min(`<div>\n${pre}\n</div>`), `<div>${pre}</div>`)
  assert.equal(min("<textarea>\n  keep   this\n</textarea>"), "<textarea>\n  keep   this\n</textarea>")
  const script = '<script>\n  if (a < b && c > d) { console.log("  x  </p>") }\n</script>'
  assert.equal(min(script), script)
})

test("attribute values, entities and SVG case are untouched; tag spacing tidied", () => {
  assert.equal(min('<a   href = "x y.html"  title="a = b"   data-x=\'1  2\' >t</a>'), '<a href="x y.html" title="a = b" data-x=\'1  2\'>t</a>')
  assert.equal(min('<br />\n<img src="a.png" alt=""  />'), '<br/><img src="a.png" alt=""/>')
  assert.equal(min("<p>&nbsp; &lt;tag&gt; &amp;</p>"), "<p>&nbsp; &lt;tag&gt; &amp;</p>")
  assert.equal(min('<svg viewBox="0 0 1 1"> <linearGradient id="g"/> </svg>'), '<svg viewBox="0 0 1 1"> <linearGradient id="g"/> </svg>')
  assert.equal(min("<p>1 < 2 and 3 > 2</p>"), "<p>1 < 2 and 3 > 2</p>")
})

test("style blocks are CSS-minified; conditional comments kept", () => {
  assert.equal(min("<style>\n  a { color : red ; }\n</style>"), "<style>a{color:red}</style>")
  assert.equal(min("<style>a { color: red</style>"), "<style>a { color: red</style>") // invalid CSS left as-is
  assert.equal(min("<!--[if IE]><p>old</p><![endif]-->"), "<!--[if IE]><p>old</p><![endif]-->")
})

test("minifying is idempotent", () => {
  const once = min("<ul>\n <li> a </li>\n <li><b>b</b> c</li>\n</ul>\n<pre> x </pre>")
  assert.equal(min(once), once)
})

test("errors point to the problem", () => {
  const cases: [string, RegExp][] = [
    ["<p>ok</p>\n<!-- never closed", /Unclosed comment "<!--" on line 2/],
    ['<p>\n<a href="x>link</a>', /Unclosed tag <a> on line 2 \(an attribute value's quote is never closed\)/],
    ["<script>alert(1)", /<script> on line 1 is never closed with <\/script>/],
    ["  ", /Enter some HTML first/],
  ]
  for (const [html, re] of cases) {
    const r = minifyHtmlText(html)
    assert.equal(r.ok, false, html)
    if (!r.ok) assert.match(r.error, re, html)
  }
})

test("tool result reports size savings", () => {
  const r = minifyHtml("<div>\n  <p> hi </p>\n</div>\n")
  assert.ok(r.ok)
  if (r.ok) {
    assert.equal(r.output, "<div><p>hi</p></div>")
    assert.equal(r.note, "Minified from 27 to 20 bytes (26% smaller).")
  }
})
