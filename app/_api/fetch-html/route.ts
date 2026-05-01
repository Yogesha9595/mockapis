import { NextResponse } from "next/server"

// ✅ REQUIRED for static export compatibility
export const dynamic = "force-static"

const TIMEOUT = 10000
const MAX_SIZE = 2 * 1024 * 1024 // 2MB

// 🔒 SECURITY CONFIG
const ALLOW_LOCALHOST = false // 🚨 ALWAYS false in production
const BLOCK_PRIVATE_IPS = true

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)

    if (!body?.url || typeof body.url !== "string") {
      return NextResponse.json(
        { error: "Valid URL is required" },
        { status: 400 }
      )
    }

    // 🔥 Clean URL
    const cleanedUrl = body.url.replace("view-source:", "").trim()

    let parsedUrl: URL

    try {
      parsedUrl = new URL(cleanedUrl)
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      )
    }

    // ✅ Allow only HTTP/HTTPS
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json(
        { error: "Only HTTP/HTTPS URLs allowed" },
        { status: 400 }
      )
    }

    const hostname = parsedUrl.hostname

    // 🔒 SSRF Protection (expanded)
    if (BLOCK_PRIVATE_IPS && !ALLOW_LOCALHOST) {
      const isPrivate =
        hostname === "localhost" ||
        hostname.startsWith("127.") ||
        hostname.startsWith("10.") ||
        hostname.startsWith("192.168.") ||
        hostname.startsWith("172.16.") ||
        hostname.startsWith("172.17.") ||
        hostname.startsWith("172.18.") ||
        hostname.startsWith("172.19.") ||
        hostname.startsWith("172.2") // covers 172.20–31

      if (isPrivate) {
        return NextResponse.json(
          { error: "Access to internal network blocked" },
          { status: 403 }
        )
      }
    }

    // ⏱ Timeout handling
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT)

    const response = await fetch(parsedUrl.toString(), {
      method: "GET",
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; DevUtilitiesLab/1.0)",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    })

    clearTimeout(timeoutId)

    // ❌ HTTP errors
    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Failed to fetch page (status ${response.status})`,
        },
        { status: response.status }
      )
    }

    const contentType = response.headers.get("content-type") || ""

    // ✅ Only allow HTML-like responses
    if (!contentType.includes("text/html")) {
      return NextResponse.json(
        { error: "Only HTML content is allowed" },
        { status: 400 }
      )
    }

    let html = await response.text()

    if (!html || html.length < 10) {
      return NextResponse.json(
        { error: "Empty or blocked response" },
        { status: 400 }
      )
    }

    // 🔥 Limit size (DoS protection)
    if (html.length > MAX_SIZE) {
      html = html.slice(0, MAX_SIZE)
    }

    return NextResponse.json({
      html,
      contentType,
      status: response.status,
    })

  } catch (error: any) {
    console.error("[FETCH_HTML_API]", error)

    if (error.name === "AbortError") {
      return NextResponse.json(
        { error: "Request timed out" },
        { status: 408 }
      )
    }

    return NextResponse.json(
      { error: "Failed to fetch HTML" },
      { status: 500 }
    )
  }
}

// ❌ BLOCK ALL OTHER METHODS
export function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  )
}