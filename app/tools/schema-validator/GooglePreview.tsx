"use client"

export default function GooglePreview({ schema }: any) {
  if (!schema || typeof schema !== "object") return null

  // ============================
  // 🧠 DATA EXTRACTION
  // ============================
  const title =
    schema.headline ||
    schema.name ||
    "Example Title for Search Result"

  const description =
    schema.description ||
    "This is how your page may appear in Google search results based on structured data."

  const rawUrl =
    schema.url ||
    schema["@id"] ||
    "https://example.com/page"

  let displayUrl = rawUrl
  let domain = ""
  let path = ""

  try {
    const parsed = new URL(rawUrl)
    domain = parsed.hostname.replace("www.", "")
    path = parsed.pathname
  } catch {
    domain = "example.com"
    path = "/page"
  }

  // ============================
  // ✂️ TRIM (Google-like)
  // ============================
  const trim = (text: string, max: number) =>
    text.length > max ? text.slice(0, max) + "..." : text

  const displayTitle = trim(title, 60)
  const displayDesc = trim(description, 160)

  // ============================
  // UI
  // ============================
  return (
    <div className="border rounded-lg bg-white p-5 space-y-2 shadow-sm">

      {/* Label */}
      <div className="text-xs text-gray-400">
        Google Search Preview
      </div>

      {/* URL / Breadcrumb */}
      <div className="text-xs text-gray-600">
        {domain}
        <span className="text-gray-400"> › </span>
        <span>{path.replace("/", "") || "home"}</span>
      </div>

      {/* Title */}
      <div className="text-blue-700 text-lg leading-snug font-medium hover:underline cursor-pointer">
        {displayTitle}
      </div>

      {/* Description */}
      <div className="text-sm text-gray-700 leading-snug">
        {displayDesc}
      </div>

      {/* Hint */}
      <div className="text-[11px] text-gray-400 pt-2">
        Preview based on structured data. Actual result may vary.
      </div>
    </div>
  )
}