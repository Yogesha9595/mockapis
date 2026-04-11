"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

/* 🔐 HASH FUNCTION */
async function hashText(text: string, algo: string) {
  const buffer = new TextEncoder().encode(text)
  const hash = await crypto.subtle.digest(algo, buffer)
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
}

export default function ClientTool() {
  const searchParams = useSearchParams()

  const [tool, setTool] = useState<"url" | "base64" | "hash">("url")
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [copied, setCopied] = useState(false)
  const [auto, setAuto] = useState(true)
  const [error, setError] = useState("")
  const [fileName, setFileName] = useState("")
  const [encoding, setEncoding] = useState("utf-8")
  const [hashType, setHashType] = useState("SHA-256")

  /* INIT FROM URL */
  useEffect(() => {
    const val = searchParams.get("input")
    const t = searchParams.get("tool")
    if (val) setInput(decodeURIComponent(val))
    if (t === "url" || t === "base64" || t === "hash") setTool(t)
  }, [])

  /* CONVERT */
  const convert = async () => {
    try {
      if (!input) return setOutput("")

      let result = ""

      if (tool === "url") {
        const res = await fetch("/api/encode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: input,
            mode,
            encoding
          }),
        })

        const data = await res.json()
        result = data.result
      }

      if (tool === "base64") {
        result =
          mode === "encode"
            ? btoa(input)
            : atob(input)
      }

      if (tool === "hash") {
        result = await hashText(input, hashType)
      }

      setOutput(result)
      setError("")
    } catch {
      setError("Invalid input")
      setOutput("")
    }
  }

  /* AUTO */
  useEffect(() => {
    if (auto) convert()
  }, [input, mode, tool])

  /* COPY */
  const copy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  /* SHARE */
  const share = async () => {
    const url = `${window.location.origin}/tools/url-encoder-decoder?tool=${tool}&input=${encodeURIComponent(input)}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
  }

  /* CLEAR */
  const clear = () => {
    setInput("")
    setOutput("")
    setFileName("")
    setError("")
  }

  /* FILE */
  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      setInput(reader.result as string)
      setFileName(file.name)
    }
    reader.readAsText(file)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

      <section className="max-w-6xl mx-auto px-4 py-12 text-center">

        <h1 className="text-4xl font-bold">
          Ultimate Encoder & Decoder Tool
        </h1>

        <p className="text-gray-600 mt-3">
          URL, Base64 & Hash tools in one powerful developer utility.
        </p>

        <div className="mt-8 bg-white border rounded-2xl p-8 shadow-xl">

          {/* TOOL SWITCH */}
          <div className="flex justify-center gap-2 mb-6">
            {["url", "base64", "hash"].map((t) => (
              <button
                key={t}
                onClick={() => setTool(t as any)}
                className={`px-4 py-2 rounded-lg transition ${
                  tool === t
                    ? "bg-black text-white"
                    : "border text-gray-600"
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          {/* MODE */}
          {tool !== "hash" && (
            <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
              <button
                onClick={() => setMode("encode")}
                className={`flex-1 py-2 ${
                  mode === "encode"
                    ? "bg-blue-600 text-white rounded-lg"
                    : ""
                }`}
              >
                Encode
              </button>
              <button
                onClick={() => setMode("decode")}
                className={`flex-1 py-2 ${
                  mode === "decode"
                    ? "bg-green-600 text-white rounded-lg"
                    : ""
                }`}
              >
                Decode
              </button>
            </div>
          )}

          {/* OPTIONS */}
          {tool === "url" && (
            <select
              value={encoding}
              onChange={(e) => setEncoding(e.target.value)}
              className="mb-4 border p-2 rounded w-full"
            >
              <option value="utf-8">UTF-8</option>
              <option value="ascii">ASCII</option>
              <option value="latin1">ISO-8859-1</option>
            </select>
          )}

          {tool === "hash" && (
            <select
              value={hashType}
              onChange={(e) => setHashType(e.target.value)}
              className="mb-4 border p-2 rounded w-full"
            >
              <option value="SHA-256">SHA-256</option>
              <option value="SHA-1">SHA-1</option>
            </select>
          )}

          {/* INPUT */}
          <textarea
            rows={5}
            className="w-full border rounded-xl p-4 mb-4"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text..."
          />

          {/* ACTIONS */}
          <div className="flex justify-center gap-3 mb-6 flex-wrap">
            <button
              onClick={convert}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Convert
            </button>

            <button
              onClick={copy}
              className={`px-6 py-2 rounded-lg ${
                copied ? "bg-green-600 text-white" : "border"
              }`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>

            <button
              onClick={share}
              className="border px-6 py-2 rounded-lg"
            >
              Share
            </button>

            <button
              onClick={clear}
              className="border px-6 py-2 rounded-lg"
            >
              Clear
            </button>
          </div>

          {/* FILE */}
          <div
            className="border-dashed border-2 p-6 rounded-xl cursor-pointer hover:bg-gray-50"
            onClick={() => document.getElementById("file")?.click()}
          >
            Upload File
            <input
              id="file"
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0])
              }}
            />
            {fileName && (
              <p className="text-green-600 mt-2">{fileName}</p>
            )}
          </div>

          {/* ERROR */}
          {error && <p className="text-red-500 mt-3">{error}</p>}

          {/* OUTPUT */}
          <textarea
            rows={5}
            className="w-full border rounded-xl p-4 mt-4 bg-gray-50"
            value={output}
            readOnly
          />

        </div>
      </section>
      {/* ✅ MID AD */}
      <div className="max-w-5xl mx-auto px-4 mb-12">
        <div className="bg-gray-200 text-center py-6 rounded-lg text-sm shadow">
          Mid Page Ad
        </div>
      </div>
      {/* 🔥 PREMIUM SEO BLOG CONTENT */}
