import { ok, type ToolResult } from "./types"

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" })

/** Sort lines using locale-aware, natural ordering (item2 before item10). */
export function sortLines(input: string, direction: "asc" | "desc" = "asc"): ToolResult {
  const lines = input.split(/\r?\n/)
  lines.sort((a, b) => (direction === "asc" ? collator.compare(a, b) : collator.compare(b, a)))
  return ok(lines.join("\n"))
}

function segmentCount(text: string, granularity: "word" | "sentence"): number {
  const segmenter = new Intl.Segmenter(undefined, { granularity })
  let count = 0
  for (const seg of segmenter.segment(text)) {
    // A "sentence" must contain at least one letter or digit (a lone "🚀" is not one)
    if (granularity === "word" ? seg.isWordLike : /[\p{L}\p{N}]/u.test(seg.segment)) count++
  }
  return count
}

/** Word/character/sentence statistics. Unicode-aware (Hindi, CJK, emoji). */
export function countWords(input: string): ToolResult {
  const characters = [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(input)].length
  const nonSpace = [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(input.replace(/\s+/g, ""))].length
  const words = segmentCount(input, "word")
  const sentences = segmentCount(input, "sentence")
  const lines = input === "" ? 0 : input.split(/\r?\n/).length
  const paragraphs = input.split(/\n\s*\n/).filter((p) => p.trim()).length
  const minutes = Math.max(words > 0 ? 1 : 0, Math.round(words / 200))

  return ok(
    [
      `Words:                     ${words}`,
      `Characters:                ${characters}`,
      `Characters (no spaces):    ${nonSpace}`,
      `Sentences:                 ${sentences}`,
      `Lines:                     ${lines}`,
      `Paragraphs:                ${paragraphs}`,
      `Reading time (~200 wpm):   ${minutes} min`,
    ].join("\n")
  )
}
