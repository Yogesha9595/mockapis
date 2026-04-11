import { NextResponse } from "next/server"
import iconv from "iconv-lite"

export async function POST(req: Request) {
  try {
    const { text, encoding, mode } = await req.json()

    if (!text) {
      return NextResponse.json({ result: "" })
    }

    let result = ""

    if (mode === "encode") {
      const buffer = iconv.encode(text, encoding || "utf-8")
      result = buffer.toString("hex")
    } else {
      const buffer = Buffer.from(text, "hex")
      result = iconv.decode(buffer, encoding || "utf-8")
    }

    return NextResponse.json({ result })
  } catch (error) {
    return NextResponse.json({ error: "Encoding failed" }, { status: 500 })
  }
}