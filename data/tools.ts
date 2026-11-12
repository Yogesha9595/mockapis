/**
 * Tool registry.
 *
 * status (audited against lib/tools/engine.ts with real inputs):
 *  - "live"    → does what its name says for typical input. Indexable, linked from the hub.
 *  - "partial" → runs, but produces wrong/incomplete output for common input.
 *                Route kept, `noindex`, shown as "Coming soon" in listings.
 *  - "planned" → placeholder output only. Route kept, `noindex`, "Coming soon".
 */
export type ToolStatus = "live" | "partial" | "planned"

export type Tool = {
  slug: string
  name: string
  description: string
  category: string
  status: ToolStatus
}

/** A tool with its own hand-built route outside /tools/[slug] */
export type StandaloneTool = Tool & { href: string }

export function isLive(tool: Pick<Tool, "status">): boolean {
  return tool.status === "live"
}

export const tools: Tool[] = [

/* ---------------- JSON TOOLS (HIGH SEO) ---------------- */

{ slug:"json-formatter", name:"JSON Formatter & Beautifier", description:"Format, validate and beautify JSON data instantly online.", category:"json", status:"live"},
{ slug:"json-validator", name:"JSON Validator Online", description:"Validate JSON structure and detect errors instantly.", category:"json", status:"live"},
{ slug:"json-minify", name:"JSON Minifier", description:"Minify JSON data to reduce file size.", category:"json", status:"live"},
{ slug:"json-viewer", name:"JSON Viewer Tool", description:"View and explore JSON data in a readable format.", category:"json", status:"live"},
{ slug:"json-pretty", name:"JSON Pretty Print Tool", description:"Pretty print JSON for better readability.", category:"json", status:"live"},
// placeholder: "coming soon"
{ slug:"json-compare", name:"JSON Compare Tool", description:"Compare two JSON objects and find differences.", category:"json", status:"planned"},
// placeholder: engine returns "Conversion ... initiated (Library required)"
{ slug:"json-to-csv", name:"JSON to CSV Converter", description:"Convert JSON data into CSV format instantly.", category:"json", status:"planned"},
{ slug:"json-to-tsv", name:"JSON to TSV Converter", description:"Convert JSON data into TSV format.", category:"json", status:"planned"},
{ slug:"json-to-xml", name:"JSON to XML Converter", description:"Convert JSON data into XML format.", category:"json", status:"planned"},
{ slug:"json-to-yaml", name:"JSON to YAML Converter", description:"Convert JSON into YAML format easily.", category:"json", status:"planned"},

/* ---------------- ENCODING TOOLS ---------------- */

// live: UTF-8 Base64 (lib/tools/base64.ts), tested in tests/unit/base64.test.ts
{ slug:"base64-encoder", name:"Base64 Encoder Online", description:"Encode text in any language, including emoji, to standard UTF-8 Base64.", category:"encoding", status:"live"},
{ slug:"base64-decoder", name:"Base64 Decoder Online", description:"Decode Base64 encoded strings easily.", category:"encoding", status:"live"},
{ slug:"url-encoder", name:"URL Encoder Tool", description:"Encode URLs safely for web usage.", category:"encoding", status:"live"},
{ slug:"url-decoder", name:"URL Decoder Tool", description:"Decode encoded URLs instantly.", category:"encoding", status:"live"},

/* ---------------- DEVELOPER UTILITIES ---------------- */

{ slug:"uuid-generator", name:"UUID Generator Tool", description:"Generate random UUID (v4) instantly.", category:"developer", status:"live"},
{ slug:"jwt-decoder", name:"JWT Decoder Tool", description:"Decode and inspect JWT tokens easily.", category:"developer", status:"live"},
{ slug:"regex-tester", name:"Regex Tester Online", description:"Test and validate regular expressions.", category:"developer", status:"planned"},
{ slug:"timestamp-converter", name:"Unix Timestamp Converter", description:"Convert Unix timestamps to readable dates.", category:"developer", status:"live"},
{ slug:"hash-generator", name:"Hash Generator (MD5, SHA256)", description:"Generate secure hashes like MD5 and SHA256.", category:"developer", status:"planned"},

/* ---------------- HTML TOOLS ---------------- */

{ slug:"html-formatter", name:"HTML Formatter & Beautifier", description:"Format and beautify HTML code instantly.", category:"formatter", status:"planned"},
// partial: only collapses whitespace; keeps comments and breaks <pre> content
{ slug:"html-minify", name:"HTML Minifier Tool", description:"Minify HTML code to reduce size.", category:"formatter", status:"partial"},
{ slug:"html-validator", name:"HTML Validator Online", description:"Validate HTML markup and fix errors.", category:"formatter", status:"planned"},
{ slug:"html-viewer", name:"HTML Viewer Tool", description:"Render and preview HTML output.", category:"formatter", status:"planned"},

/* ---------------- CSS TOOLS ---------------- */

{ slug:"css-formatter", name:"CSS Formatter & Beautifier", description:"Beautify CSS code for better readability.", category:"formatter", status:"planned"},
// partial: only collapses whitespace; keeps comments
{ slug:"css-minify", name:"CSS Minifier Tool", description:"Minify CSS to reduce file size.", category:"formatter", status:"partial"},
{ slug:"css-beautifier", name:"CSS Beautifier Online", description:"Format CSS code instantly.", category:"formatter", status:"planned"},

/* ---------------- MARKDOWN / GRAPHQL ---------------- */

{ slug:"markdown-formatter", name:"Markdown Formatter Tool", description:"Format Markdown content instantly.", category:"formatter", status:"planned"},
{ slug:"graphql-formatter", name:"GraphQL Formatter Tool", description:"Beautify GraphQL queries.", category:"formatter", status:"planned"},

/* ---------------- TEXT TOOLS ---------------- */

{ slug:"text-diff", name:"Text Compare Tool", description:"Compare two texts and highlight differences.", category:"text", status:"planned"},
{ slug:"text-sort", name:"Text Sort Tool", description:"Sort text lines alphabetically.", category:"text", status:"live"},
// partial: only converts to UPPERCASE
{ slug:"text-case-converter", name:"Text Case Converter", description:"Convert text to uppercase, lowercase, etc.", category:"text", status:"partial"},
{ slug:"word-counter", name:"Word Counter Tool", description:"Count words, characters, and sentences.", category:"text", status:"live"},

/* ---------------- XML TOOLS ---------------- */

// placeholder: engine returns the input unchanged
{ slug:"xml-formatter", name:"XML Formatter & Beautifier", description:"Format XML data instantly.", category:"xml", status:"planned"},
// partial: only collapses whitespace; keeps comments
{ slug:"xml-minify", name:"XML Minifier Tool", description:"Minify XML data easily.", category:"xml", status:"partial"},
{ slug:"xml-parser", name:"XML Parser Tool", description:"Parse XML data into readable structure.", category:"xml", status:"planned"},
{ slug:"xml-validator", name:"XML Validator Online", description:"Validate XML syntax and structure.", category:"xml", status:"planned"},
{ slug:"xml-viewer", name:"XML Viewer Tool", description:"View XML data in structured format.", category:"xml", status:"planned"},

/* ---------------- YAML TOOLS ---------------- */

// placeholder: engine returns the input unchanged
{ slug:"yaml-formatter", name:"YAML Formatter & Beautifier", description:"Format YAML files instantly.", category:"yaml", status:"planned"},
{ slug:"yaml-parser", name:"YAML Parser Tool", description:"Parse YAML data easily.", category:"yaml", status:"planned"},
{ slug:"yaml-validator", name:"YAML Validator Online", description:"Validate YAML syntax.", category:"yaml", status:"planned"},
{ slug:"yaml-viewer", name:"YAML Viewer Tool", description:"View YAML data clearly.", category:"yaml", status:"planned"},

/* ---------------- COLOR / EXTRA ---------------- */

{ slug:"color-converter", name:"Color Converter Tool", description:"Convert HEX, RGB, HSL color formats.", category:"developer", status:"planned"}

]

