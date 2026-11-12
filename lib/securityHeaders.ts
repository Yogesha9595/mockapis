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
 */
export const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
  "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
  "font-src 'self' data: https://cdn.jsdelivr.net",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://cdn.jsdelivr.net",
  "worker-src 'self' blob:",
  "frame-src 'self'",
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
