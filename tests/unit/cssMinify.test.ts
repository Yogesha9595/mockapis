import { test } from "node:test"
import assert from "node:assert/strict"
import { minifyCss, minifyCssText } from "@/lib/tools/cssMinify"

const min = (css: string) => {
  const r = minifyCssText(css)
  assert.ok(r.ok, r.ok ? "" : r.error)
  return r.output
}

test("basic rules: whitespace, comments and last semicolon removed", () => {
  assert.equal(
    min(`/* header */\n.card , .panel  >  h2 {\n  color : red ;\n  margin: 0 auto ;\n}\n`),
    ".card,.panel>h2{color:red;margin:0 auto}"
  )
})

test("selector meaning is preserved", () => {
  assert.equal(min("a :hover { x: 1 }"), "a :hover{x:1}") // descendant + pseudo ≠ a:hover
  assert.equal(min("a:hover , a:focus-visible { x: 1 }"), "a:hover,a:focus-visible{x:1}")
  assert.equal(min("li:nth-child( 2n + 1 ) { x: 1 }"), "li:nth-child(2n + 1){x:1}") // + inside parens kept
  assert.equal(min("h1 ~ p + ul > li { x: 1 }"), "h1~p+ul>li{x:1}")
  assert.equal(min('a[title="a , b"] { x: 1 }'), 'a[title="a , b"]{x:1}') // string untouched
  assert.equal(min(".a\\{b { x: 1 }"), ".a\\{b{x:1}") // escaped brace in class name
})

test("strings, url(), calc() and license comments are preserved", () => {
  assert.equal(min('p::before { content: "  /* not a comment */  " }'), 'p::before{content:"  /* not a comment */  "}')
  assert.equal(min(".bg { background: url( img/a b.png ) no-repeat }"), ".bg{background:url(img/a b.png) no-repeat}")
  assert.equal(min('.bg { background: url( "x;y}.png" ) }'), '.bg{background:url("x;y}.png")}')
  assert.equal(min(".w { width: calc( 100% - (2 * 1rem) ) }"), ".w{width:calc(100% - (2 * 1rem))}")
  assert.equal(min("/*! MIT License */\na{x:1}"), "/*! MIT License */a{x:1}")
  assert.equal(min("a { color: red ! important }"), "a{color:red!important}")
  assert.equal(min('.g { grid-template-areas: "a b"\n  "c d" }'), '.g{grid-template-areas:"a b" "c d"}')
})

test("at-rules, nesting and custom properties", () => {
  assert.equal(
    min("@media screen and (min-width: 600px) , print {\n  .a { x : 1 }\n}"),
    "@media screen and (min-width: 600px),print{.a{x:1}}"
  )
  assert.equal(min('@import url("a.css") screen;\n@charset "utf-8";'), '@import url("a.css") screen;@charset "utf-8";')
  assert.equal(min(":root { --gap :  1rem  2rem ; --empty: ; --list: a , b }"), ":root{--gap:1rem 2rem;--empty:;--list:a , b}")
  assert.equal(min(".card { color: red; &:hover { color: blue } }"), ".card{color:red;&:hover{color:blue}}")
  assert.equal(min("@font-face { font-family: 'My Font'; src: url(a.woff2) format('woff2') }"), "@font-face{font-family:'My Font';src:url(a.woff2) format('woff2')}")
})

test("comments between tokens do not merge them", () => {
  assert.equal(min("a { border: 1px/* x */solid red }"), "a{border:1px solid red}")
})

test("minifying is idempotent", () => {
  const once = min("a , b { color : red ; } @media (x) { c { d : e } }")
  assert.equal(min(once), once)
})

test("errors point to the problem", () => {
  const cases: [string, RegExp][] = [
    ["a { color: red;", /Missing "}": the block opened on line 1/],
    ["a { x: 1 } }", /Unexpected "}" on line 1/],
    ["a {\n content: 'oops\n}", /Unclosed string starting on line 2/],
    ["a { x: 1 }\n/* never ends", /Unclosed comment starting on line 2/],
    ["a { width: calc(1px + 2px }", /Missing "\)"/],
    ["   ", /Enter some CSS first/],
  ]
  for (const [css, re] of cases) {
    const r = minifyCssText(css)
    assert.equal(r.ok, false, css)
    if (!r.ok) assert.match(r.error, re, css)
  }
})

test("tool result reports size savings", () => {
  const r = minifyCss("a {\n  color: red;\n}\n")
  assert.ok(r.ok)
  if (r.ok) assert.equal(r.note, "Minified from 20 to 12 bytes (40% smaller).")
})
