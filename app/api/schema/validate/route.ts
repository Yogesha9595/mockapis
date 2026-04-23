import {
  validateSchema,
  extractSchemaFromHTML,
} from "@/lib/tools/schemaValidator"

export const runtime = "edge"

// ✅ TYPE (FIXES YOUR ERROR PROPERLY)
type SchemaValidationResult = {
  valid: boolean
  error?: string
  score?: number
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { input, mode } = body || {}

    // ============================
    // ✅ INPUT VALIDATION
    // ============================
    if (!input || typeof input !== "string") {
      return Response.json(
        {
          valid: false,
          error: "Invalid input. Provide JSON or URL string.",
        },
        { status: 400 }
      )
    }

    let schemas: any[] = []

    // ============================
    // 🌐 URL MODE
    // ============================
    if (mode === "url") {
      let url: URL

      try {
        url = new URL(input)
      } catch {
        return Response.json(
          {
            valid: false,
            error: "Invalid URL format",
          },
          { status: 400 }
        )
      }

      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 8000)

        const res = await fetch(url.toString(), {
          method: "GET",
          headers: {
            "User-Agent": "Mozilla/5.0 (Schema Validator Bot)",
          },
          signal: controller.signal,
        })

        clearTimeout(timeout)

        if (!res.ok) {
          return Response.json(
            {
              valid: false,
              error: "Failed to fetch page content",
            },
            { status: 400 }
          )
        }

        const html = await res.text()
        schemas = extractSchemaFromHTML(html)

        if (!schemas.length) {
          return Response.json({
            valid: false,
            error: "No schema markup found on this page",
          })
        }
      } catch (err: any) {
        return Response.json({
          valid: false,
          error:
            err.name === "AbortError"
              ? "Request timeout (site too slow)"
              : "Unable to fetch URL (blocked or invalid)",
        })
      }
    }

    // ============================
    // 🧾 JSON MODE
    // ============================
    else {
      try {
        const parsed = JSON.parse(input)
        schemas = Array.isArray(parsed) ? parsed : [parsed]
      } catch {
        return Response.json(
          {
            valid: false,
            error: "Invalid JSON format",
          },
          { status: 400 }
        )
      }
    }

    // ============================
    // ✅ VALIDATION
    // ============================
    const results: SchemaValidationResult[] = schemas
      .map((schema) => {
        try {
          return validateSchema(schema) as SchemaValidationResult
        } catch {
          return {
            valid: false,
            error: "Validation failed",
            score: 0,
          }
        }
      })
      .filter(Boolean)

    if (!results.length) {
      return Response.json({
        valid: false,
        error: "No valid schema detected",
      })
    }

    // ============================
    // 📊 SCORE CALCULATION (FIXED)
    // ============================
    const totalScore =
      results.reduce((sum, r) => sum + (r?.score ?? 0), 0) /
      results.length

    // ============================
    // 🚀 FINAL RESPONSE
    // ============================
    return Response.json({
      valid: results.every((r) => r.valid),
      score: Math.round(totalScore),
      count: results.length,
      results,
    })
  } catch (err) {
    return Response.json(
      {
        valid: false,
        error: "Server error while processing request",
      },
      { status: 500 }
    )
  }
}