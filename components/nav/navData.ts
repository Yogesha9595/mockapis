import { liveToolLinks, toolCategories, categoryHref, type ToolLink } from "@/data/tools"

/* Navigation data shared by the header and footer. Built only from working
   tools (liveToolLinks), so navigation can never link a placeholder. */

export type NavCategory = { id: string; name: string; href: string | null; tools: ToolLink[] }

export function navCategories(): NavCategory[] {
  const live = liveToolLinks()
  return toolCategories
    .map((c) => ({ id: c.id, name: c.name, href: categoryHref(c.id), tools: live.filter((t) => t.category === c.id) }))
    .filter((c) => c.tools.length > 0)
}

/** Top-level links next to the Tools menu. Kept short on purpose. */
export const PRIMARY_LINKS = [
  { href: "/learn", label: "Guides" },
  { href: "/http-status-codes", label: "HTTP Status Codes" },
]

/** Footer company and legal pages. Every route exists (see tests/unit/nav.test.ts). */
export const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export const LEGAL_LINKS = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/sitemap.xml", label: "Sitemap" },
]

export const RESOURCE_LINKS = [
  { href: "/learn", label: "Guides" },
  { href: "/http-status-codes", label: "HTTP status codes" },
]
