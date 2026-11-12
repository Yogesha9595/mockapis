import type { Metadata } from "next"

/**
 * Single source of truth for the site's public identity.
 * Every canonical URL, sitemap entry, Open Graph URL and JSON-LD URL
 * must be built from these values.
 */
export const SITE_URL = "https://devutilitieslab.com"
export const SITE_NAME = "DevUtilities Lab"
export const DEFAULT_OG_IMAGE = "/og-image.png"

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
  keywords?: string[]
  ogType?: "website" | "article"
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
  keywords,
  ogType = "website",
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
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
