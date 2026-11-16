import { execFileSync } from "node:child_process"

/**
 * Last-modified dates for the sitemap, from Git history (build time only).
 *
 * A page's date is the most recent commit touching any of its source paths,
 * so the date changes only when the page's content or code changes.
 * If Git or its history is unavailable (e.g. a shallow clone that lacks the
 * commit), the build time is used, so every entry still has a date.
 */
const BUILD_TIME = new Date()
const cache = new Map<string, Date>()

export function lastModified(paths: string[]): Date {
  const key = paths.join("|")
  const hit = cache.get(key)
  if (hit) return hit

  let date = BUILD_TIME
  try {
    const iso = execFileSync("git", ["log", "-1", "--format=%cI", "--", ...paths], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 10_000,
    }).trim()
    const parsed = new Date(iso)
    if (iso && !isNaN(parsed.getTime())) date = parsed
  } catch {
    // Git not available: keep the build time
  }

  cache.set(key, date)
  return date
}
