/**
 * Per-tool page content for /tools/<slug>. Every live tool needs an entry here:
 * without one it gets no page (see app/tools/[slug]/page.tsx).
 *
 * Rules for content (enforced in tests/unit/toolPages.test.ts):
 *  - Describe what the tool actually does (see lib/tools/*). No claims that
 *    are not implemented or tested. Unsure facts are marked TODO.
 *  - Every example output and every error with `verifyWith` is checked against
 *    the real engine, so the page can never show output the tool doesn't produce.
 *  - No sentence may appear on more than one tool page.
 *  - Limitations must be stated, not hidden.
 */

export type ToolFaq = { question: string; answer: string }

export type ToolExample = {
  title: string
  /** One or two sentences explaining what the example shows */
  note: string
  input: string
  /** Exact output (or error message when `error` is true) of the action */
  output: string
  /** Label of the action used, when it is not the primary one */
  action?: string
  /** The output is the tool's error message */
  error?: boolean
  /**
   * The output can't be identical for every reader: "uuid" = random,
   * "local-time" = the Local time line depends on the viewer's time zone.
   * Tests then check the shape (uuid) or every other line (local-time).
   */
  variable?: "uuid" | "local-time"
}

export type ToolError = {
  /** The exact message the tool shows, or a short description of the symptom */
  message: string
  cause: string
  fix: string
  /** Input that makes the primary action fail with exactly `message` (checked by tests) */
  verifyWith?: string
}

export type ToolPageContent = {
  /** <title> (the site name is appended by the root layout) */
  title: string
  /** Visible H1 */
  h1: string
  metaDescription: string
  /** One-line summary under the H1 */
  intro: string
  /** Ordered usage steps (3 to 5) */
  howTo: string[]
  /** What input is accepted and what output is produced */
  formats: string[]
  /** Honest limits of the implementation */
  limitations: string[]
  /** Exactly 2 worked examples */
  examples: ToolExample[]
  errors: ToolError[]
  /** Exactly 4 questions; FAQPage structured data mirrors them */
  faq: ToolFaq[]
  /** Related tool slugs to prefer (working tools only are shown) */
  related?: string[]
  /** Send GA4 `tool_used` events (slug + action only, never input) — see lib/analytics.ts */
  trackUsage?: boolean
}

