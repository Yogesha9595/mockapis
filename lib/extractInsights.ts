export type Insights = {
  title: string
  metaDescription: string
  canonical: string

  headings: {
    h1: string[]
    h2: string[]
    h3: string[]
  }

  links: {
    total: number
    internal: number
    external: number
  }

  images: {
    total: number
    missingAlt: number
  }

  scripts: number

  meta: {
    ogTitle: string
    ogDescription: string
  }
}

/**
 * 🚀 Extract SEO + Structure insights from HTML
 */
export function extractInsights(html: string): Insights {
  if (!html || typeof html !== "string") {
    return emptyInsights()
  }

  try {
    const clean = html.replace(/\n/g, " ")

    // 🔹 Helper
    const getMatch = (regex: RegExp) => {
      const match = clean.match(regex)
      return match?.[1]?.trim() || ""
    }

    // 🧠 Basic SEO
    const title = getMatch(/<title>(.*?)<\/title>/i)

    const metaDescription =
      getMatch(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["']/i) ||
      getMatch(/<meta[^>]*content=["'](.*?)["'][^>]*name=["']description["']/i)

    const canonical = getMatch(
      /<link[^>]*rel=["']canonical["'][^>]*href=["'](.*?)["']/i
    )

    // 🔥 OpenGraph
    const ogTitle = getMatch(
      /<meta[^>]*property=["']og:title["'][^>]*content=["'](.*?)["']/i
    )

    const ogDescription = getMatch(
      /<meta[^>]*property=["']og:description["'][^>]*content=["'](.*?)["']/i
    )

    // 🧠 Headings
    const getTags = (tag: string) =>
      [...clean.matchAll(new RegExp(`<${tag}[^>]*>(.*?)<\/${tag}>`, "gi"))].map(
        (m) => stripHtml(m[1])
      )

    const h1 = getTags("h1")
    const h2 = getTags("h2")
    const h3 = getTags("h3")

    // 🔗 Links
    const linkMatches = [
      ...clean.matchAll(/<a[^>]+href=["'](.*?)["']/gi),
    ].map((m) => m[1])

    let internal = 0
    let external = 0

    linkMatches.forEach((link) => {
      if (/^https?:\/\//i.test(link)) external++
      else internal++
    })

    // 🖼 Images
    const imgMatches = [...clean.matchAll(/<img[^>]*>/gi)]

    const missingAlt = imgMatches.filter(
      (img) => !/alt=["'][^"']*["']/.test(img[0])
    ).length

    // 📜 Scripts
    const scripts = [...clean.matchAll(/<script\b/gi)].length

    return {
      title: title || "No title found",
      metaDescription: metaDescription || "No description found",
      canonical,

      headings: { h1, h2, h3 },

      links: {
        total: linkMatches.length,
        internal,
        external,
      },

      images: {
        total: imgMatches.length,
        missingAlt,
      },

      scripts,

      meta: {
        ogTitle,
        ogDescription,
      },
    }
  } catch (err) {
    console.error("[extractInsights]", err)
    return emptyInsights()
  }
}

/**
 * 🛟 Default fallback
 */
function emptyInsights(): Insights {
  return {
    title: "",
    metaDescription: "",
    canonical: "",

    headings: { h1: [], h2: [], h3: [] },

    links: { total: 0, internal: 0, external: 0 },

    images: { total: 0, missingAlt: 0 },

    scripts: 0,

    meta: {
      ogTitle: "",
      ogDescription: "",
    },
  }
}

/**
 * 🧼 Remove HTML tags safely
 */
function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim()
}