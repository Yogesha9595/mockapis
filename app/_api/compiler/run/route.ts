import { NextResponse } from "next/server"

const JUDGE0_API =
  "https://ce.judge0.com/submissions?wait=true&base64_encoded=false"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const code: string = body.code
    const language_id: number = body.language_id
    const stdin: string = body.stdin || ""

    if (!code || !language_id) {
      return NextResponse.json(
        { success: false, error: "Missing code or language_id" },
        { status: 400 }
      )
    }

    const response = await fetch(JUDGE0_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        source_code: code,
        language_id,
        stdin
      }),
      cache: "no-store"
    })

    const data = await response.json()

    // ✅ NORMALIZED RESPONSE
    const stdout = data.stdout || ""
    const stderr = data.stderr || ""
    const compile_output = data.compile_output || ""

    // 🔥 FALLBACK MESSAGE
    let message = ""
    if (!stdout && !stderr && !compile_output) {
      message = data.message || "No output returned"
    }

    return NextResponse.json({
      success: true,

      // 🔥 MAIN OUTPUTS
      stdout: stdout.trim(),
      stderr: stderr.trim(),
      compile_output: compile_output.trim(),
      message,

      // 🔥 STATUS
      status: {
        id: data.status?.id,
        description: data.status?.description
      },

      // 🔥 EXECUTION STATS
      execution: {
        time: data.time || "0",
        memory: data.memory || "0"
      }
    })

  } catch (error) {
    console.error("Compiler error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Compiler execution failed"
      },
      { status: 500 }
    )
  }
}