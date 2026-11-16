import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { gaMeasurementId, consentDefaultsScript, gaConfigScript, googleTagsBootstrapScript, trackToolUsed, toEventAction, CONSENT_REQUIRED_REGIONS } from "@/lib/analytics"
import sitemap from "@/app/sitemap"

/* ---------------- GA4 loading rules ---------------- */

test("GA loads only for a valid ID in production builds", () => {
  assert.equal(gaMeasurementId({ NEXT_PUBLIC_GA_ID: "G-H7FTH611FB", NODE_ENV: "production" }), "G-H7FTH611FB")
  assert.equal(gaMeasurementId({ NEXT_PUBLIC_GA_ID: "G-H7FTH611FB", NODE_ENV: "development" }), null)
  assert.equal(gaMeasurementId({ NODE_ENV: "production" }), null)
  assert.equal(gaMeasurementId({ NEXT_PUBLIC_GA_ID: "  ", NODE_ENV: "production" }), null)
  // Never injected into the inline script unless it is a real GA4 ID
  assert.equal(gaMeasurementId({ NEXT_PUBLIC_GA_ID: "G-X');alert(1);//", NODE_ENV: "production" }), null)
  assert.equal(gaMeasurementId({ NEXT_PUBLIC_GA_ID: "UA-12345-1", NODE_ENV: "production" }), null)
  assert.throws(() => gaConfigScript("bad'id"))
  assert.equal(gaConfigScript("G-H7FTH611FB"), "gtag('js',new Date());gtag('config','G-H7FTH611FB');")
})

/* ---------------- Consent mode defaults ---------------- */

test("consent defaults: denied in EEA/UK/CH, granted elsewhere, set via dataLayer before any tag", () => {
  const calls: unknown[][] = []
  const fakeWindow: { dataLayer?: unknown[] } = {}
  // Execute the inline script exactly as the browser would
  new Function("window", "dataLayer", consentDefaultsScript().replace("window.dataLayer=window.dataLayer||[];", ""))(fakeWindow, {
    push: (args: IArguments) => calls.push([...args]),
  })
  assert.equal(calls.length, 2)
  const [regional, general] = calls as [string, string, Record<string, unknown>][]
  assert.deepEqual(regional.slice(0, 2), ["consent", "default"])
  assert.equal(regional[2].analytics_storage, "denied")
  assert.equal(regional[2].ad_storage, "denied")
  assert.equal(regional[2].ad_user_data, "denied")
  assert.equal(regional[2].ad_personalization, "denied")
  assert.deepEqual(general[2], { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted", analytics_storage: "granted" })

  const regions = regional[2].region as string[]
  assert.equal(regions.length, 32) // EU 27 + IS, LI, NO + GB + CH
  for (const r of ["DE", "FR", "IE", "PL", "IS", "LI", "NO", "GB", "CH"]) assert.ok(regions.includes(r), r)
  assert.ok(!regions.includes("US") && !regions.includes("IN"))
  assert.equal(new Set(CONSENT_REQUIRED_REGIONS).size, CONSENT_REQUIRED_REGIONS.length)
})

test("bootstrap: consent defaults run before the AdSense loader is inserted (once)", () => {
  const script = googleTagsBootstrapScript("ca-pub-1954376162691867")
  const consentAt = script.indexOf("gtag('consent','default'")
  const loaderAt = script.indexOf("document.createElement('script')")
  assert.ok(consentAt >= 0 && loaderAt > consentAt, "consent must come first")
  assert.match(script, /adsbygoogle\.js\?client=ca-pub-1954376162691867/)
  assert.match(script, /crossOrigin='anonymous'/)
  assert.match(script, /if\(document\.querySelector\('script\[src=/) // no duplicate loader
  assert.throws(() => googleTagsBootstrapScript("ca-pub-1');alert(1);//"))
  // The layout must not also render a plain async AdSense <script> (React would hoist it above consent)
  const layout = readFileSync("app/layout.tsx", "utf8")
  assert.doesNotMatch(layout, /<script\s+async[\s\S]{0,80}googlesyndication/)
  assert.match(layout, /<meta name="google-adsense-account" content=\{ADSENSE_CLIENT\} \/>/)
})

/* ---------------- tool_used event ---------------- */

test("tool_used sends only slug + action, never user input", () => {
  const sent: unknown[][] = []
  const g = globalThis as unknown as { window?: { gtag?: (...a: unknown[]) => void } }
  g.window = { gtag: (...a: unknown[]) => sent.push(a) }
  try {
    assert.equal(trackToolUsed("json-formatter", "Format"), true)
    assert.equal(trackToolUsed("json-formatter", "Load example"), true)
    assert.deepEqual(sent[0], ["event", "tool_used", { tool_slug: "json-formatter", tool_action: "format" }])
    assert.deepEqual(sent[1], ["event", "tool_used", { tool_slug: "json-formatter", tool_action: "load_example" }])
    // Anything that is not a short identifier is dropped
    assert.equal(trackToolUsed("json-formatter", '{"password":"secret value that a user pasted into the tool","x":1,"y":2}'), false)
    assert.equal(trackToolUsed("json-formatter", "my api key is abc123 and my email is a@b.co"), false)
    assert.equal(trackToolUsed("<script>", "format"), false)
    assert.equal(sent.length, 2)
  } finally {
    delete g.window
  }
  assert.equal(trackToolUsed("json-formatter", "format"), false) // no GA → no-op
  assert.equal(toEventAction("  Sort A → Z "), "sort_a_z")
})

test("every real action label in the app is accepted", async () => {
  const { toolDefinitions } = await import("@/lib/tools/engine")
  const g = globalThis as unknown as { window?: { gtag?: () => void } }
  g.window = { gtag: () => {} }
  try {
    for (const [slug, def] of Object.entries(toolDefinitions)) {
      for (const a of [def.primary, ...(def.extra ?? [])]) assert.equal(trackToolUsed(slug, a.label), true, `${slug}: ${a.label}`)
    }
    for (const a of ["copy", "download"]) assert.equal(trackToolUsed("json-formatter", a), true)
  } finally {
    delete g.window
  }
})

test("only the JSON formatter reports usage (first example)", () => {
  const src = readFileSync("data/toolPages.ts", "utf8")
  assert.equal((src.match(/trackUsage: true/g) ?? []).length, 1)
})

/* ---------------- Sitemap ---------------- */

test("sitemap: no thin pages, every entry has a lastModified date, only production URLs", () => {
  const entries = sitemap()
  assert.ok(entries.length > 0)
  for (const e of entries) {
    assert.match(e.url, /^https:\/\/devutilitieslab\.com(\/|$)/)
    assert.doesNotMatch(e.url, /\/(convert|converters)\/|\/calculators(\/|$)/, e.url)
    assert.ok(e.lastModified instanceof Date && !isNaN(e.lastModified.getTime()), `${e.url} lacks lastModified`)
  }
  assert.equal(new Set(entries.map((e) => e.url)).size, entries.length, "duplicate URLs")
})

test("ads.txt contains exactly the AdSense line", () => {
  assert.equal(readFileSync("public/ads.txt", "utf8").trim(), "google.com, pub-1954376162691867, DIRECT, f08c47fec0942fa0")
})
