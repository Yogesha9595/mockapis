import type { Metadata } from "next"

/**
 * Single source of truth for the site's public identity.
 * Every canonical URL, sitemap entry, Open Graph URL and JSON-LD URL
 * must be built from these values.
 */
export const SITE_URL = "https://devutilitieslab.com"
export const SITE_NAME = "DevUtilities Lab"
export const DEFAULT_OG_IMAGE = "/og-image.png"

/**
 * Homepage title and site description: defined here only.
 * Used by the root layout (site-wide defaults) and the homepage.
 * Describe only tools that are live today (status "live" in data/tools.ts).
 */
export const HOME_TITLE = `${SITE_NAME} – Free Developer Tools & Utilities`
export const SITE_DESCRIPTION =
  "Free developer tools that run in your browser: format and validate JSON, encode Base64 and URLs, decode JWTs, generate UUIDs, convert timestamps and minify HTML, CSS and XML."

/** Absolute URL for a site path, e.g. absoluteUrl("/learn") */
export function absoluteUrl(path = "/"): string {
  if (path === "/" || path === "") return SITE_URL
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

type PageMetadataInput = {
  title: string
  description: string
  /** Site-relative path of the page, e.g. "/about" */
  path: string
  ogType?: "website" | "article"
  /** Keep the page reachable but out of search results: robots "noindex, follow" */
  noindex?: boolean
  /** With noindex: also tell crawlers not to follow links: robots "noindex, nofollow" */
  nofollow?: boolean
}

/**
 * Page metadata with a self-referencing canonical URL plus complete
 * Open Graph / Twitter blocks (Next.js replaces, not merges, these objects
 * from the parent layout, so each page must supply them in full).
 */
export function pageMetadata({
  title,
  description,
  path,
  ogType = "website",
  noindex = false,
  nofollow = false,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    // No meta keywords anywhere on the site (search engines ignore them)
    ...(noindex ? { robots: { index: false, follow: !nofollow } } : {}),
    alternates: { canonical: path },
    openGraph: {
      type: ogType,
      url: path,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: DEFAULT_OG_IMAGE, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  }
}
