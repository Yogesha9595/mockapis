/**
 * Security headers — single source of truth.
 *
 * Used by next.config.ts (for `next start` / Node hosting) and mirrored in
 * public/_headers (Cloudflare Pages static hosting ignores next.config
 * headers). tests/unit/securityHeaders.test.ts fails if the two drift apart.
 *
 * CSP notes:
 *  - 'unsafe-inline' scripts are required by a statically exported Next.js app
 *    (inline bootstrap + theme script; nonces need a server per request).
 *  - cdn.jsdelivr.net serves the Monaco editor (loader, CSS, codicon font).
 *  - blob: workers are created by Monaco.
 *  - Google Analytics 4: domains from Google's CSP guide, "GA4 without Ads features"
 *    (developers.google.com/tag-platform/security/guides/csp).
 *  - AdSense: pagead2.googlesyndication.com serves the loader (adsbygoogle.js).
 *    The loader alone (no ad units) also uses Google's ad-traffic-quality checks:
 *    scripts, requests and frames on *.adtrafficquality.google, plus frames on
 *    googleads.g.doubleclick.net and www.google.com. Each host was added because
 *    a browser test recorded a CSP violation for it (2026-11-16); placing ad units
 *    later may need more hosts — re-run the CSP check before enabling ads.
 */
const GOOGLE_TAG = "https://www.googletagmanager.com"
const GA_COLLECT = "https://*.google-analytics.com"
const ADSENSE = "https://pagead2.googlesyndication.com"
const AD_QUALITY = "https://*.adtrafficquality.google"
const AD_FRAMES = `https://googleads.g.doubleclick.net ${AD_QUALITY} https://www.google.com`

export const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net ${GOOGLE_TAG} ${ADSENSE} ${AD_QUALITY}`,
  "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
  "font-src 'self' data: https://cdn.jsdelivr.net",
  "img-src 'self' data: blob: https:",
  `connect-src 'self' https://cdn.jsdelivr.net ${GOOGLE_TAG} ${GA_COLLECT} https://*.google.com ${ADSENSE} ${AD_QUALITY}`,
  "worker-src 'self' blob:",
  `frame-src 'self' ${AD_FRAMES}`,
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ")

export const SECURITY_HEADERS: { key: string; value: string }[] = [
  { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
  // No includeSubDomains/preload: not every subdomain is known to serve HTTPS
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
]
