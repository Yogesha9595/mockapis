export default function robots() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://devutilitieslab.com"

  const isStaging =
    siteUrl.includes("staging") ||
    process.env.NODE_ENV !== "production"

  return {
    rules: [
      {
        userAgent: "*",
        allow: isStaging ? [] : "/",
        disallow: isStaging ? "/" : [],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}