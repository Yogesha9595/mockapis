import { test } from "node:test"
import assert from "node:assert/strict"
import { encodeBase64, base64EncodeTool, base64DecodeTool } from "@/lib/tools/base64"

const samples: Record<string, string> = {
  english: "Hello, World!",
  hindi: "नमस्ते दुनिया",
  marathi: "महाराष्ट्र माझा",
  latin1: "café naïve über",
  cjk: "你好，世界 こんにちは 안녕하세요",
  emoji: "Ship it 🚀🔥 👩🏽‍💻 🇮🇳",
  multiline: "line one\nline two\r\n\tindented\n",
  empty: "",
}

test("matches standard UTF-8 Base64 (same as `base64` CLI / Buffer)", () => {
  for (const [name, text] of Object.entries(samples)) {
    assert.equal(encodeBase64(text), Buffer.from(text, "utf8").toString("base64"), name)
  }
})

test("known vectors", () => {
  assert.equal(encodeBase64("café"), "Y2Fmw6k=")
  assert.equal(encodeBase64("😀"), "8J+YgA==")
  assert.equal(encodeBase64("नमस्ते"), "4KSo4KSu4KS44KWN4KSk4KWH")
})

test("round trip: text → encode → decode → same text", () => {
  for (const [name, text] of Object.entries(samples)) {
    const encoded = base64EncodeTool(text)
    assert.ok(encoded.ok, name)
    const decoded = base64DecodeTool(encoded.output)
    assert.deepEqual(decoded, { ok: true, output: text }, name)
  }
})

test("large input (1 MB) round-trips without stack overflow", () => {
  const big = "अ😀x".repeat(250_000)
  const enc = base64EncodeTool(big)
  assert.ok(enc.ok)
  assert.deepEqual(base64DecodeTool(enc.output), { ok: true, output: big })
})

test("decode accepts whitespace, line wraps, missing padding and URL-safe alphabet", () => {
  const text = "Ship it 🚀 ok?"
  const std = Buffer.from(text).toString("base64")
  const urlSafe = Buffer.from(text).toString("base64url") // no padding, -_
  assert.deepEqual(base64DecodeTool(std.replace(/(.{4})/g, "$1\n")), { ok: true, output: text })
  assert.deepEqual(base64DecodeTool(std.replace(/=+$/, "")), { ok: true, output: text })
  assert.deepEqual(base64DecodeTool(urlSafe), { ok: true, output: text })
  assert.deepEqual(base64DecodeTool("  \n "), { ok: true, output: "" })
})

test("decode rejects invalid Base64 with a helpful message", () => {
  for (const bad of ["abc$", "Zm9v!", "a", "==abc", "Zm9v=Zm9v", "日本"]) {
    const r = base64DecodeTool(bad)
    assert.equal(r.ok, false, bad)
    if (!r.ok) assert.match(r.error, /not valid Base64/)
  }
})

test("decode reports binary (non-UTF-8) data instead of returning garbage", () => {
  const binary = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]).toString("base64")
  const r = base64DecodeTool(binary)
  assert.equal(r.ok, false)
  if (!r.ok) assert.match(r.error, /not UTF-8 text/)
})
