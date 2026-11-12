/**
 * Schema.org JSON-LD markup checker (runs entirely in the browser).
 *
 * What it checks:
 *  - JSON syntax of each JSON-LD block
 *  - @context (must reference schema.org) and @type on every entity
 *  - Required / recommended properties for the types in TYPE_RULES, based on
 *    Google's structured-data documentation for rich results
 *
 * What it does NOT do: validate property value types against the full
 * schema.org vocabulary, fetch remote pages, or predict whether Google will
 * actually show a rich result. The UI states these limits.
 */

type Json = Record<string, unknown>

type TypeRule = {
  /** Missing → error */
  required?: string[]
  /** At least one of these must be present → error */
  requiredOneOf?: string[][]
  /** Missing → suggestion */
  recommended?: string[]
}

const ARTICLE: TypeRule = { recommended: ["headline", "image", "author", "datePublished", "dateModified"] }

export const TYPE_RULES: Record<string, TypeRule> = {
  Article: ARTICLE,
  NewsArticle: ARTICLE,
  BlogPosting: ARTICLE,
  Product: { required: ["name"], requiredOneOf: [["offers", "review", "aggregateRating"]], recommended: ["image", "description", "brand", "sku"] },
  Offer: { required: ["price", "priceCurrency"], recommended: ["availability", "url"] },
  FAQPage: { required: ["mainEntity"] },
  Question: { required: ["name", "acceptedAnswer"] },
  Answer: { required: ["text"] },
  BreadcrumbList: { required: ["itemListElement"] },
  ListItem: { required: ["position"], recommended: ["name", "item"] },
  Organization: { recommended: ["name", "url", "logo"] },
  LocalBusiness: { required: ["name", "address"], recommended: ["telephone", "openingHoursSpecification", "geo", "url"] },
  Event: { required: ["name", "startDate", "location"], recommended: ["endDate", "description", "image", "offers", "eventStatus"] },
  Recipe: { required: ["name", "image"], recommended: ["author", "datePublished", "description", "recipeIngredient", "recipeInstructions"] },
  JobPosting: { required: ["title", "description", "datePosted", "hiringOrganization"], recommended: ["validThrough", "employmentType", "baseSalary", "jobLocation"] },
  VideoObject: { required: ["name", "thumbnailUrl", "uploadDate"], recommended: ["description", "duration", "contentUrl", "embedUrl"] },
  SoftwareApplication: { required: ["name"], recommended: ["offers", "applicationCategory", "operatingSystem"] },
  WebApplication: { required: ["name"], recommended: ["offers", "applicationCategory", "operatingSystem"] },
  WebSite: { recommended: ["name", "url"] },
  WebPage: { recommended: ["name"] },
  Person: { required: ["name"] },
}

export const CHECKED_TYPES = Object.keys(TYPE_RULES)

export type EntityResult = {
  type: string
  valid: boolean
  /** Errors: problems that make the markup invalid or ineligible */
  missing: string[]
  /** Suggestions: recommended improvements */
  suggestions: string[]
  score: number
  data: unknown
}

export type ValidationReport =
  | { error: string }
  | { valid: boolean; score: number; count: number; results: EntityResult[] }

/* ---------------- HELPERS ---------------- */

const isObject = (v: unknown): v is Json => typeof v === "object" && v !== null && !Array.isArray(v)

function isPresent(value: unknown): boolean {
  if (value === undefined || value === null) return false
  if (typeof value === "string") return value.trim() !== ""
  if (Array.isArray(value)) return value.length > 0
  if (isObject(value)) return Object.keys(value).length > 0
  return true
}

function typesOf(entity: Json): string[] {
  const t = entity["@type"]
  if (typeof t === "string") return [t]
  if (Array.isArray(t)) return t.filter((x): x is string => typeof x === "string")
  return []
}

function contextIsSchemaOrg(context: unknown): boolean {
  const values = Array.isArray(context) ? context : [context]
  return values.some(
    (c) =>
      (typeof c === "string" && /^https?:\/\/schema\.org\/?$/i.test(c.trim())) ||
      (isObject(c) && typeof c["@vocab"] === "string" && /schema\.org/i.test(c["@vocab"] as string))
  )
}

/** Expand arrays and @graph containers into top-level entities. */
function topLevelEntities(parsed: unknown): { entity: Json; inheritedContext: unknown }[] {
  const out: { entity: Json; inheritedContext: unknown }[] = []
  const visit = (node: unknown, ctx: unknown) => {
    if (Array.isArray(node)) return node.forEach((n) => visit(n, ctx))
    if (!isObject(node)) return
    const context = node["@context"] ?? ctx
    if (Array.isArray(node["@graph"])) {
      ;(node["@graph"] as unknown[]).forEach((n) => visit(n, context))
      if (!node["@type"]) return
    }
    out.push({ entity: node, inheritedContext: context })
  }
  visit(parsed, undefined)
  return out
}

