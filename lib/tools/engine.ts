import { base64DecodeTool, base64EncodeTool } from "./base64"
import { formatJson, minifyJson, validateJson } from "./json"
import { decodeJwt } from "./jwt"
import { countWords, sortLines } from "./text"
import { convertTimestamp } from "./timestamp"
import { urlDecode, urlEncode } from "./url"
import { generateUuids } from "./uuid"
import type { ToolResult } from "./types"

export type EditorLanguage = "json" | "plaintext" | "html" | "css" | "xml" | "yaml"

export type ToolAction = {
  label: string
  run: (input: string) => ToolResult
}

/**
 * Everything the generic tool page needs to render a tool's working area.
 * Only tools with a definition get action buttons; registry entries without
 * one are shown as "not available yet" instead of a fake button.
 */
export type ToolDefinition = {
  /** Primary action (first button) */
  primary: ToolAction
  /** Additional actions that make sense for this tool only */
  extra?: ToolAction[]
  inputLabel: string
  outputLabel: string
  inputLanguage: EditorLanguage
  outputLanguage: EditorLanguage
  inputPlaceholder: string
  /** Sample input loaded by the "Load example" button */
  sample: string
  /** File types accepted by "Upload file"; omitted = no upload button */
  accept?: string
}

const jsonBase = {
  inputLabel: "JSON input",
  outputLabel: "Result",
  inputLanguage: "json",
  outputLanguage: "json",
  inputPlaceholder: '{"name": "DevUtilities Lab", "tools": ["json", "base64"]}',
  sample: '{"name":"DevUtilities Lab","version":1,"tags":["json","formatter"],"active":true,"owner":{"id":42,"team":"tools"}}',
  accept: ".json,application/json,text/plain",
} as const

const format: ToolAction = { label: "Format", run: (i) => formatJson(i) }
const minify: ToolAction = { label: "Minify", run: minifyJson }
const validate: ToolAction = { label: "Validate", run: validateJson }

const textInput = { inputLanguage: "plaintext", outputLanguage: "plaintext", accept: ".txt,text/plain" } as const

export const toolDefinitions: Record<string, ToolDefinition> = {
  /* ---------------- JSON ---------------- */
  "json-formatter": { ...jsonBase, primary: format, extra: [minify, validate], outputLabel: "Formatted JSON" },
  "json-pretty": { ...jsonBase, primary: format, extra: [minify], outputLabel: "Pretty-printed JSON" },
  "json-viewer": { ...jsonBase, primary: { label: "View", run: (i) => formatJson(i) }, outputLabel: "Formatted view" },
  "json-minify": { ...jsonBase, primary: minify, extra: [format], outputLabel: "Minified JSON" },
  "json-validator": { ...jsonBase, primary: validate, extra: [format], outputLabel: "Validation result", outputLanguage: "plaintext" },

  /* ---------------- ENCODING ---------------- */
  "base64-encoder": {
    ...textInput,
    primary: { label: "Encode", run: base64EncodeTool },
    extra: [{ label: "Decode", run: base64DecodeTool }],
    inputLabel: "Text to encode",
    outputLabel: "Base64",
    inputPlaceholder: "Type or paste text (any language or emoji)",
    sample: "Hello, World! नमस्ते 🚀",
  },
  "base64-decoder": {
    ...textInput,
    primary: { label: "Decode", run: base64DecodeTool },
    extra: [{ label: "Encode", run: base64EncodeTool }],
    inputLabel: "Base64 to decode",
    outputLabel: "Decoded text",
    inputPlaceholder: "Paste Base64 (standard or URL-safe)",
    sample: "SGVsbG8sIFdvcmxkISDgpKjgpK7gpLjgpY3gpKTgpYcg8J+agA==",
  },
  "url-encoder": {
    ...textInput,
    primary: { label: "Encode", run: (i) => urlEncode(i, "component") },
    extra: [{ label: "Decode", run: (i) => urlDecode(i, "component") }],
    inputLabel: "Text to encode",
    outputLabel: "Percent-encoded",
    inputPlaceholder: "e.g. name=José & co/2024",
    sample: "search query=café & co/2024?",
  },
  "url-decoder": {
    ...textInput,
    primary: { label: "Decode", run: (i) => urlDecode(i, "component") },
    extra: [{ label: "Encode", run: (i) => urlEncode(i, "component") }],
    inputLabel: "Percent-encoded text",
    outputLabel: "Decoded text",
    inputPlaceholder: "e.g. caf%C3%A9%20%26%20co",
    sample: "search%20query%3Dcaf%C3%A9%20%26%20co%2F2024%3F",
  },

  /* ---------------- DEVELOPER ---------------- */
  "uuid-generator": {
    primary: { label: "Generate", run: generateUuids },
    inputLabel: "How many UUIDs? (1–1000, empty = 1)",
    outputLabel: "UUID v4",
    inputLanguage: "plaintext",
    outputLanguage: "plaintext",
    inputPlaceholder: "1",
    sample: "5",
  },
  "jwt-decoder": {
    ...textInput,
    primary: { label: "Decode", run: (i) => decodeJwt(i) },
    inputLabel: "JWT",
    outputLabel: "Decoded header & payload",
    outputLanguage: "json",
    inputPlaceholder: "eyJhbGciOi...",
    sample:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDAwMDM2MDB9.signature",
  },
  "timestamp-converter": {
    ...textInput,
    primary: { label: "Convert", run: (i) => convertTimestamp(i) },
    inputLabel: "Unix timestamp or date",
    outputLabel: "Converted",
    inputPlaceholder: "1700000000 or 2024-01-31T12:00:00Z",
    sample: "1700000000",
  },

  /* ---------------- TEXT ---------------- */
  "text-sort": {
    ...textInput,
    primary: { label: "Sort A → Z", run: (i) => sortLines(i, "asc") },
    extra: [{ label: "Sort Z → A", run: (i) => sortLines(i, "desc") }],
    inputLabel: "Lines to sort",
    outputLabel: "Sorted lines",
    inputPlaceholder: "One item per line",
    sample: "banana\nApple\nitem10\ncherry\nitem2",
  },
  "word-counter": {
    ...textInput,
    primary: { label: "Count", run: countWords },
    inputLabel: "Text",
    outputLabel: "Statistics",
    inputPlaceholder: "Paste or type text",
    sample: "DevUtilities Lab provides free developer tools. Everything runs in your browser!\n\nNo sign-up needed.",
  },
}

export function getToolDefinition(slug: string): ToolDefinition | undefined {
  return toolDefinitions[slug]
}