export const toolPages: Record<string, ToolPageContent> = {
  /* ======================================================================
     JSON
     ====================================================================== */

  "json-formatter": {
    title: "JSON Formatter – Beautify and Indent JSON",
    h1: "JSON Formatter",
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
      "Escapes and number spellings are normalized on output: \\u00fc is written as ü, \\/ as /, and 1.50 as 1.5.",
      "The error messages quoted on this page are the wording of Chrome and Edge; Firefox and Safari phrase the same problem differently, but the line and column are always included.",
    ],
    examples: [
      {
        title: "Indenting a compact API response",
        note: "Each nested object and array gets its own indentation level, which makes it obvious that count belongs to stock and not to the top-level object.",
        input: '{"id":7,"tags":["new","sale"],"stock":{"warehouse":"B2","count":0}}',
        output: '{\n  "id": 7,\n  "tags": [\n    "new",\n    "sale"\n  ],\n  "stock": {\n    "warehouse": "B2",\n    "count": 0\n  }\n}',
      },
      {
        title: "Escaped characters come out readable",
        note: "Unicode escapes are written as the characters they stand for, and the optional escape \\/ becomes a plain slash. The parsed values are identical before and after.",
        input: '{"city":"Z\\u00fcrich","emoji":"\\u2705","path":"a\\/b"}',
        output: '{\n  "city": "Zürich",\n  "emoji": "✅",\n  "path": "a/b"\n}',
      },
    ],
    errors: [
      {
        message: "Invalid JSON: Expected double-quoted property name in JSON at position 15 (line 1 column 16)",
        cause: 'A trailing comma after the last property, as in {"name": "Ada",}, makes the parser expect another key.',
        fix: "Delete the comma before the closing brace or bracket.",
        verifyWith: '{"name": "Ada",}',
      },
      {
        message: "Invalid JSON: Expected property name or '}' in JSON at position 1 (line 1 column 2)",
        cause: "Keys or strings are wrapped in single quotes, which is how Python dictionaries and JavaScript object literals are often printed.",
        fix: "Replace every single quote around keys and strings with a double quote; in Python, json.dumps() produces valid JSON directly.",
        verifyWith: "{'name': 'Ada'}",
      },
      {
        message: "Invalid JSON: Bad control character in string literal in JSON at position 15 (line 1 column 16)",
        cause: "A real line break or tab sits inside a string value, which often happens when multi-line text is pasted into JSON by hand.",
        fix: "Write the line break as \\n and a tab as \\t inside the quotes.",
        verifyWith: '{"note":"line 1\nline 2"}',
      },
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
          "The values stay the same, but their spelling can change: whitespace is replaced, numbers are written in their shortest form and escapes become real characters. Two cases do change values, as listed under limitations: integers larger than 9007199254740991 lose precision, and duplicate keys keep only the last value.",
      },
      {
        question: "Is my JSON uploaded anywhere?",
        answer:
          "Parsing and formatting happen in your browser with JavaScript's built-in JSON parser, and nothing you paste is sent to a server.",
      },
      {
        question: "What is the difference between Format and Minify?",
        answer:
          "Format adds line breaks and 2-space indentation so humans can read the structure. Minify removes every unnecessary space and line break, producing the smallest equivalent JSON for sending over a network.",
      },
    ],
    related: ["json-validator", "json-minify", "base64-encoder", "jwt-decoder", "url-encoder"],
    trackUsage: true, // first tool reporting GA4 tool_used events
  },

  "json-validator": {
    title: "JSON Validator – Find Errors by Line and Column",
    h1: "JSON Validator",
    metaDescription:
      "Check whether JSON is valid and find the exact line and column of the first syntax error. Valid input gets a summary of its top-level value. Runs entirely in your browser.",
    intro:
      "Paste JSON to find out whether it parses and, if it does not, exactly where it breaks.",
    howTo: [
      "Paste the JSON you want to check, upload a .json file, or press Load example to try a known-good document.",
      "Press Validate (or Ctrl+Enter); this button never modifies the input.",
      "If an error appears, go to the line and column it names, fix the character there and validate again, because only the first error is reported.",
      "Once the document is valid, press Format to see it indented and confirm the structure is what you expected.",
    ],
    formats: [
      "Checks against strict JSON as defined in RFC 8259 and ECMA-404, the same grammar that JSON.parse and most API servers use.",
      "A valid result names the top-level value, for example an object with 3 keys or an array with 12 items.",
      "Any top-level value counts as valid, including a bare string, number, true, false or null.",
      "Uploads: .json or text files of at most 5 MB.",
    ],
    limitations: [
      "Only the first syntax error is reported, so a document with several mistakes needs several rounds.",
      "This is a syntax check, not JSON Schema validation: required fields, types and allowed values are not checked.",
      "Duplicate keys pass without a warning, because JSON.parse accepts them and silently keeps the last value.",
      "Error wording comes from your browser's parser, so Firefox and Safari describe a mistake in other words than the Chrome wording shown in the examples.",
    ],
    examples: [
      {
        title: "A valid array of order lines",
        note: "The summary counts only the top level, so the two objects inside the array are reported as 2 items however many keys each one has.",
        input: '[{"sku":"A1","qty":2},{"sku":"B4","qty":1}]',
        output: "✓ Valid JSON — an array with 2 items.",
      },
      {
        title: "A missing comma between properties",
        note: 'The error points to line 4, column 3, where the parser met "host" while still expecting a comma or a closing brace after true on the line above.',
        input: '{\n  "port": 8080,\n  "debug": true\n  "host": "localhost"\n}',
        output: "Invalid JSON: Expected ',' or '}' after property value in JSON at position 36 (line 4 column 3)",
        error: true,
      },
    ],
    errors: [
      {
        message: "Invalid JSON: Unexpected non-whitespace character after JSON at position 15 (line 1 column 16)",
        cause: "Something follows the end of a complete JSON value, here a // comment after the closing brace.",
        fix: "Remove comments and trailing text; JSON has no comment syntax, so notes have to live in a separate field or file.",
        verifyWith: '{"retries": 3} // max',
      },
      {
        message: "Invalid JSON: Bad escaped character in JSON at position 13 (line 1 column 14)",
        cause: "A lone backslash inside a string, as in a Windows path like C:\\Users\\ada written with single backslashes.",
        fix: "Double every backslash (C:\\\\Users\\\\ada) or use forward slashes, which Windows accepts in most places.",
        verifyWith: '{"path": "C:\\Users\\ada"}',
      },
      {
        message: "Enter some JSON first.",
        cause: "The input is empty or contains only spaces and line breaks.",
        fix: "Paste or upload the document again; an empty file loads as an empty input.",
        verifyWith: "   ",
      },
    ],
    faq: [
      {
        question: "Is a single string or number valid JSON?",
        answer:
          'Yes, under RFC 8259 any JSON value can stand alone, so "hello", 42 and null are all valid documents. Some older parsers required an object or array at the top, which is why you may see this disputed.',
      },
      {
        question: "Does this validate against a JSON Schema?",
        answer:
          "It does not. The check stops at syntax; to test that fields exist or have the right types you need a JSON Schema validator and a schema for your data.",
      },
      {
        question: "Why does the error point after the real mistake?",
        answer:
          "The parser reports the first character it cannot accept, which can come later than the actual cause. A missing comma at the end of line 3 is reported at the start of line 4, so check the line before the reported position too.",
      },
      {
        question: "Why is my JSON valid here but rejected by my application?",
        answer:
          "Applications often add rules on top of JSON: a required root object, a maximum size, specific fields, or integer IDs larger than JavaScript can hold. Valid syntax is necessary but not always sufficient for a particular API.",
      },
    ],
    related: ["json-formatter", "json-minify", "xml-minify", "jwt-decoder"],
  },

  "json-minify": {
    title: "JSON Minifier – Remove Whitespace from JSON",
    h1: "JSON Minifier",
    metaDescription:
      "Minify JSON to a single line by removing indentation and line breaks. Keeps key order, reports invalid JSON with line and column, and runs in your browser.",
    intro: "Collapse formatted JSON into one compact line for payloads, environment variables or test fixtures.",
    howTo: [
      "Paste indented JSON, upload a .json file, or press Load example.",
      "Press Minify (or Ctrl+Enter) to strip every space and line break that sits outside a string.",
      "Copy the single-line result, or download it as a .json file.",
      "Press Format if you need the readable version back; minifying loses layout, not structure.",
    ],
    formats: [
      "Input: any valid JSON text, however it is indented.",
      "Output: one line with no spaces between tokens, while spaces inside string values are kept.",
      "Keys and array items stay in the order they appear in the input.",
      "Upload limit: 5 MB per JSON or plain-text file.",
    ],
    limitations: [
      "The input is parsed and serialized again, so numbers are rewritten in JavaScript's shortest form, for example 1e3 becomes 1000.",
      "Integers larger than 9007199254740991 are rounded, as the 20-digit number in the second example shows.",
      "JSON Lines (NDJSON) files with one object per line are not supported as a whole; minify each line separately.",
      "Minifying is not compression: for transfer, gzip or Brotli on the server saves far more than removing whitespace.",
    ],
    examples: [
      {
        title: "Turning a config file into one line",
        note: "The 8-line document becomes a single line that can go into an environment variable or a curl command without worrying about line breaks.",
        input: '{\n  "name": "web",\n  "replicas": 3,\n  "ports": [80, 443],\n  "env": {\n    "LOG_LEVEL": "info"\n  }\n}',
        output: '{"name":"web","replicas":3,"ports":[80,443],"env":{"LOG_LEVEL":"info"}}',
      },
      {
        title: "How number formatting changes",
        note: "1.50 and 1e3 keep their values but are written differently, while the 20-digit integer is rounded because it exceeds the largest integer JavaScript stores exactly. Quote such numbers if every digit matters.",
        input: '{ "price": 1.50, "ratio": 1e3, "big": 12345678901234567890 }',
        output: '{"price":1.5,"ratio":1000,"big":12345678901234567000}',
      },
    ],
    errors: [
      {
        message: "Invalid JSON: Unexpected non-whitespace character after JSON at position 8 (line 2 column 1)",
        cause: "The input holds several JSON documents, one per line, as in a JSON Lines or log file.",
        fix: "Minify one line at a time, or wrap the objects in [ ] with commas between them to make a single array.",
        verifyWith: '{"a":1}\n{"a":2}',
      },
      {
        message: "Invalid JSON: Unexpected token ']' (line 1 column 10)",
        cause: "A comma right before the closing bracket of an array.",
        fix: "Remove the last comma, since JSON allows commas only between items.",
        verifyWith: "[1, 2, 3,]",
      },
      {
        message: "Invalid JSON: Unexpected token 'N' (line 1 column 11)",
        cause: "NaN, Infinity and undefined are JavaScript values with no JSON equivalent, and they appear when an object is printed rather than serialized.",
        fix: "Replace them with null or a string, or produce the JSON with JSON.stringify(), which writes null for NaN and Infinity.",
        verifyWith: '{"ratio": NaN}',
      },
    ],
    faq: [
      {
        question: "How much smaller does minified JSON get?",
        answer:
          "Savings depend entirely on the indentation that was there. Tab- or 4-space-indented files with deep nesting shrink the most, while JSON that was already compact barely changes.",
      },
      {
        question: "Is minified JSON still valid JSON?",
        answer:
          "Yes, whitespace between tokens is optional in JSON, so the one-line output parses to the same structure in any language.",
      },
      {
        question: "Can I minify JSON that contains comments?",
        answer:
          "Comments are not part of JSON, so input containing // or /* */ is reported as invalid instead of being stripped. Remove the comments first, or have the tool that wrote them export plain JSON.",
      },
      {
        question: "Should I minify JSON before sending it from my API?",
        answer:
          "Most frameworks already serialize without indentation, and HTTP compression removes most of the remaining redundancy. Minifying matters more for JSON stored where size is limited, such as cookies or URL parameters.",
      },
    ],
    related: ["json-formatter", "json-validator", "css-minify", "html-minify"],
  },

  /* ======================================================================
     ENCODING
     ====================================================================== */

  "base64-encoder": {
    title: "Base64 Encoder – UTF-8 Text and Emoji to Base64",
    h1: "Base64 Encoder",
    metaDescription:
      "Encode text to standard Base64 using UTF-8, so accented letters, Hindi and emoji work. Output is padded and unwrapped. Free, and the text stays in your browser.",
    intro: "Type or paste text to get its Base64 form, with every character converted to UTF-8 bytes first.",
    howTo: [
      "Type or paste the text, upload a .txt file, or press Load example to try a sentence in mixed scripts.",
      "Press Encode (or Ctrl+Enter); the result is one unbroken line, ending in = or == padding where needed.",
      "Copy the Base64 or download it, for example to paste into a config file, a data URI or an Authorization header.",
      "To reverse the process, paste Base64 into the input and press Decode.",
    ],
    formats: [
      "Input: any text, converted to UTF-8 bytes before encoding, which matches the base64 command on Linux and macOS for UTF-8 files.",
      "Output: the standard Base64 alphabet from RFC 4648 (A–Z, a–z, 0–9, + and /) with = padding and no line breaks.",
      "Uploaded files are read as text, up to 5 MB.",
    ],
    limitations: [
      "Binary files such as images or PDFs cannot be encoded correctly, because uploads are read as text and invalid byte sequences are replaced.",
      "There is no URL-safe output option; to make one, replace + with -, / with _ and drop the trailing = signs.",
      "Line breaks in the input are encoded too, including a final newline that is easy to miss.",
      "Output is never wrapped at 76 characters, so systems that require MIME line lengths need the breaks added separately.",
    ],
    examples: [
      {
        title: "Credentials for an HTTP Basic Authorization header",
        note: "Basic authentication sends Base64 of username:password, so the header becomes Authorization: Basic dXNlcjpwQHNz. The encoding only avoids special characters; it hides nothing.",
        input: "user:p@ss",
        output: "dXNlcjpwQHNz",
      },
      {
        title: "Accented letters and an emoji",
        note: "The 12 characters become 17 UTF-8 bytes, because ï and é take 2 bytes each and the tea emoji takes 4, and 17 bytes need 24 Base64 characters.",
        input: "naïve café 🍵",
        output: "bmHDr3ZlIGNhZsOpIPCfjbU=",
      },
    ],
    errors: [
      {
        message: "The result differs from another tool's in the last few characters",
        cause: "The input ends with a line break that the other tool did not include: Hello encodes to SGVsbG8= but Hello followed by a newline encodes to SGVsbG8K. Shell commands such as echo add that newline.",
        fix: "Delete the trailing line break here, or use echo -n or printf on the command line so both sides encode the same bytes.",
      },
      {
        message: "Accented letters show up as Ã© in the program that decodes the Base64",
        cause: "This tool encodes UTF-8, and the receiving program interprets the bytes as Latin-1 or Windows-1252.",
        fix: "Tell the receiving program to decode the bytes as UTF-8, because the Base64 itself is correct.",
      },
      {
        message: "An uploaded image or PDF gives Base64 that does not open",
        cause: "Files are read as text, so bytes that are not valid UTF-8 are replaced before encoding and the original file cannot be rebuilt.",
        fix: "For anything that is not plain text, use a tool that reads raw bytes, such as the base64 command on Linux and macOS.",
      },
    ],
    faq: [
      {
        question: "Why is the Base64 longer than my text?",
        answer:
          "Every 3 bytes of input become 4 output characters, so Base64 is about a third larger than the UTF-8 bytes it encodes. Non-Latin scripts grow more relative to their character count, because each of their characters already takes 2 to 4 bytes.",
      },
      {
        question: "Is it safe to put passwords or API keys in Base64?",
        answer:
          "Only if they are protected some other way, such as HTTPS. Base64 is a reversible format, not a cipher, and anyone who sees the string can recover the secret instantly.",
      },
      {
        question: "Which Base64 variant does this produce?",
        answer:
          "Standard Base64 from RFC 4648, section 4, with padding. URL-safe Base64 (section 5) and MIME line wrapping are not produced, but the Base64 Decoder on this site reads both alphabets.",
      },
      {
        question: "Does the text I encode leave my computer?",
        answer:
          "It stays in this browser tab. The conversion uses the browser's built-in TextEncoder and btoa functions, and the page makes no network request with your input.",
      },
    ],
    related: ["base64-decoder", "url-encoder", "jwt-decoder", "json-formatter"],
  },

  "base64-decoder": {
    title: "Base64 Decoder – Standard and URL-Safe to Text",
    h1: "Base64 Decoder",
    metaDescription:
      "Decode Base64 back to readable UTF-8 text in your browser. Accepts standard and URL-safe alphabets, missing padding and line breaks, and tells you when the data is binary rather than text.",
    intro: "Paste a Base64 string to recover the text it encodes, including accented letters, Hindi script and emoji.",
    howTo: [
      "Paste the Base64 string into the input box, upload a .txt file that contains it, or press Load example.",
      "Press Decode (or Ctrl+Enter). Spaces and line breaks inside the string are skipped, so Base64 that was wrapped across several lines can be pasted unchanged.",
      "Read the decoded text in the output panel, then copy it or save it as a .txt file.",
      "To check a round trip, put plain text in the input and press Encode, which gives standard Base64 with = padding.",
    ],
    formats: [
      "Input: the standard alphabet (A–Z, a–z, 0–9, + and /) and the URL-safe alphabet (- and _ instead of + and /), with or without = padding.",
      "Output: the decoded bytes shown as UTF-8 text.",
      "Files: plain-text files up to 5 MB, read as text.",
    ],
    limitations: [
      "Decoded bytes are always read as UTF-8. Text saved as Windows-1252 with accented letters is reported as non-text, and UTF-16 text shows up with invisible NUL characters between letters.",
      "Images, PDFs and archives can't be previewed or saved as files. Download saves only the text output.",
      "Data URIs must have everything up to and including base64, removed first.",
      "The whole string is decoded at once in your browser, so input of several megabytes may take a moment.",
    ],
    examples: [
      {
        title: "A JSON payload",
        note: 'Base64 that begins with eyJ is almost always JSON, because {" encodes to those three characters.',
        input: "eyJ1c2VyIjoiYWRhIiwicm9sZSI6ImFkbWluIn0=",
        output: '{"user":"ada","role":"admin"}',
      },
      {
        title: "URL-safe Base64 with the padding removed",
        note: "The _ stands in for /, and the two missing = characters are added back before decoding.",
        input: "R3LDvMOfZSBhdXMgS8O2bG4_IOKckw",
        output: "Grüße aus Köln? ✓",
      },
    ],
    errors: [
      {
        message:
          "This is not valid Base64. Base64 may only contain A–Z, a–z, 0–9, + and / (or - and _ for URL-safe Base64), optionally ending with = padding.",
        cause: "A character outside the alphabet, such as the @ in SGVsbG8@d29ybGQ=, text after the = padding, or a data:text/plain;base64, prefix copied from a data URI.",
        fix: "Delete the stray characters or the prefix. If the string still fails, check whether it was cut off, because a length that leaves one character over (such as A on its own) can't be valid Base64.",
        verifyWith: "SGVsbG8@d29ybGQ=",
      },
      {
        message:
          "The Base64 is valid, but the decoded 8 bytes are not UTF-8 text (it is probably binary data such as an image or archive).",
        cause: "The input decodes to binary data, not text. For example, iVBORw0KGgo= is the 8-byte signature at the start of every PNG file.",
        fix: "Decode binary files with a tool that saves raw bytes. This page only shows text.",
        verifyWith: "iVBORw0KGgo=",
      },
      {
        message: "The output is another Base64 string.",
        cause: "The data was encoded twice.",
        fix: "Copy the output into the input and press Decode again.",
      },
    ],
    faq: [
      {
        question: "Is Base64 a form of encryption?",
        answer:
          "No. Base64 has no key, so anyone with the string can reverse it in one step. Treat a Base64 secret as unprotected. Decoding on this page happens on your device, and the string is not uploaded.",
      },
      {
        question: "What is the difference between standard and URL-safe Base64?",
        answer:
          "URL-safe Base64 replaces + with - and / with _, so the string can sit in a URL or file name without escaping. It often drops the trailing = as well. This decoder accepts either form, even both mixed in one string.",
      },
      {
        question: "Why do some Base64 strings end in = or ==?",
        answer:
          "Base64 writes every 3 bytes as 4 characters. When the data doesn't divide evenly, = fills out the last group: one = means it held 2 bytes, two mean it held 1. The padding is optional here, and missing padding is added for you.",
      },
      {
        question: "Can I decode a Base64 image with this tool?",
        answer:
          "No. Image data isn't text, so you get the binary-data message with the byte count instead of output. It still confirms the Base64 is well-formed.",
      },
    ],
    related: ["base64-encoder", "jwt-decoder", "url-decoder", "json-formatter"],
  },

  "url-encoder": {
    title: "URL Encoder – Percent-Encode Text and URLs",
    h1: "URL Encoder",
    metaDescription:
      "Percent-encode a query value, a whole URL, or form data. UTF-8 aware, so é becomes %C3%A9 and emoji work. Three modes, all running in your browser.",
    intro:
      "Make text safe to put in a URL, either as a single value, as a complete address, or as HTML form data.",
    howTo: [
      "Paste the text to encode, or press Load example to try a value with spaces, an ampersand and an accent.",
      "Press Encode (or Ctrl+Enter) for a single value such as a query parameter or a path segment.",
      "Press Encode full URL instead when the input is a complete address whose : / ? & = and # must stay as they are.",
      "Press Encode form (+ for spaces) for application/x-www-form-urlencoded data, the format browsers use when submitting HTML forms.",
      "Copy the result, or press Decode to reverse a percent-encoded value in the input.",
    ],
    formats: [
      "Encode: everything except A–Z, a–z, 0–9 and - _ . ! ~ * ' ( ) is escaped, like JavaScript's encodeURIComponent.",
      "Encode full URL: additionally keeps ; , / ? : @ & = + $ and # unescaped, like encodeURI, so the URL keeps its structure.",
      "Encode form: like Encode, but spaces become + and ! ' ( ) ~ are escaped too, matching URLSearchParams.",
      "Characters are converted to UTF-8 bytes first, so é becomes %C3%A9 and 😀 becomes %F0%9F%98%80.",
    ],
    limitations: [
      "Encode full URL cannot tell which parts are already encoded and escapes every % sign, so a%20b becomes a%2520b.",
      "Non-ASCII domain names are percent-encoded rather than converted to Punycode (xn--…), so encode only the path and query of such URLs.",
      "Text containing a broken emoji (an unpaired UTF-16 surrogate) cannot be encoded and is reported as an error.",
      "The whole input box is encoded with the mode you choose; the tool does not detect which part of a URL you meant.",
    ],
    examples: [
      {
        title: "A search term as a query value",
        note: "The ampersand, slash and percent sign would otherwise be read as URL syntax; escaped as %26, %2F and %25 they stay part of the value.",
        input: "Tom & Jerry/50% off",
        output: "Tom%20%26%20Jerry%2F50%25%20off",
      },
      {
        title: "Encoding a complete URL",
        note: "The scheme, slashes, ? and & survive, while the spaces and accented letters in the search term are escaped, so the link can be pasted anywhere.",
        input: "https://example.com/search?q=crème brûlée&page=2",
        output: "https://example.com/search?q=cr%C3%A8me%20br%C3%BBl%C3%A9e&page=2",
        action: "Encode full URL",
      },
    ],
    errors: [
      {
        message: "The text contains an invalid Unicode character (an unpaired surrogate), which cannot be URL-encoded.",
        cause: "Half of an emoji or another character outside the Basic Multilingual Plane, usually left behind when text was cut at a fixed length.",
        fix: "Delete the broken character at the start or end of the text, or paste it again from the original.",
        verifyWith: "\ud83d",
      },
      {
        message: "The whole URL came out as https%3A%2F%2F…",
        cause: "Encode treats the input as one value and escapes : and / as well.",
        fix: "Use Encode full URL for complete addresses, and Encode only for the individual values you insert into one.",
      },
      {
        message: "The server receives a literal %20 or %2520",
        cause: "The value was encoded twice, once here and once by a library or framework that encodes query parameters automatically.",
        fix: "Pass the raw text to libraries such as URLSearchParams or axios params and let them encode it once.",
      },
    ],
    faq: [
      {
        question: "When should I use Encode instead of Encode full URL?",
        answer:
          "Use Encode for anything that goes inside a URL, such as one query value or one path segment, because it escapes & = / ? that would otherwise end the value early. Use Encode full URL only on an address that is already assembled.",
      },
      {
        question: "Should spaces be %20 or +?",
        answer:
          "Both mean a space in a query string submitted by a form, but only %20 is a space everywhere else in a URL. Encode writes %20, and Encode form writes + for form bodies and query strings built like HTML forms.",
      },
      {
        question: "Why is é encoded as two escapes?",
        answer:
          "URLs carry bytes, and é is two bytes in UTF-8 (C3 A9), so it becomes %C3%A9. Old systems that used Latin-1 encoded it as %E9, which modern servers usually reject or misread.",
      },
      {
        question: "Which characters never need encoding?",
        answer:
          "Letters, digits and - . _ ~ are unreserved in RFC 3986 and mean the same encoded or not. Encode also leaves ! * ' ( ) alone, as encodeURIComponent always has, although RFC 3986 reserves them.",
      },
    ],
    related: ["url-decoder", "base64-encoder", "json-minify", "jwt-decoder"],
  },

  "url-decoder": {
    title: "URL Decoder – Decode %20 and Percent-Escapes",
    h1: "URL Decoder",
    metaDescription:
      "Decode percent-encoded URLs and query strings back to readable UTF-8 text, with an option to read + as a space and clear errors for broken escapes. Nothing you paste is uploaded.",
    intro: "Paste a percent-encoded value or URL to read it as plain text, including accented letters and emoji.",
    howTo: [
      "Paste the encoded text, for example a query string copied from the address bar or a server log, or press Load example.",
      "Press Decode (or Ctrl+Enter) to turn every %XX escape back into the character it stands for.",
      "If the text came from an HTML form or uses + between words, press Decode form (+ as space) instead.",
      "If the output still contains escapes such as %20, the value was encoded twice; copy the output into the input and decode again.",
    ],
    formats: [
      "Input: any text with %XX escapes, where XX is two hexadecimal digits in upper or lower case.",
      "Escapes are read as UTF-8 bytes, so %C3%A9 becomes é and %F0%9F%9A%80 becomes 🚀.",
      "Decode leaves + unchanged, while Decode form turns each + into a space before decoding.",
      "Characters that were never encoded pass through as they are.",
    ],
    limitations: [
      "Each press decodes one level only, so double-encoded text needs two passes.",
      "Decoding a full URL can turn %26 or %3D inside a value into & or =, which changes how the query string reads.",
      "Bytes from legacy encodings, such as %E9 for é in Latin-1, are rejected because they are not valid UTF-8.",
      "Text files up to 5 MB can be loaded with Upload file.",
    ],
    examples: [
      {
        title: "A percent-encoded phrase",
        note: "%C3%A9 is the two-byte UTF-8 form of é, %20 is a space and %3F is a question mark.",
        input: "caf%C3%A9%20au%20lait%3F",
        output: "café au lait?",
      },
      {
        title: "A query string from an HTML form",
        note: "Forms send spaces as +, so the form decoder turns them back into spaces. The decoded %26 now looks like a parameter separator, which is why values are best decoded one at a time.",
        input: "q=red+shoes+%26+socks&size=42",
        output: "q=red shoes & socks&size=42",
        action: "Decode form (+ as space)",
      },
    ],
    errors: [
      {
        message:
          'Malformed escape "%" at position 4: "%" must be followed by two hexadecimal digits (for a literal percent sign, use %25).',
        cause: "A percent sign that does not start an escape, such as 100% in a campaign name.",
        fix: "Replace the bare % with %25 if the text is meant to be decoded, or leave the text alone if it was never encoded.",
        verifyWith: "100%",
      },
      {
        message:
          "The percent-encoded bytes do not form valid UTF-8 text (for example, an incomplete multi-byte sequence such as %E0%A4 without its final byte).",
        cause: "The text was cut in the middle of a multi-byte character, or it was encoded with a legacy character set like Latin-1.",
        fix: "Copy the complete value again; if it comes from an old system, convert it to UTF-8 at the source.",
        verifyWith: "%E0%A4",
      },
      {
        message: "Plus signs stay in the output",
        cause: "Decode follows RFC 3986, where + is an ordinary character, so q=red+shoes is returned unchanged.",
        fix: "Use Decode form (+ as space) for query strings and form bodies.",
      },
    ],
    faq: [
      {
        question: "Why does %2541 decode to %41 and not A?",
        answer:
          "%25 is the escape for the percent sign itself, so one pass produces %41 and a second pass turns that into A. Escapes left in the output are the typical sign of double encoding.",
      },
      {
        question: "Is + a space or a plus sign?",
        answer:
          "In a query string produced by an HTML form, + means a space and a real plus sign is sent as %2B. In paths and in values encoded with encodeURIComponent, + is a literal plus, which is why there are two decode buttons.",
      },
      {
        question: "Can I decode a whole URL at once?",
        answer:
          "For reading it, yes. For processing, split the URL into its parameters first and decode each value, because escaped & = and ? inside values look like URL syntax once decoded.",
      },
      {
        question: "Is the URL I paste sent anywhere?",
        answer:
          "Decoding uses the browser's decodeURIComponent function inside this page, so URLs containing tokens or personal data are not transmitted or stored.",
      },
    ],
    related: ["url-encoder", "base64-decoder", "jwt-decoder", "json-formatter"],
  },

  /* ======================================================================
     DEVELOPER UTILITIES
     ====================================================================== */

  "uuid-generator": {
    title: "UUID v4 Generator – Up to 1,000 at Once",
    h1: "UUID Generator",
    metaDescription:
      "Generate random version 4 UUIDs with the browser's cryptographic random generator. Create 1 to 1,000 at a time, one per line, ready to copy or download.",
    intro: "Generate random version 4 UUIDs for database keys, test data or request IDs, from one to a thousand at a time.",
    howTo: [
      "Enter how many UUIDs you need, from 1 to 1000; an empty box generates one.",
      "Press Generate (or Ctrl+Enter), and press it again whenever you want a fresh batch.",
      "Copy the list, or download it as a .txt file with one UUID per line.",
    ],
    formats: [
      "Input: a whole number from 1 to 1000, or nothing.",
      "Output: lowercase UUIDs in the 8-4-4-4-12 hexadecimal form, one per line.",
      "Every UUID is version 4 with the RFC 9562 variant (formerly RFC 4122), so the third group starts with 4 and the fourth with 8, 9, a or b.",
    ],
    limitations: [
      "Only version 4 (random) UUIDs are generated; time-ordered version 7 and name-based versions 3 and 5 are not available.",
      "Output is always lowercase and hyphenated, with no option for braces, uppercase or a urn:uuid: prefix.",
      "Version 4 UUIDs are random, so they do not sort by creation time and can fragment B-tree indexes when used as primary keys.",
      "Batches larger than 1000 have to be generated in several runs.",
    ],
    examples: [
      {
        title: "Three IDs for seed data",
        note: "Your UUIDs will be different on every run. Each line is independent, so the list can go straight into a SQL INSERT statement or a fixture file.",
        input: "3",
        output: "d6a32f48-838b-4d40-a504-386985e9980d\n25a42ca9-e2f8-480e-b32c-0a8c76c221e2\ndcc51d9f-bcdf-46c0-8b9f-428d58701651",
        variable: "uuid",
      },
      {
        title: "Asking for too many",
        note: "Counts outside 1 to 1000 are refused rather than silently capped, so you always get exactly the number you asked for.",
        input: "1001",
        output: "Enter how many UUIDs to generate: a whole number from 1 to 1000 (leave empty for 1).",
        error: true,
      },
    ],
    errors: [
      {
        message: "Enter how many UUIDs to generate: a whole number from 1 to 1000 (leave empty for 1).",
        cause: "The count is a decimal, a word, a negative number or more than 1000.",
        fix: "Type a plain whole number such as 25, without separators or units.",
        verifyWith: "2.5",
      },
      {
        message: "Pressing Generate does nothing",
        cause:
          "The browser lacks crypto.randomUUID, which arrived in Chrome 92, Firefox 95 and Safari 15.4, so older versions cannot generate UUIDs here.", // TODO: confirm minimum versions on MDN before publishing
        fix: "Update the browser, or open the page in a current version of any major browser.",
      },
    ],
    faq: [
      {
        question: "Can two generated UUIDs ever be the same?",
        answer:
          "In theory, but not in practice: a version 4 UUID has 122 random bits, so you would need to generate about 2.7 quintillion of them for a 50% chance of a single duplicate.",
      },
      {
        question: "Are these UUIDs secure enough for tokens?",
        answer:
          "They come from crypto.randomUUID, which uses the browser's cryptographically secure generator, so they are unpredictable. Still, a dedicated token with more entropy is the better choice for secrets such as password-reset links.",
      },
      {
        question: "What is the difference between a UUID and a GUID?",
        answer:
          "GUID is Microsoft's name for the same 128-bit format. Windows tools often print GUIDs in uppercase and inside braces, which is only a difference in formatting.",
      },
      {
        question: "Should I use version 4 or version 7 for database keys?",
        answer:
          "Version 7 starts with a timestamp, so new keys sort after old ones and insert into indexes more efficiently. Version 4 reveals nothing about when it was created; choose it when that matters more than index locality.",
      },
    ],
    related: ["timestamp-converter", "jwt-decoder", "base64-encoder", "json-formatter"],
  },

  "jwt-decoder": {
    title: "JWT Decoder – Read Token Header and Payload",
    h1: "JWT Decoder",
    metaDescription:
      "Decode a JSON Web Token to read its header and payload claims, with exp, iat and nbf shown as dates and an expiry check. Does not verify signatures; runs in your browser.",
    intro: "Paste a JWT to see the JSON inside its header and payload, and when it was issued and expires.",
    howTo: [
      "Paste the token, with or without the Bearer prefix copied from an Authorization header.",
      "Press Decode (or Ctrl+Enter) to see the header and payload as indented JSON.",
      "Check the dates at the end of the output: exp, iat and nbf are converted from Unix seconds to UTC, and exp is compared with your device's clock.",
      "Copy the decoded JSON when you need to compare claims between two tokens.",
    ],
    formats: [
      "Input: a compact JWS token, three Base64URL segments separated by dots.",
      "A leading Bearer prefix and surrounding whitespace are removed automatically.",
      "Output: header and payload as JSON, followed by the time claims as ISO 8601 dates in UTC.",
    ],
    limitations: [
      "The signature is never checked, so the output does not prove who issued the token or that it was not altered.",
      "Encrypted tokens (JWE, with five segments) cannot be read without the decryption key.",
      "The expired label uses this device's clock, which may differ from the server's clock.",
      "Claims other than exp, iat and nbf are shown as raw values without interpretation.",
    ],
    examples: [
      {
        title: "An expired access token",
        note: "The exp claim, 1700003600, is one hour after iat and lies in the past, so the token is marked expired and an API checking exp would refuse it.",
        input:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzg4MTIiLCJyb2xlIjoiZWRpdG9yIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDAwMDM2MDB9.c2lnbmF0dXJl",
        output:
          '// Header\n{\n  "alg": "HS256",\n  "typ": "JWT"\n}\n\n// Payload\n{\n  "sub": "user_8812",\n  "role": "editor",\n  "iat": 1700000000,\n  "exp": 1700003600\n}\n\n// Expires (exp): 2023-11-14T23:13:20.000Z  (expired)\n// Issued at (iat): 2023-11-14T22:13:20.000Z\n\n// Signature: not verified. Decoding does not prove the token is authentic.',
      },
      {
        title: "An encrypted token",
        note: "Five segments means the payload is encrypted with JWE rather than just signed, so the claims cannot be shown without the recipient's key.",
        input: "eyJhbGciOiJSU0EtT0FFUCIsImVuYyI6IkEyNTZHQ00ifQ.a.b.c.d",
        output:
          "A JWT has 3 parts separated by dots (header.payload.signature); this has 5. Five parts means an encrypted JWE, which cannot be decoded without the key.",
        error: true,
      },
    ],
    errors: [
      {
        message: "A JWT has 3 parts separated by dots (header.payload.signature); this has 2.",
        cause: "The token was cut off when copied, often at a line break in a log or terminal.",
        fix: "Copy the token again in one piece, making sure the last segment after the second dot is included.",
        verifyWith: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0",
      },
      {
        message: "The payload does not decode to JSON.",
        cause: "The middle segment is valid Base64URL but holds something other than JSON, which happens with opaque tokens that only look like JWTs.",
        fix: "Check whether your provider issues opaque access tokens; those can only be inspected through its token introspection endpoint.",
        verifyWith: "eyJhbGciOiJIUzI1NiJ9.bm90IGpzb24.sig",
      },
      {
        message: "The header is not valid Base64URL.",
        cause: "The first segment contains characters outside the Base64URL alphabet, often a quote or comma picked up from surrounding JSON or code.",
        fix: "Remove quotes and punctuation around the token, since a JWT contains only letters, digits, - and _ plus the two dots.",
        verifyWith: "abc@.eyJzdWIiOiIxIn0.sig",
      },
    ],
    faq: [
      {
        question: "Is it safe to paste a production token here?",
        answer:
          "Decoding happens inside this page and the token is not sent anywhere. Even so, a valid token is a credential, so prefer expired or test tokens and revoke any token you have shared.",
      },
      {
        question: "Why does the tool not verify the signature?",
        answer:
          "Verification needs the issuer's secret or public key, and HS256 secrets should never be pasted into a web page. Verify tokens in your backend with a JWT library and the issuer's published keys.",
      },
      {
        question: "Why are the times shown in UTC?",
        answer:
          "JWT time claims count seconds since 1970-01-01 UTC, and showing them in UTC avoids time-zone confusion. The Unix Timestamp Converter shows the same values in your local time.",
      },
      {
        question: "What does alg: none mean in the header?",
        answer:
          "It declares an unsigned token. Servers must reject such tokens unless they explicitly expect them, because anyone can create one with arbitrary claims.",
      },
    ],
    related: ["base64-decoder", "timestamp-converter", "json-formatter", "url-decoder"],
  },

  "timestamp-converter": {
    title: "Unix Timestamp Converter – Epoch to Date",
    h1: "Unix Timestamp Converter",
    metaDescription:
      "Convert Unix timestamps in seconds or milliseconds to ISO 8601, UTC and local time, or turn a date back into epoch time. Detects the unit automatically; runs in your browser.",
    intro:
      "Paste a Unix timestamp or a date to see it as ISO 8601, UTC, your local time, and epoch seconds and milliseconds.",
    howTo: [
      "Enter a Unix timestamp such as 1700000000 or a date such as 2024-01-31T12:00:00Z, or press Load example.",
      "Press Convert (or Ctrl+Enter); the first line of the result says whether the input was read as seconds, milliseconds or a date.",
      "Read the row you need: ISO 8601 for APIs and logs, Local time for your own time zone, or the Unix rows for code.",
      "Copy the whole block, or select a single line from the output.",
    ],
    formats: [
      "Numbers with up to 11 digits are read as seconds and longer numbers as milliseconds; decimals and negative values (dates before 1970) are accepted.",
      "Dates are parsed by your browser, and ISO 8601 with a Z or an offset such as +05:30 is read the same way everywhere.",
      "Output: ISO 8601 in UTC, the HTTP date format, local time in your browser's language and time zone, and Unix time in seconds and milliseconds.",
    ],
    limitations: [
      "Microsecond and nanosecond timestamps (16 or 19 digits) are read as milliseconds and give dates thousands of years ahead, so divide them by 1000 or 1000000 first.",
      "A date and time without Z or an offset is taken as local time, while a date alone, such as 2024-03-10, is taken as midnight UTC, as the JavaScript Date rules specify.",
      "Formats such as 31/12/2024 are not recognised, because the order of day and month is ambiguous.",
      "There is no time-zone picker: the Local time row always uses the time zone of the device you are on.",
    ],
    examples: [
      {
        title: "Seconds since 1970",
        note: "Ten digits are read as seconds. The Local time row shows your own time zone and language, so on your screen it will differ from this copy, which was made in UTC.",
        input: "1700000000",
        output:
          "Input:              Unix timestamp in seconds\nISO 8601 (UTC):     2023-11-14T22:13:20.000Z\nUTC:                Tue, 14 Nov 2023 22:13:20 GMT\nLocal time:         Tuesday, 14 November 2023 at 10:13:20 pm UTC\nUnix seconds:       1700000000\nUnix milliseconds:  1700000000000",
        variable: "local-time",
      },
      {
        title: "A date with a time-zone offset",
        note: "11:30 pm in India (UTC+05:30) is 18:00 UTC on the same day, and the Unix rows give the values to store or compare in code.",
        input: "2024-02-29T23:30:00+05:30",
        output:
          "Input:              Date string\nISO 8601 (UTC):     2024-02-29T18:00:00.000Z\nUTC:                Thu, 29 Feb 2024 18:00:00 GMT\nLocal time:         Thursday, 29 February 2024 at 6:00:00 pm UTC\nUnix seconds:       1709229600\nUnix milliseconds:  1709229600000",
        variable: "local-time",
      },
    ],
    errors: [
      {
        message:
          '"31/12/2024" is not a valid timestamp or date. Use digits for Unix time, or an ISO 8601 date such as 2024-01-31T12:00:00Z.',
        cause: "Dates written with slashes, or with month names in many languages, are not reliably understood by browsers.",
        fix: "Rewrite the date as year-month-day, for example 2024-12-31 or 2024-12-31T09:00:00Z.",
        verifyWith: "31/12/2024",
      },
      {
        message: "The year comes out as 55840 or similar",
        cause: "The timestamp has 16 digits because it is in microseconds, as some databases and tracing tools store it.",
        fix: "Remove the last three digits to get milliseconds, then convert again.",
      },
      {
        message: "The result is off by a few hours",
        cause: "A date without Z or an offset was read in your local time zone while you expected UTC, or the other way round.",
        fix: "Add Z for UTC, or an explicit offset such as -04:00, to the input.",
      },
    ],
    faq: [
      {
        question: "How do I know if a timestamp is in seconds or milliseconds?",
        answer:
          "Current dates have 10 digits in seconds and 13 in milliseconds. The converter makes this call for you and names the unit it used on the first line of the result.",
      },
      {
        question: "What is the Year 2038 problem?",
        answer:
          "Systems that store Unix seconds in a signed 32-bit integer overflow after 2038-01-19T03:14:07Z, the value 2147483647. This converter uses JavaScript numbers, which handle dates far beyond that.",
      },
      {
        question: "Do leap seconds affect Unix time?",
        answer:
          "Unix time ignores leap seconds and counts every day as exactly 86400 seconds. That keeps calculations simple but means Unix time is not a precise count of elapsed SI seconds.",
      },
      {
        question: "Which time zone is used for Local time?",
        answer:
          "The one your operating system or browser reports, together with its daylight saving rules. On a laptop set to India it shows IST, and the same timestamp on a computer in London shows GMT or BST.",
      },
    ],
    related: ["uuid-generator", "jwt-decoder", "json-formatter", "word-counter"],
  },

  /* ======================================================================
     TEXT
     ====================================================================== */

  "text-sort": {
    title: "Sort Lines Alphabetically – A to Z or Z to A",
    h1: "Sort Lines",
    metaDescription:
      "Sort lines of text alphabetically from A to Z or Z to A with natural number order, so item2 comes before item10. Ignores case and accents; runs in your browser.",
    intro: "Put a list in alphabetical order, one item per line, with numbers inside the text compared as numbers.",
    howTo: [
      "Paste the list with one item per line, upload a .txt file, or press Load example.",
      "Press Sort A → Z (or Ctrl+Enter) for ascending order, or Sort Z → A for descending order.",
      "Copy the sorted list, or download it as a text file.",
    ],
    formats: [
      "Input: plain text, one item per line; Windows (CRLF) and Unix (LF) line endings are both understood.",
      "Comparison follows your browser's language rules, with numbers compared by value and capitals, small letters and accents treated as equal.",
      "Output: the same lines in the new order, joined with Unix line endings.",
    ],
    limitations: [
      "Duplicate lines are kept and blank lines are sorted to the top; neither is removed.",
      "Leading spaces count, so an indented line sorts before unindented ones.",
      "Lines that differ only in case or accents, such as Apple and apple, keep their original relative order.",
      "Each line is compared as a whole from its first character; sorting by a column or field is not supported.",
    ],
    examples: [
      {
        title: "Natural number order",
        note: "item2 lands before item10 because the numbers are compared by value, and Item1 sits among the lowercase items because case is ignored.",
        input: "item10\nItem1\nbanana\nitem2\nApple",
        output: "Apple\nbanana\nItem1\nitem2\nitem10",
      },
      {
        title: "Descending order with accented letters",
        note: "Ö sorts as O and é as e, so accented words land next to their unaccented neighbours instead of after Z.",
        input: "Ölfarbe\nzebra\nAdler\némile",
        output: "zebra\nÖlfarbe\némile\nAdler",
        action: "Sort Z → A",
      },
    ],
    errors: [
      {
        message: "Empty lines appear at the top of the result",
        cause: "Blank lines, including one left by a trailing line break, are empty strings, and an empty string sorts before any text.",
        fix: "Delete blank lines before sorting, or remove them from the top of the output afterwards.",
      },
      {
        message: "The order differs from a spreadsheet or the sort command",
        cause: "Other tools may compare raw character codes, which puts all capitals before small letters and item10 before item2.",
        fix: "That difference is intentional here; use the command-line sort with LC_ALL=C if you need code-point order.",
      },
    ],
    faq: [
      {
        question: "Why does item10 come after item9?",
        answer:
          "Numeric collation reads each run of digits as a number, so 9 is compared with 10 as values rather than as the characters 9 and 1. That matches how people number files and versions.",
      },
      {
        question: "Is the sort case-sensitive?",
        answer:
          "It is not: Apple, apple and APPLE compare as equal, and equal lines keep the order they had in the input.",
      },
      {
        question: "Can it remove duplicate lines?",
        answer:
          "Not at the moment. Sorting places duplicates next to each other, which makes them easy to spot and delete by hand.",
      },
      {
        question: "Which language's alphabet is used?",
        answer:
          "The sort uses your browser's language through the Intl.Collator API, so letters such as å, ä and ö follow the conventions of that language. Swedish places them after z, while English sorts them with a and o.",
      },
    ],
    related: ["word-counter", "json-formatter", "url-decoder", "uuid-generator"],
  },

  "word-counter": {
    title: "Word Counter – Words, Characters, Sentences",
    h1: "Word Counter",
    metaDescription:
      "Count words, characters, sentences, lines and paragraphs, with an estimated reading time. Handles emoji, Hindi, Chinese and other scripts correctly. Runs in your browser.",
    intro:
      "Paste text to count its words, characters, sentences, lines and paragraphs, and see roughly how long it takes to read.",
    howTo: [
      "Paste or type the text, upload a .txt file, or press Load example.",
      "Press Count (or Ctrl+Enter) to see all seven statistics at once.",
      "Edit the text and press Count again, because the numbers do not update while you type.",
    ],
    formats: [
      "Characters are counted as you see them, so an emoji, a flag or a Hindi conjunct counts once even when it is made of several code points.",
      "Words are found with the browser's Intl.Segmenter, which also splits Chinese, Japanese and Thai text that has no spaces.",
      "Paragraphs are blocks separated by an empty line, and lines are counted at every line break.",
    ],
    limitations: [
      "Reading time assumes 200 words per minute and is rounded to whole minutes, with a minimum of one minute for any text.",
      "Abbreviations can affect the sentence count, because the browser decides where sentences end.",
      "Numbers count as words, while punctuation and emoji do not.",
      "Word boundaries come from the browser's language data, so Chrome, Firefox and Safari can disagree slightly for languages written without spaces.",
    ],
    examples: [
      {
        title: "A short English text",
        note: "The 5 counts as a word and p.m. as one more, and the full stop inside p.m. does not end a sentence, so there are 3 sentences.",
        input: "Ship it today. Tests pass!\n\nDeploy at 5 p.m.?",
        output:
          "Words:                     9\nCharacters:                45\nCharacters (no spaces):    36\nSentences:                 3\nLines:                     3\nParagraphs:                2\nReading time (~200 wpm):   1 min",
      },
      {
        title: "Mixed scripts and an emoji",
        note: "Hindi words are recognised without any setting, the rocket emoji counts as a character but not as a word, and ß is a single character.",
        input: "नमस्ते दुनिया 🚀 Grüße",
        output:
          "Words:                     3\nCharacters:                15\nCharacters (no spaces):    12\nSentences:                 1\nLines:                     1\nParagraphs:                1\nReading time (~200 wpm):   1 min",
      },
    ],
    errors: [
      {
        message: "The character count is lower than in another editor",
        cause: "Many editors count UTF-16 code units, where an emoji counts as 2 and a family emoji as up to 11, while this tool counts each visible character once.",
        fix: "Use the other tool's number for limits defined in code units, such as some database column sizes, and this one for limits people read.",
      },
      {
        message: "The reading time says 1 min for very short text",
        cause: "The estimate is rounded and never drops below one minute once there is at least one word.",
        fix: "For short copy, go by the word count instead: at 200 words per minute, 50 words take about 15 seconds.",
      },
    ],
    faq: [
      {
        question: "Does the word count match Microsoft Word or Google Docs?",
        answer:
          "For ordinary English prose it usually matches. Differences appear with hyphenated words, URLs and numbers with separators, which each program splits in its own way.",
      },
      {
        question: "Are spaces counted as characters?",
        answer:
          "The Characters row includes spaces and line breaks, and the row below it leaves out all whitespace, which is the number some submission forms ask for.",
      },
      {
        question: "How are sentences detected?",
        answer:
          "The browser's sentence segmenter looks for closing punctuation followed by a new start, and a segment only counts if it contains a letter or digit. A line made only of emoji is therefore not a sentence.",
      },
      {
        question: "Is my text stored or analysed anywhere?",
        answer:
          "The counts are computed by your browser in this tab, and the text is neither uploaded nor kept after you close the page.",
      },
    ],
    related: ["text-sort", "html-minify", "json-formatter", "url-encoder"],
  },

  /* ======================================================================
     MINIFIERS
     ====================================================================== */

  "html-minify": {
    title: "HTML Minifier – Remove Comments and Whitespace",
    h1: "HTML Minifier",
    metaDescription:
      "Minify HTML online: remove comments and extra whitespace without changing how the page renders. Keeps <pre>, <textarea> and scripts intact. Free, runs in your browser.",
    intro:
      "Shrink HTML by removing comments and unnecessary whitespace while keeping how the page renders. Code blocks, text areas and scripts are kept exactly as written.",
    howTo: [
      "Paste HTML, upload an .html file, or press Load example.",
      "Press Minify (or Ctrl+Enter). The message above the editors shows how many bytes were saved.",
      "Copy or download the minified HTML from the output panel.",
    ],
    formats: [
      "Input: full HTML documents or fragments, including inline SVG.",
      "Output: comments removed (except IE conditional comments), whitespace collapsed, spacing inside tags tidied, and CSS inside <style> minified.",
      "Kept exactly: <pre>, <textarea> and <script> content, attribute values, entities and the case of tag names (important for SVG).",
      "Files: .html or plain-text files up to 5 MB.",
    ],
    limitations: [
      "Conservative by design: attribute quotes and optional closing tags are not removed, and JavaScript inside <script> is not minified.",
      "Whitespace next to block-level elements (div, p, li, td, …) is removed because browsers don't render it there. If your CSS makes such elements inline or inline-block, for example menu items, the small gaps between them can disappear.",
      "All comments are removed, including ones some frameworks use as markers (such as Knockout's <!-- ko -->).",
      "If the CSS inside a <style> block is invalid, that block is kept unminified.",
      "Only unclosed comments, tags and script/style/textarea elements are reported; the HTML structure is not validated.",
    ],
    examples: [
      {
        title: "A navigation list with a comment",
        note: "The comment and the indentation between list items disappear, saving 40 of 123 bytes, because browsers do not render whitespace between <li> elements.",
        input:
          '<ul class="nav">\n  <!-- primary links -->\n  <li><a href="/">Home</a></li>\n  <li>\n    <a href="/blog">Blog</a>\n  </li>\n</ul>',
        output: '<ul class="nav"><li><a href="/">Home</a></li><li><a href="/blog">Blog</a></li></ul>',
      },
      {
        title: "Inline text next to a <pre> block",
        note: "Runs of spaces inside the paragraph shrink to one, exactly as a browser would display them, while the spacing inside <pre> is kept character for character.",
        input: "<p>Run   <code>npm   test</code>  first.</p>\n<pre>\n  a   b\n</pre>",
        output: "<p>Run <code>npm test</code> first.</p><pre>\n  a   b\n</pre>",
      },
    ],
    errors: [
      {
        message: 'Unclosed comment "<!--" on line 2.',
        cause: "A comment was opened and never closed with -->, often when a block was commented out temporarily.",
        fix: "Add --> where the comment should end, because a browser would hide everything after an unclosed <!-- as well.",
        verifyWith: "<div>\n<!-- TODO: remove\n<p>Hi</p>\n</div>",
      },
      {
        message: "Unclosed tag <a> on line 1 (an attribute value's quote is never closed).",
        cause: "An attribute value is missing its closing quote, so the tag swallows the text after it.",
        fix: 'Add the missing quote, in this case after /x in href="/x".',
        verifyWith: '<a href="/x>Link</a>',
      },
      {
        message: "<textarea> on line 1 is never closed with </textarea>.",
        cause: "A <textarea>, <script> or <style> element has no closing tag, so the minifier cannot tell where its protected content ends.",
        fix: "Close the element, since browsers would otherwise treat the rest of the page as its content.",
        verifyWith: '<textarea name="bio">\n  hello',
      },
    ],
    faq: [
      {
        question: "Will minifying change how my page looks?",
        answer:
          "With default styles, no: only whitespace the browser would not display is removed, and a single space is kept between inline elements such as links and bold text. The one exception is described under limitations: block elements that your CSS turns into inline-block can lose the gap between them.",
      },
      {
        question: "Is the JavaScript in my page minified too?",
        answer:
          "It is not. Script content is copied exactly, because minifying JavaScript safely requires a full JavaScript parser, so use a JavaScript minifier for scripts.",
      },
      {
        question: "Should I minify HTML if my server already uses gzip?",
        answer:
          "Compression already removes much of the repeated whitespace, so the transfer saving after gzip is smaller than the byte count shown here suggests. Minifying still helps for HTML that is stored, inlined into other files, or served without compression.",
      },
      {
        question: "Does it fix invalid HTML?",
        answer:
          "It does not repair markup: missing closing tags for ordinary elements, wrong nesting and invalid attributes pass through as they are. Only unclosed comments, tags and raw-text elements stop the minifier with an error.",
      },
    ],
    related: ["css-minify", "view-source", "xml-minify", "json-minify"],
  },

  "css-minify": {
    title: "CSS Minifier – Strip Comments and Whitespace",
    h1: "CSS Minifier",
    metaDescription:
      "Minify CSS online: remove comments and whitespace without changing what your styles do. Keeps strings, url() and /*! license */ comments. Free, and processed entirely on your device.",
    intro:
      "Remove comments and unnecessary whitespace from CSS without changing what it does. Strings, url() values and license comments are kept exactly.",
    howTo: [
      "Paste CSS, upload a .css file, or press Load example.",
      "Press Minify (or Ctrl+Enter) to get a single-line stylesheet and see the bytes saved.",
      "If there is a syntax problem, such as a missing }, the error shows the line to fix.",
      "Copy or download the minified CSS.",
    ],
    formats: [
      "Input: standard CSS, including media queries, @font-face, @import, custom properties (variables) and native CSS nesting.",
      "Output: the same rules without comments and redundant whitespace, with the last semicolon in each block removed.",
      "Kept exactly: strings, url(…) values and /*! … */ license comments.",
      "Files: .css or plain-text files up to 5 MB.",
    ],
    limitations: [
      "Whitespace and comment removal only: rules are not merged, colours are not shortened (#ffffff stays #ffffff) and values are not rewritten, so build tools such as cssnano can produce smaller output.",
      "Spaces before a colon in selectors are kept on purpose, because “a :hover” and “a:hover” mean different things.",
      "Sass, SCSS and Less are not supported; convert them to CSS first.",
      "Checks cover unbalanced braces and parentheses and unclosed strings or comments; property names and values are not validated.",
    ],
    examples: [
      {
        title: "Ordinary rules",
        note: "Spaces around colons and semicolons go, as does the last semicolon in each block, but the colour #ffffff is not shortened to #fff.",
        input: "/* Buttons */\n.btn {\n  padding : 8px 16px ;\n  color : #ffffff ;\n}\n\n.btn:hover { opacity : 0.9 ; }",
        output: ".btn{padding:8px 16px;color:#ffffff}.btn:hover{opacity:0.9}",
      },
      {
        title: "A license comment, a string and url()",
        note: "The /*! comment survives, and the spaces inside the content string and the url() path are kept because they are part of the values.",
        input: '/*! Brand kit v2 | MIT */\n.logo::after {\n  content : "  ★  " ;\n  background : url( "img/bg tile.png" ) ;\n}',
        output: '/*! Brand kit v2 | MIT */.logo::after{content:"  ★  ";background:url("img/bg tile.png")}',
      },
    ],
    errors: [
      {
        message: 'Missing "}": the block opened on line 1 is never closed.',
        cause: "A rule or @media block is missing its closing brace, so the rules after it would end up nested inside it.",
        fix: "Add } at the end of the block that the message names.",
        verifyWith: ".card {\n  margin: 0;\n\n.title { color: red; }",
      },
      {
        message: 'Unexpected "}" on line 1: there is no matching "{".',
        cause: "An extra closing brace, typically left over after deleting a rule or a media query.",
        fix: "Delete the surplus brace on the reported line.",
        verifyWith: ".a { color: red; } }",
      },
      {
        message: "Unclosed string starting on line 1.",
        cause: "A quoted value, such as a content string or a font name, is missing its closing quote.",
        fix: "Add the matching quote before the semicolon.",
        verifyWith: '.q::before { content: "open; }',
      },
    ],
    faq: [
      {
        question: "Why are some comments kept?",
        answer:
          "Comments that start with /*! are a widely used convention for license and copyright notices that must stay in distributed files, so they are preserved. All other comments are removed.",
      },
      {
        question: "Is minified CSS different in behaviour?",
        answer:
          "It behaves the same, because only comments and whitespace that CSS ignores are removed. Strings, url() values and selector spacing that matters are left untouched, and the browser parses the result into the same rules.",
      },
      {
        question: "Why is my minified stylesheet still large?",
        answer:
          "This minifier only removes comments and whitespace. Unused selectors, duplicate rules and long values stay, and they often make up most of a stylesheet, so removing them needs a build tool such as PurgeCSS or cssnano.",
      },
      {
        question: "Can I minify CSS that uses nesting or container queries?",
        answer:
          "Yes, the minifier does not need to understand individual selectors or at-rules. It only removes comments and whitespace that CSS ignores, so newer syntax passes through intact.",
      },
    ],
    related: ["html-minify", "view-source", "json-minify", "xml-minify"],
  },

  "xml-minify": {
    title: "XML Minifier – Compact XML and Check It",
    h1: "XML Minifier",
    metaDescription:
      "Minify XML online and check it is well-formed: removes comments and indentation, keeps text values, attributes and CDATA exactly. Free, with no upload.",
    intro:
      "Remove comments and indentation from XML and check that it is well-formed. Text values, attributes and CDATA are kept exactly.",
    howTo: [
      "Paste XML, upload a file (.xml, .svg, .rss, .atom), or press Load example.",
      "Press Minify (or Ctrl+Enter); if the XML is not well-formed, the error names the tag and line.",
      "Copy or download the minified XML.",
    ],
    formats: [
      "Input: XML 1.0 documents with one root element, including the XML declaration, DOCTYPE (with an internal subset), namespaces, CDATA, processing instructions and xml:space. Works for SVG, RSS, Atom and sitemaps.",
      "Output: the same document without comments, whitespace-only text between elements, or extra spacing inside tags.",
      "Files: XML or plain-text files up to 5 MB.",
    ],
    limitations: [
      "Whitespace-only text between elements is removed. In mixed content such as <p><b>a</b> <i>b</i></p>, that space is meaningful; add xml:space=\"preserve\" to the element to keep it.",
      "Text that contains other characters is never trimmed: <name>  Alice </name> keeps its spaces.",
      "Well-formedness checks cover matching and nested tags, a single root element, duplicate attributes, and unescaped & and <. The XML is not validated against a schema or DTD.",
      "Comments inside elements with xml:space=\"preserve\" are kept.",
    ],
    examples: [
      {
        title: "An RSS feed",
        note: "The comment and indentation are removed, while the XML declaration and the em dash in the item title are kept as written.",
        input:
          '<?xml version="1.0"?>\n<!-- feed -->\n<rss version="2.0">\n  <channel>\n    <title>Release notes</title>\n    <item>\n      <title>v2.1 — faster search</title>\n    </item>\n  </channel>\n</rss>',
        output:
          '<?xml version="1.0"?><rss version="2.0"><channel><title>Release notes</title><item><title>v2.1 — faster search</title></item></channel></rss>',
      },
      {
        title: "Entities stay escaped",
        note: "&amp; is copied as-is rather than turned into a bare &, so the output is still well-formed and parses to the same text.",
        input: "<note>\n  <to>Ana</to>\n  <body>Fish &amp; chips</body>\n</note>",
        output: "<note><to>Ana</to><body>Fish &amp; chips</body></note>",
      },
    ],
    errors: [
      {
        message: "Closing tag </itme> does not match <item> opened on line 2 (line 2).",
        cause: "A typo or a missing closing tag makes the nesting inconsistent.",
        fix: "Correct the closing tag so it matches the most recently opened element.",
        verifyWith: "<order>\n  <item>Tea</itme>\n</order>",
      },
      {
        message: '"&" must be written as &amp; unless it starts an entity such as &lt; (line 2).',
        cause: "A bare ampersand in text, common in company names and in URLs with query strings.",
        fix: "Replace & with &amp;, or wrap the text in a CDATA section.",
        verifyWith: "<menu>\n  <dish>Fish & chips</dish>\n</menu>",
      },
      {
        message: "A document can only have one root element; <b> is a second one (line 2).",
        cause: "Two or more top-level elements, for example when fragments from several files are pasted together.",
        fix: "Wrap everything in a single parent element.",
        verifyWith: "<a/>\n<b/>",
      },
    ],
    faq: [
      {
        question: "Does minifying change my data?",
        answer:
          "It leaves the data intact: element text with any non-space characters, attribute values, CDATA sections and entity references are copied exactly. Only comments and whitespace that sits alone between elements are removed.",
      },
      {
        question: "Does it validate my XML against an XSD or DTD?",
        answer:
          "It checks well-formedness (the rules every XML document must follow), not validity against a schema.",
      },
      {
        question: "Can I minify SVG files with this tool?",
        answer:
          "Yes, SVG is XML, so comments and indentation are removed and the drawing stays the same. Editor metadata such as Inkscape or Illustrator attributes is kept, because only whitespace and comments are touched.",
      },
      {
        question: "Why does a mismatched-tag error mention two lines?",
        answer:
          "The first line is where the element was opened, and the one in brackets is where the wrong closing tag was found. Both places are worth checking.",
      },
    ],
    related: ["html-minify", "css-minify", "json-minify", "json-formatter"],
  },
}

export function getToolPage(slug: string): ToolPageContent | undefined {
  return toolPages[slug]
}
