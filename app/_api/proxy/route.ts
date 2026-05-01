import { NextResponse } from "next/server"

// ✅ REQUIRED for static export (CRITICAL)
export const dynamic = "force-static"

const TIMEOUT = 8000
const MAX_SIZE = 1 * 1024 * 1024 // 1MB

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const url = searchParams.get("url")

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Valid URL is required" },
        { status: 400 }
      )
    }

    let parsed: URL

    try {
      parsed = new URL(url)
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      )
    }

    // ✅ Allow only HTTP/HTTPS
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return NextResponse.json(
        { error: "Only HTTP/HTTPS allowed" },
        { status: 400 }
      )
    }

    // 🔒 Basic SSRF protection
    const host = parsed.hostname
    if (
      host === "localhost" ||
      host.startsWith("127.") ||
      host.startsWith("10.") ||
      host.startsWith("192.168.")
    ) {
      return NextResponse.json(
        { error: "Blocked internal URL" },
        { status: 403 }
      )
    }

    // ⏱ Timeout control
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), TIMEOUT)

    const res = await fetch(parsed.toString(), {
      signal: controller.signal,
      headers: {
        "User-Agent": "MockAPIs/1.0",
      },
    })

    clearTimeout(timeout)

    if (!res.ok) {
      return NextResponse.json(
        { error: `Fetch failed (${res.status})` },
        { status: res.status }
      )
    }

    const contentType = res.headers.get("content-type") || ""

    if (!contentType.includes("text/html")) {
      return NextResponse.json(
        { error: "Only HTML content allowed" },
        { status: 400 }
      )
    }

    let html = await res.text()

    if (!html || html.length < 10) {
      return NextResponse.json(
        { error: "Empty response" },
        { status: 400 }
      )
    }

    // 🔥 Size limit protection
    if (html.length > MAX_SIZE) {
      html = html.slice(0, MAX_SIZE)
    }

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
      },
    })

  } catch (err: any) {
    if (err.name === "AbortError") {
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

// ❌ Block other methods
export function POST() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  )
}