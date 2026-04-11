let prettierInstance: any = null
let parserHtmlInstance: any = null

const MAX_HTML_SIZE = 2_000_000 // 2MB

/**
 * 🚀 Load Prettier only once (performance optimization)
 */
async function loadPrettier() {
  if (!prettierInstance || !parserHtmlInstance) {
    const prettier = await import("prettier/standalone")
    const parserHtml = await import("prettier/parser-html")

    prettierInstance = prettier
    parserHtmlInstance = parserHtml
  }
}

/**
 * 🚀 Production-grade HTML Beautifier
 */
export async function beautifyHtml(
  html: unknown,
  options?: {
    tabWidth?: number
  }
): Promise<string> {
  try {
    // ✅ Type safety
    if (typeof html !== "string") {
      console.warn("[beautifyHtml] Invalid input:", html)
      return ""
    }

    const input = html.trim()

    if (!input) return ""

    // 🚫 Prevent heavy processing
    if (input.length > MAX_HTML_SIZE) {
      return safeFormatFallback(input)
    }

    // 🚀 Load Prettier (cached)
    await loadPrettier()

    // ✨ Format HTML
    const formatted = prettierInstance.format(input, {
      parser: "html",
      plugins: [parserHtmlInstance],
      tabWidth: options?.tabWidth ?? 2,
      htmlWhitespaceSensitivity: "ignore",
    })

    return formatted
  } catch (err) {
    console.error("[beautifyHtml] Failed:", err)

    return safeFormatFallback(html as string)
  }
}

/**
 * 🛟 Safe fallback formatter (better than naive replace)
 */
function safeFormatFallback(html: string): string {
  try {
    return html
      .replace(/>\s*</g, ">\n<")
      .split("\n")
      .map((line) => line.trim())
      .join("\n")
  } catch {
    return html
  }
}