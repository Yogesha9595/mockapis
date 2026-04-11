import { NextResponse } from "next/server"

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url)
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "Missing URL" }, { status: 400 })
  }

  try {
    const res = await fetch(url)
    const html = await res.text()

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" }
    })

  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}