<section className="max-w-3xl mx-auto px-4 space-y-8 text-gray-700 mt-16">

  <h2 className="text-3xl font-bold">
    URL Encoder and Decoder Tool – Complete Developer Guide
  </h2>

  <p>
    URL encoding and decoding are fundamental concepts in web development that ensure data is transmitted safely across the internet.
    Whenever data is passed through a URL, it must follow strict formatting rules. Characters like spaces, symbols, and special characters
    can break URLs if not handled correctly. This is where encoding comes into play.
  </p>

  <p>
    A URL encoder converts unsafe characters into a safe, percent-encoded format, while a decoder restores the original readable text.
    Whether you're working with APIs, query strings, or dynamic web applications, understanding encoding is critical.
  </p>

  {/* WHAT IS ENCODING */}
  <h2 className="text-2xl font-semibold">What is URL Encoding?</h2>
  <p>
    URL encoding (also known as percent encoding) converts characters into a format that can be safely transmitted over the internet.
    It replaces unsafe characters with a percent sign (%) followed by their ASCII hexadecimal value.
  </p>

  <div className="bg-gray-100 p-4 rounded-lg">
    <code>hello world → hello%20world</code>
  </div>

  <p>
    For example, a space character is encoded as %20, ensuring that the URL remains valid across browsers and servers.
  </p>

  {/* DECODING */}
  <h2 className="text-2xl font-semibold">What is URL Decoding?</h2>
  <p>
    URL decoding is the reverse process of encoding. It converts encoded strings back into their original human-readable form.
    This is particularly useful when analyzing API responses or debugging URLs.
  </p>

  <div className="bg-gray-100 p-4 rounded-lg">
    <code>hello%20world → hello world</code>
  </div>

  {/* DIFFERENCE */}
  <h2 className="text-2xl font-semibold">Difference Between Encoding and Decoding</h2>

  <div className="overflow-x-auto">
    <table className="w-full border text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="border p-2">Feature</th>
          <th className="border p-2">Encoding</th>
          <th className="border p-2">Decoding</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border p-2">Purpose</td>
          <td className="border p-2">Convert to safe format</td>
          <td className="border p-2">Restore original text</td>
        </tr>
        <tr>
          <td className="border p-2">Usage</td>
          <td className="border p-2">Sending data</td>
          <td className="border p-2">Reading data</td>
        </tr>
      </tbody>
    </table>
  </div>

  {/* IMPORTANCE */}
  <h2 className="text-2xl font-semibold">Why URL Encoding is Important</h2>

  <ul className="list-disc pl-5 space-y-1">
    <li>Prevents broken URLs</li>
    <li>Ensures compatibility across browsers</li>
    <li>Required for APIs and query parameters</li>
    <li>Improves data integrity</li>
  </ul>

  <p>
    Without encoding, URLs containing special characters may behave unpredictably or fail entirely.
  </p>

  {/* HOW IT WORKS */}
  <h2 className="text-2xl font-semibold">How URL Encoding Works</h2>

  <p>
    URL encoding replaces characters with their hexadecimal ASCII values. Each encoded value begins with a percent symbol (%).
  </p>

  <div className="bg-gray-100 p-4 rounded-lg">
    <code>& → %26 | = → %3D | @ → %40</code>
  </div>

  {/* JS */}
  <h2 className="text-2xl font-semibold">URL Encoding in JavaScript</h2>

  <div className="bg-gray-100 p-4 rounded-lg">
    <code>encodeURIComponent("hello world")</code>
  </div>

  <div className="bg-gray-100 p-4 rounded-lg">
    <code>decodeURIComponent("hello%20world")</code>
  </div>

  {/* USE CASES */}
  <h2 className="text-2xl font-semibold">Real-World Use Cases</h2>

  <ul className="list-disc pl-5">
    <li>API request handling</li>
    <li>Query string building</li>
    <li>Form submissions</li>
    <li>Tracking URLs</li>
    <li>Search engine parameters</li>
  </ul>

  {/* BASE64 */}
  <h2 className="text-2xl font-semibold">URL Encoding vs Base64 Encoding</h2>

  <p>
    While URL encoding ensures safe transmission, Base64 encoding converts binary data into text format. Both serve different purposes in development.
  </p>

  {/* BEST PRACTICES */}
  <h2 className="text-2xl font-semibold">Best Practices</h2>

  <ul className="list-disc pl-5">
    <li>Always encode user input</li>
    <li>Avoid double encoding</li>
    <li>Use built-in functions</li>
    <li>Validate URLs before sending</li>
  </ul>

  {/* INTERNAL LINKS */}
  <h2 className="text-2xl font-semibold">Explore More Developer Tools</h2>

  <ul className="list-disc pl-5 text-blue-600">
    <li><Link href="/tools/json-formatter">JSON Formatter Tool</Link></li>
    <li><Link href="/tools/base64-encoder-decoder">Base64 Encoder Decoder</Link></li>
  </ul>

  {/* CONCLUSION */}
  <h2 className="text-2xl font-semibold">Conclusion</h2>

  <p>
    URL encoding and decoding are essential skills for modern developers. Whether you're working with APIs, debugging URLs,
    or building applications, mastering encoding ensures accuracy and efficiency. With tools like this, developers can save time,
    avoid errors, and improve workflow productivity.
  </p>

