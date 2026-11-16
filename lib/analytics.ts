/**
 * Google Analytics 4 + consent mode (single source of truth).
 *
 * - The GA4 tag loads only when NEXT_PUBLIC_GA_ID is set to a valid GA4 ID
 *   and the build is a production build (see gaMeasurementId()).
 * - Consent defaults are set before any Google tag loads, following Google's
 *   consent mode guide (developers.google.com/tag-platform/security/guides/consent):
 *   denied for visitors in the EEA, UK and Switzerland, granted elsewhere.
 *   A region-specific default takes precedence over the general one.
 * - trackToolUsed() sends only a tool slug and an action name, never user input.
 */

/* EEA (EU 27 + Iceland, Liechtenstein, Norway), United Kingdom, Switzerland — ISO 3166-1 alpha-2 */
export const CONSENT_REQUIRED_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT",
  "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
  "IS", "LI", "NO",
  "GB", "CH",
] as const

const GA4_ID_PATTERN = /^G-[A-Z0-9]{4,20}$/

/**
 * The GA4 measurement ID to load, or null when analytics must not load:
 * the variable is unset, not a valid GA4 ID (never injected into a script),
 * or this is not a production build.
 */
export function gaMeasurementId(env: { NEXT_PUBLIC_GA_ID?: string; NODE_ENV?: string } = process.env): string | null {
  const id = env.NEXT_PUBLIC_GA_ID?.trim()
  if (!id || env.NODE_ENV !== "production") return null
  return GA4_ID_PATTERN.test(id) ? id : null
}

/** Inline script: dataLayer + gtag stub and consent defaults. Must run before any Google tag. */
export function consentDefaultsScript(): string {
  const denied = { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" }
  const granted = { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted", analytics_storage: "granted" }
  return [
    "window.dataLayer=window.dataLayer||[];",
    "function gtag(){dataLayer.push(arguments);}",
    `gtag('consent','default',${JSON.stringify({ ...denied, region: CONSENT_REQUIRED_REGIONS })});`,
    `gtag('consent','default',${JSON.stringify(granted)});`,
  ].join("")
}

const ADSENSE_CLIENT_PATTERN = /^ca-pub-\d{10,20}$/

/**
 * Inline script for <head>: consent defaults FIRST, then the AdSense loader.
 *
 * Why not a plain <script async src="…adsbygoogle.js">? React 19 hoists every
 * async script to the top of <head>, ahead of inline scripts, so AdSense would
 * start before consent defaults exist. Google requires the defaults first, so
 * the loader is inserted here, right after them (once per page load).
 * Site ownership is verified with the google-adsense-account meta tag + ads.txt.
 */
export function googleTagsBootstrapScript(adsenseClient: string): string {
  if (!ADSENSE_CLIENT_PATTERN.test(adsenseClient)) throw new Error("Invalid AdSense client ID")
  const src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`
  return (
    consentDefaultsScript() +
    `(function(){if(document.querySelector('script[src="${src}"]'))return;` +
    `var s=document.createElement('script');s.async=true;s.crossOrigin='anonymous';s.src='${src}';` +
    `document.head.appendChild(s);})();`
  )
}

/** Inline script that initialises GA4 for a validated measurement ID. */
export function gaConfigScript(id: string): string {
  if (!GA4_ID_PATTERN.test(id)) throw new Error("Invalid GA4 measurement ID")
  return `gtag('js',new Date());gtag('config','${id}');`
}

/* ---------------- EVENTS ---------------- */

type Gtag = (command: "event", name: string, params: Record<string, string>) => void
declare global {
  interface Window {
    gtag?: Gtag
  }
}

/* Slugs and action names are short identifiers defined in code ("format", "sort_a_z").
   The tight length cap means pasted content can never pass as an action name. */
const SAFE_SLUG = /^[a-z0-9][a-z0-9-]{0,47}$/
const SAFE_ACTION = /^[a-z0-9][a-z0-9_]{0,31}$/

/** Normalise an action label such as "Load example" → "load_example". */
export function toEventAction(label: string): string {
  return label.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")
}

/**
 * Send a GA4 `tool_used` event with only the tool slug and the action name.
 * Both must be short identifiers; anything else is dropped, so user input
 * can never be sent. Does nothing when GA is not loaded.
 */
export function trackToolUsed(toolSlug: string, action: string): boolean {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return false
  const tool_slug = toolSlug.trim().toLowerCase()
  const tool_action = toEventAction(action)
  if (!SAFE_SLUG.test(tool_slug) || !SAFE_ACTION.test(tool_action)) return false
  window.gtag("event", "tool_used", { tool_slug, tool_action })
  return true
}
