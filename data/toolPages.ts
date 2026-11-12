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

  "html-minify": {
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
    faq: [
      {
        question: "Will minifying change how my page looks?",
        answer:
          "With default styles, no: only whitespace the browser would not display is removed, and a single space is kept between inline elements such as links and bold text. The one exception is described under limitations: block elements that your CSS turns into inline-block can lose the gap between them.",
      },
      {
        question: "Is the JavaScript in my page minified too?",
        answer:
          "No. Script content is copied exactly, because minifying JavaScript safely requires a full JavaScript parser. Use a JavaScript minifier for scripts.",
      },
    ],
    related: ["css-minify", "view-source", "xml-minify", "json-minify"],
  },

  "css-minify": {
    metaDescription:
      "Minify CSS online: remove comments and whitespace without changing what your styles do. Keeps strings, url() and /*! license */ comments. Free, runs in your browser.",
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
    faq: [
      {
        question: "Why are some comments kept?",
        answer:
          "Comments that start with /*! are a widely used convention for license and copyright notices that must stay in distributed files, so they are preserved. All other comments are removed.",
      },
      {
        question: "Is minified CSS different in behaviour?",
        answer:
          "No. Only comments and whitespace that CSS ignores are removed. Strings, url() values and selector spacing that matters are left untouched, and the browser parses the result into the same rules.",
      },
    ],
    related: ["html-minify", "view-source", "json-minify", "xml-minify"],
  },

  "xml-minify": {
    metaDescription:
      "Minify XML online and check it is well-formed: removes comments and indentation, keeps text values, attributes and CDATA exactly. Free, runs in your browser.",
    intro:
      "Remove comments and indentation from XML and check that it is well-formed. Text values, attributes and CDATA are kept exactly.",
    howTo: [
      "Paste XML, upload a file (.xml, .svg, .rss, .atom), or press Load example.",
      "Press Minify (or Ctrl+Enter). If the XML is not well-formed, the error names the tag and line.",
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
    faq: [
      {
        question: "Does minifying change my data?",
        answer:
          "No. Element text with any non-space characters, attribute values, CDATA sections and entity references are copied exactly. Only comments and whitespace that sits alone between elements are removed.",
      },
      {
        question: "Does it validate my XML against an XSD or DTD?",
        answer:
          "No. It checks well-formedness (the rules every XML document must follow), not validity against a schema.",
      },
    ],
    related: ["html-minify", "css-minify", "json-minify", "json-formatter"],
  },
}

export function getToolPage(slug: string): ToolPageContent | undefined {
  return toolPages[slug]
}
