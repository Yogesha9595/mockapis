// ✅ Types
type ExtractedSchema = Record<string, any>

type SchemaValidationResult = {
  type?: string
  valid: boolean
  missing?: string[]
  score?: number
  suggestions?: string[]
  data?: any
  error?: string
} | SchemaValidationResult[]

// ✅ Extract JSON-LD from HTML (for URL mode)
export function extractSchemaFromHTML(html: string): ExtractedSchema[] {
  const regex =
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi

  const matches = [...html.matchAll(regex)]

  return matches
    .map((match) => {
      try {
        return JSON.parse(match[1])
      } catch {
        return null
      }
    })
    .filter((item): item is ExtractedSchema => Boolean(item))
}

// ✅ Main validator (supports string OR object)
export function validateSchema(input: any): SchemaValidationResult {
  let json: any

  // Handle string input (manual JSON)
  if (typeof input === "string") {
    try {
      json = JSON.parse(input)
    } catch {
      return {
        valid: false,
        error: "Invalid JSON format",
      }
    }
  } else {
    json = input
  }

  // Handle array schemas (recursive case)
  if (Array.isArray(json)) {
    return json.map((item) => validateSchema(item))
  }

  const type: string = json["@type"] || "Unknown"

  // ✅ Required fields per schema type
  const requiredFields: Record<string, string[]> = {
    Article: ["headline", "image", "author"],
    Product: ["name", "offers"],
    FAQPage: ["mainEntity"],
    LocalBusiness: ["name", "address"],
    BreadcrumbList: ["itemListElement"],
  }

  const required = requiredFields[type] || []

  const missing = required.filter((field) => {
    const value = json[field]

    // Handle nested object cases
    if (typeof value === "object") {
      return !value || Object.keys(value).length === 0
    }

    return !value
  })

  // ✅ Score logic
  const score = Math.max(0, 100 - missing.length * 20)

  // ✅ Suggestions
  const suggestions: string[] = []

  if (!json["@context"]) {
    suggestions.push("Add @context (https://schema.org)")
  }

  if (!json["@type"]) {
    suggestions.push("Add @type to define schema type")
  }

  if (type === "Article" && !json["datePublished"]) {
    suggestions.push("Add datePublished for better SEO")
  }

  return {
    type,
    valid: !!json["@type"],
    missing,
    score,
    suggestions,
    data: json,
  }
}