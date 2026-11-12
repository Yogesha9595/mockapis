import { test } from "node:test"
import assert from "node:assert/strict"
import { urlEncode, urlDecode, type UrlMode } from "@/lib/tools/url"

const samples = [
  "hello world",
  "a&b=c/d?e#f",
  "café naïve",
  "नमस्ते दुनिया",
  "🚀 emoji 👩🏽‍💻",
  "100% sure + more",
  "line1\nline2\ttab",
  "already%20encoded",
  "punct: a*b!c'(d)~e-f_g.h",
  "",
]

test("component mode matches standard percent-encoding", () => {
  assert.deepEqual(urlEncode("a b&c=é/ü"), { ok: true, output: "a%20b%26c%3D%C3%A9%2F%C3%BC" })
  assert.deepEqual(urlEncode("😀"), { ok: true, output: "%F0%9F%98%80" })
  // It is percent-encoding, not hex encoding
  assert.notEqual((urlEncode("A") as { output: string }).output, "41")
})

test("full URL mode keeps structure characters", () => {
  const url = "https://example.com/search path?q=café & co#top"
  assert.deepEqual(urlEncode(url, "full"), {
    ok: true,
    output: "https://example.com/search%20path?q=caf%C3%A9%20&%20co#top",
  })
})

test("form mode uses + for spaces and matches URLSearchParams", () => {
  for (const s of samples) {
    const expected = new URLSearchParams({ q: s }).toString().slice(2)
    assert.deepEqual(urlEncode(s, "form"), { ok: true, output: expected }, s)
  }
  assert.deepEqual(urlDecode("a+b%2Bc", "form"), { ok: true, output: "a b+c" })
})

test("round trip in every mode", () => {
  for (const mode of ["component", "full", "form"] as UrlMode[]) {
    for (const s of samples) {
      const enc = urlEncode(s, mode)
      assert.ok(enc.ok, `${mode}: ${s}`)
      assert.deepEqual(urlDecode(enc.output, mode), { ok: true, output: s }, `${mode}: ${s}`)
    }
  }
})

test("encoding already-encoded text encodes the % (no silent double-decode)", () => {
  assert.deepEqual(urlEncode("a%20b"), { ok: true, output: "a%2520b" })
})

test("query string decoding", () => {
  assert.deepEqual(urlDecode("q=hello%20world&lang=%E0%A4%B9%E0%A4%BF"), {
    ok: true,
    output: "q=hello world&lang=हि",
  })
})

test("malformed input gives a precise error", () => {
  const badEscape = urlDecode("abc%2Gdef")
  assert.equal(badEscape.ok, false)
  if (!badEscape.ok) assert.match(badEscape.error, /Malformed escape "%2G" at position 4/)

  const trailing = urlDecode("100%")
  assert.equal(trailing.ok, false)

  const badUtf8 = urlDecode("%E0%A4")
  assert.equal(badUtf8.ok, false)
  if (!badUtf8.ok) assert.match(badUtf8.error, /valid UTF-8/)
})

test("unpaired surrogate is reported instead of throwing", () => {
  const r = urlEncode("bad \uD800 char")
  assert.equal(r.ok, false)
})
