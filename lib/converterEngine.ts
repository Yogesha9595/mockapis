import { converterEngines } from "@/data/converterEngines"

// 🔥 derive category type from engines
export type Category = keyof typeof converterEngines

type ConvertParams = {
  category: Category
  value: number
  from: string
  to: string
}

export function convertUnit({
  category,
  value,
  from,
  to,
}: ConvertParams): number {
  const engine = converterEngines[category]

  // Safety guard
  if (!engine || typeof engine.convert !== "function") {
    console.error("Invalid category:", category)
    return 0
  }

  if (!from || !to || isNaN(value)) return 0

  try {
    return engine.convert(value, from, to)
  } catch (err) {
    console.error("Conversion error:", err)
    return 0
  }
}