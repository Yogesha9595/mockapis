/**
 * Per-tool page content (usage, formats, limitations, FAQ), written for each
 * tool individually. A tool page uses the shared ToolPage template only when
 * it has an entry here; tools without one still use the old generic page.
 *
 * Rules for content:
 *  - Describe what the tool actually does (see lib/tools/*). No claims that
 *    are not implemented or tested.
 *  - Limitations must be stated, not hidden.
 *  - FAQ only for questions people genuinely ask about this tool.
 */

export type ToolFaq = { question: string; answer: string }

export type ToolPageContent = {
  /** Meta description (falls back to the registry description) */
  metaDescription?: string
  /** One or two sentences under the H1 */
  intro: string
  /** Ordered usage steps */
  howTo: string[]
  /** What input is accepted and what output is produced */
  formats: string[]
  /** Honest limits of the implementation */
  limitations: string[]
  /** Optional FAQ (rendered visibly; FAQPage structured data only mirrors it) */
  faq?: ToolFaq[]
  /** Related tool slugs to prefer (working tools only are shown) */
  related?: string[]
}

export const toolPages: Record<string, ToolPageContent> = {
  "json-formatter": {
    metaDescription:
      "Format and beautify JSON online with 2-space indentation, minify it, or validate it with exact line and column errors. Free, and your JSON never leaves your browser.",
    intro:
      "Paste JSON to indent it for reading, minify it for transport, or check it for syntax errors. Errors point to the exact line and column.",
    howTo: [
      "Paste or type JSON into the input, upload a .json file, or press Load example.",
      "Press Format (or Ctrl+Enter) to indent the JSON with 2 spaces.",
      "Use Minify to remove all whitespace, or Validate to check the JSON without changing it.",
      "Copy or download the result from the output panel.",
    ],
    formats: [
      "Input: standard JSON (RFC 8259): objects, arrays, strings, numbers, true, false and null. Any Unicode text, including emoji.",
      "Output: JSON indented with 2 spaces (Format) or with all insignificant whitespace removed (Minify). Key order is preserved.",
      "Files: .json or plain-text files up to 5 MB.",
    ],
    limitations: [
      "Strict JSON only: comments, trailing commas, single-quoted strings and unquoted keys (JSON5/JSONC) are reported as errors.",
      "Numbers beyond JavaScript's safe integer range (above 9007199254740991) lose precision when formatted, e.g. 9007199254740993 becomes 9007199254740992. Keep such IDs as strings.",
      "If an object repeats a key, only the last value is kept in the output.",
      "Everything runs in your browser; very large documents (tens of MB) may be slow.",
    ],
    faq: [
      {
        question: "Why do I get “Unexpected token” or “Expected property name”?",
        answer:
          "The input is not valid JSON at the reported line and column. The most common causes are a trailing comma after the last item, single quotes instead of double quotes, unquoted keys, or comments, none of which JSON allows.",
      },
      {
        question: "Does formatting change my data?",
        answer:
          "Formatting only changes whitespace, with two exceptions listed under limitations: integers larger than 9007199254740991 lose precision, and duplicate keys keep only the last value.",
      },
      {
        question: "Is my JSON uploaded anywhere?",
        answer:
          "No. Parsing and formatting happen in your browser with JavaScript's built-in JSON parser; nothing you paste is sent to a server.",
      },
      {
        question: "What is the difference between Format and Minify?",
        answer:
          "Format adds line breaks and 2-space indentation so humans can read the structure. Minify removes every unnecessary space and line break, producing the smallest equivalent JSON for sending over a network.",
      },
    ],
    related: ["json-validator", "json-minify", "json-viewer", "base64-encoder", "jwt-decoder", "url-encoder"],
  },
}

export function getToolPage(slug: string): ToolPageContent | undefined {
  return toolPages[slug]
}
