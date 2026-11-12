import { test } from "node:test"
import assert from "node:assert/strict"
import { existsSync } from "node:fs"
import { navCategories, PRIMARY_LINKS, COMPANY_LINKS, LEGAL_LINKS, RESOURCE_LINKS } from "@/components/nav/navData"
import { tools, standaloneTools, isLive } from "@/data/tools"

/** Does a static route exist in the app directory? */
function routeExists(href: string): boolean {
  if (href === "/sitemap.xml") return existsSync("app/sitemap.ts")
  return existsSync(`app${href}/page.tsx`)
}

test("every fixed header/footer link points to an existing route", () => {
  for (const { href, label } of [...PRIMARY_LINKS, ...COMPANY_LINKS, ...LEGAL_LINKS, ...RESOURCE_LINKS]) {
    assert.ok(routeExists(href), `${label} → ${href} has no route`)
  }
})

test("required footer pages are all present", () => {
  const labels = [...COMPANY_LINKS, ...LEGAL_LINKS].map((l) => l.label)
  for (const required of ["About", "Contact", "Privacy Policy", "Terms of Service", "Disclaimer", "Sitemap"]) {
    assert.ok(labels.includes(required), `missing ${required}`)
  }
})

test("navigation categories contain only working tools and real category pages", () => {
  const categories = navCategories()
  assert.ok(categories.length > 0)
  const all = [...tools, ...standaloneTools]
  for (const c of categories) {
    assert.ok(c.tools.length > 0, `${c.id} has no tools`)
    for (const t of c.tools) {
      const tool = all.find((x) => x.slug === t.slug)
      assert.ok(tool && isLive(tool), `${t.slug} is not live`)
    }
    if (c.href) {
      assert.equal(c.href, `/tools/category/${c.id}`)
      assert.ok(tools.some((t) => t.category === c.id && isLive(t)), `${c.href} has no working generic tool`)
    }
  }
})

test("top-level navigation stays short", () => {
  assert.ok(PRIMARY_LINKS.length + 1 <= 4, "Tools menu + primary links should be at most 4 items")
})