/** Check one entity and the nested entities we have rules for. */
function checkEntity(entity: Json, path: string, errors: string[], suggestions: string[]) {
  const types = typesOf(entity)
  if (types.length === 0) {
    errors.push(`${path}: missing @type`)
    return
  }

  for (const type of types) {
    const rule = TYPE_RULES[type]
    if (!rule) continue
    for (const prop of rule.required ?? []) {
      if (!isPresent(entity[prop])) errors.push(`${path}: required property "${prop}" is missing (${type})`)
    }
    for (const group of rule.requiredOneOf ?? []) {
      if (!group.some((p) => isPresent(entity[p]))) {
        errors.push(`${path}: ${type} needs at least one of ${group.map((p) => `"${p}"`).join(", ")}`)
      }
    }
    for (const prop of rule.recommended ?? []) {
      if (!isPresent(entity[prop])) suggestions.push(`${path}: add recommended property "${prop}" (${type})`)
    }
  }

  // Recurse into nested typed entities (offers, mainEntity, itemListElement, ...)
  for (const [key, value] of Object.entries(entity)) {
    if (key.startsWith("@")) continue
    const items = Array.isArray(value) ? value : [value]
    items.forEach((item, i) => {
      if (isObject(item) && item["@type"]) {
        checkEntity(item, `${path}.${key}${Array.isArray(value) ? `[${i}]` : ""}`, errors, suggestions)
      }
    })
  }
}

/* ---------------- PUBLIC API ---------------- */

/** Extract the contents of every <script type="application/ld+json"> block. */
export function extractJsonLdBlocks(html: string): string[] {
  const regex = /<script\b[^>]*\btype\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script\s*>/gi
  return [...html.matchAll(regex)].map((m) => m[1].trim()).filter(Boolean)
}

/** Validate one or more JSON-LD documents (as text). */
export function validateJsonLd(blocks: string[]): ValidationReport {
  if (blocks.length === 0) return { error: "No JSON-LD found. Paste JSON-LD, or page HTML that contains <script type=\"application/ld+json\"> blocks." }

  const results: EntityResult[] = []

  blocks.forEach((block, b) => {
    const label = blocks.length > 1 ? `Block ${b + 1}` : "Root"
    let parsed: unknown
    try {
      parsed = JSON.parse(block)
    } catch (err) {
      const message = err instanceof Error ? err.message.replace(/,\s*(\.\.\.)?"[\s\S]*" is not valid JSON$/, "") : "syntax error"
      results.push({ type: `${label} (invalid JSON)`, valid: false, missing: [`JSON syntax error: ${message}`], suggestions: [], score: 0, data: block })
      return
    }

    const entities = topLevelEntities(parsed)
    if (entities.length === 0) {
      results.push({ type: label, valid: false, missing: ["The JSON does not contain any objects to check."], suggestions: [], score: 0, data: parsed })
      return
    }

    entities.forEach(({ entity, inheritedContext }) => {
      const errors: string[] = []
      const suggestions: string[] = []
      const types = typesOf(entity)
      const path = types[0] ?? "(no @type)"

      if (!isPresent(inheritedContext)) errors.push(`${path}: missing @context (use "https://schema.org")`)
      else if (!contextIsSchemaOrg(inheritedContext)) suggestions.push(`${path}: @context does not reference https://schema.org`)

      checkEntity(entity, path, errors, suggestions)

      if (types.length > 0 && !types.some((t) => TYPE_RULES[t])) {
        suggestions.push(`${path}: no type-specific checks are available for ${types.join(", ")}; only syntax, @context and @type were checked`)
      }

      results.push({
        type: types.join(", ") || "(no @type)",
        valid: errors.length === 0,
        missing: errors,
        suggestions,
        score: Math.max(0, 100 - errors.length * 25 - suggestions.length * 5),
        data: entity,
      })
    })
  })

  const score = Math.round(results.reduce((s, r) => s + r.score, 0) / results.length)
  return { valid: results.every((r) => r.valid), score, count: results.length, results }
}

/** Entry point for the UI: "json" = JSON-LD text, "html" = page source. */
export function validateSchemaInput(input: string, mode: "json" | "html"): ValidationReport {
  if (!input.trim()) return { error: mode === "html" ? "Paste the page's HTML source first." : "Paste JSON-LD first." }
  if (mode === "html") {
    const blocks = extractJsonLdBlocks(input)
    if (blocks.length === 0) return { error: "No <script type=\"application/ld+json\"> blocks were found in this HTML." }
    return validateJsonLd(blocks)
  }
  return validateJsonLd([input])
}