</section>
{/* 🔥 FAQ SECTION */}
<section className="max-w-3xl mx-auto px-4 mt-12">
  <h2 className="text-2xl font-bold mb-6 text-gray-900">
    Frequently Asked Questions
  </h2>

  <div className="space-y-4">

    {/* FAQ 1 */}
    <details className="border rounded-lg p-4 group">
      <summary className="cursor-pointer font-medium text-gray-800 flex justify-between items-center">
        What is URL encoding?
        <span className="group-open:rotate-180 transition">⌄</span>
      </summary>
      <p className="mt-3 text-gray-600">
        URL encoding converts special characters into a safe format that can be transmitted over the internet. Characters like spaces, symbols, and non-ASCII text are replaced with percent-encoded values. This ensures compatibility across browsers, APIs, and servers.
      </p>
    </details>

    {/* FAQ 2 */}
    <details className="border rounded-lg p-4 group">
      <summary className="cursor-pointer font-medium text-gray-800 flex justify-between items-center">
        What is the difference between encoding and decoding?
        <span className="group-open:rotate-180 transition">⌄</span>
      </summary>
      <p className="mt-3 text-gray-600">
        Encoding transforms readable data into a safe or structured format, while decoding reverses it back to the original form. For example, a space becomes %20 when encoded, and decoding converts it back to a space.
      </p>
    </details>

    {/* FAQ 3 */}
    <details className="border rounded-lg p-4 group">
      <summary className="cursor-pointer font-medium text-gray-800 flex justify-between items-center">
        Is URL encoding the same as encryption?
        <span className="group-open:rotate-180 transition">⌄</span>
      </summary>
      <p className="mt-3 text-gray-600">
        No, URL encoding is not encryption. Encoding is reversible and used for formatting data safely, while encryption secures data using keys. If you need data security, consider hashing or encryption instead of encoding.
      </p>
    </details>

    {/* FAQ 4 */}
    <details className="border rounded-lg p-4 group">
      <summary className="cursor-pointer font-medium text-gray-800 flex justify-between items-center">
        When should I use URL encoding?
        <span className="group-open:rotate-180 transition">⌄</span>
      </summary>
      <p className="mt-3 text-gray-600">
        You should use URL encoding when working with query parameters, APIs, or form data. It prevents errors caused by special characters and ensures proper data transmission in HTTP requests.
      </p>
    </details>

    {/* FAQ 5 */}
    <details className="border rounded-lg p-4 group">
      <summary className="cursor-pointer font-medium text-gray-800 flex justify-between items-center">
        Can I encode JSON or API data using this tool?
        <span className="group-open:rotate-180 transition">⌄</span>
      </summary>
      <p className="mt-3 text-gray-600">
        Yes, you can encode JSON or API payloads before sending them via URLs. For better readability, you can also use our{" "}
        <Link href="/tools/json-formatter" className="text-blue-600 underline">
          JSON Formatter Tool
        </Link>{" "}
        to format your data before encoding.
      </p>
    </details>

    {/* FAQ 6 */}
    <details className="border rounded-lg p-4 group">
      <summary className="cursor-pointer font-medium text-gray-800 flex justify-between items-center">
        What are common URL encoded characters?
        <span className="group-open:rotate-180 transition">⌄</span>
      </summary>
      <p className="mt-3 text-gray-600">
        Some common encoded characters include space (%20), ampersand (%26), equals sign (%3D), and slash (%2F). These ensure URLs remain valid and do not break when transmitted.
      </p>
    </details>

    {/* FAQ 7 */}
    <details className="border rounded-lg p-4 group">
      <summary className="cursor-pointer font-medium text-gray-800 flex justify-between items-center">
        What other tools can help with encoding or debugging?
        <span className="group-open:rotate-180 transition">⌄</span>
      </summary>
      <p className="mt-3 text-gray-600">
        You can use tools like{" "}
        <Link href="/tools/base64-encoder-decoder" className="text-blue-600 underline">
          Base64 Encoder Decoder
        </Link>{" "}
        for binary data or encoding images, and JSON tools for API debugging workflows.
      </p>
    </details>

  </div>
</section>
    </main>
  )
}