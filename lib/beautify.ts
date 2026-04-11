export async function beautifyHtml(html: any): Promise<string> {
  try {
    // 🔥 HARD SAFETY CHECK
    if (typeof html !== "string") {
      console.warn("Invalid HTML input:", html)
      return ""
    }

    if (!html.trim()) return ""

    // Prevent freeze on huge HTML
    if (html.length > 2_000_000) return html

    const prettier = await import("prettier/standalone")
    const parserHtml = await import("prettier/parser-html")

    return prettier.format(html, {
      parser: "html",
      plugins: [parserHtml],
      tabWidth: 2,
      htmlWhitespaceSensitivity: "ignore",
    })
  } catch (err) {
    console.error("Beautify failed:", err)

    return typeof html === "string"
      ? html.replace(/></g, ">\n<")
      : ""
  }
}