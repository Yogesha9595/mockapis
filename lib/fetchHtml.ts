export type FetchHtmlResult = {
  html: string
  error?: string
  status?: number
}

const DEFAULT_TIMEOUT = 10000

/**
 * 🚀 Fetch HTML via internal API proxy (secure + scalable)
 */
export async function fetchHtml(
  url: string,
  options?: {
    timeout?: number
    signal?: AbortSignal
  }
): Promise<FetchHtmlResult> {
  try {
    // 🔥 Normalize & clean URL
    const cleaned = url?.replace("view-source:", "").trim()

    if (!cleaned) {
      return { html: "", error: "URL is required" }
    }

    let parsedUrl: URL

    try {
      parsedUrl = new URL(cleaned)
    } catch {
      return { html: "", error: "Invalid URL format" }
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return {
        html: "",
        error: "Only HTTP/HTTPS URLs are allowed",
      }
    }

    // 🚫 Block internal URLs (security)
    if (
      parsedUrl.hostname === "localhost" ||
      parsedUrl.hostname.startsWith("127.") ||
      parsedUrl.hostname.startsWith("192.168.")
    ) {
      return {
        html: "",
        error: "Fetching local/internal URLs is not allowed",
      }
    }

    // ⏱ Timeout
    const controller = new AbortController()
    const timeout = options?.timeout || DEFAULT_TIMEOUT
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    // 🔗 Call API (FIXED → POST)
    const res = await fetch("/api/fetch-html", {
      method: "POST",
      signal: options?.signal || controller.signal,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: parsedUrl.toString() }),
      cache: "no-store",
    })

    clearTimeout(timeoutId)

    // ❌ HTTP error
    if (!res.ok) {
      let message = `Failed to fetch (status ${res.status})`

      try {
        const errData = await res.json()
        message = errData?.error || message
      } catch {
        // ignore parse error
      }

      return {
        html: "",
        error: message,
        status: res.status,
      }
    }

    // 🔥 SAFE JSON PARSE (CRITICAL FIX)
    let data: any

    try {
      data = await res.json()
    } catch {
      return {
        html: "",
        error: "Invalid server response",
      }
    }

    // ❌ API error
    if (data.error) {
      return {
        html: "",
        error: data.error,
      }
    }

    const html = data.html

    // ✅ Validate HTML
    if (!html || typeof html !== "string" || html.trim().length < 50) {
      return {
        html: "",
        error: "Empty or blocked HTML response",
      }
    }

    // ⚠️ Detect JS-only response (important UX)
    if (!html.includes("<html") && !html.includes("<!DOCTYPE")) {
      return {
        html,
        error: "Site may block scraping or returns JS content",
      }
    }

    return { html }

  } catch (err: any) {
    console.error("[fetchHtml]", err)

    if (err.name === "AbortError") {
      return {
        html: "",
        error: "Request timed out. Try again.",
      }
    }

    return {
      html: "",
      error: "Network error. Please try again.",
    }
  }
}