/**
 * Hand-built tools with their own routes (app/tools/<slug>/).
 * Listed on the /tools hub only; not part of /tools/[slug] static params.
 */
export const standaloneTools: StandaloneTool[] = [
  // live: paste-HTML beautify, sandboxed preview, DOM tree and SEO insights, all client-side.
  // (Fetching a page by URL is not offered: it needs a server.)
  { slug:"view-source", href:"/tools/view-source", name:"View Source & HTML Beautifier", description:"Beautify pasted HTML and inspect its structure and SEO tags.", category:"formatter", status:"live"},
  // partial: rewritten client-side (lib/tools/url.ts, unit-tested); stays partial until browser-tested
  { slug:"url-encoder-decoder", href:"/tools/url-encoder-decoder", name:"URL Encoder & Decoder", description:"Encode or decode URLs and query strings.", category:"encoding", status:"partial"},
  // partial: rewritten client-side (lib/tools/schemaValidator.ts, unit-tested); stays partial until browser-tested
  { slug:"schema-validator", href:"/tools/schema-validator", name:"Schema Markup Validator", description:"Validate JSON-LD structured data.", category:"developer", status:"partial"},
]

/* ---------------- CATEGORIES ---------------- */

export type ToolCategory = { id: string; name: string; description: string }

/** Display order and copy for tool categories (shared by the homepage and /tools). */
export const toolCategories: ToolCategory[] = [
  { id: "json", name: "JSON Tools", description: "Format, validate, minify and view JSON." },
  { id: "encoding", name: "Encoding Tools", description: "Base64 and URL percent-encoding, both directions." },
  { id: "developer", name: "Developer Utilities", description: "UUIDs, JWT decoding and Unix timestamps." },
  { id: "text", name: "Text Tools", description: "Sort lines and count words, characters and sentences." },
  { id: "formatter", name: "Formatter Tools", description: "Beautify and inspect HTML source." },
  { id: "xml", name: "XML Tools", description: "Format, validate and view XML." },
  { id: "yaml", name: "YAML Tools", description: "Format, validate and view YAML." },
]

/* ---------------- WORKING-TOOL CATALOG ---------------- */

export type ToolLink = { slug: string; name: string; description: string; category: string; href: string }

/**
 * Every working tool (generic + standalone) with its real URL.
 * Use this whenever a page links to tools, so only working tools are linked.
 */
export function liveToolLinks(): ToolLink[] {
  const toLink = (t: Tool | StandaloneTool): ToolLink => ({
    slug: t.slug,
    name: t.name,
    description: t.description,
    category: t.category,
    href: "href" in t ? t.href : `/tools/${t.slug}`,
  })
  return [...standaloneTools, ...tools].filter(isLive).map(toLink)
}

/**
 * URL of a category's listing page, or null when that page would not help
 * (no working generic tools there, so /tools/category/<id> is noindex).
 */
export function categoryHref(categoryId: string): string | null {
  return tools.some((t) => t.category === categoryId && isLive(t)) ? `/tools/category/${categoryId}` : null
}
