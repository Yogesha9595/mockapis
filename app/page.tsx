import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Braces, Binary, Wrench, Type, Code2, ShieldCheck, Zap, BadgeCheck } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import ToolSearch from "@/components/home/ToolSearch"
import { buttonVariants } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import { liveToolLinks, toolCategories, categoryHref, type ToolLink } from "@/data/tools"
import { getAllArticles } from "@/lib/blog/getAllArticles"
import { SITE_NAME, absoluteUrl, pageMetadata } from "@/lib/site"

/* ---------------- METADATA (same title/description as before, plus canonical) ---------------- */

const TITLE = `${SITE_NAME} – Free Developer Tools & Utilities`
const DESCRIPTION =
  "Free developer tools including mock APIs, JSON formatter, converters, compilers, and API playground to build faster."

export const metadata: Metadata = {
  ...pageMetadata({ title: TITLE, description: DESCRIPTION, path: "/" }),
  title: { absolute: TITLE }, // don't append the "| DevUtilities Lab" template to the homepage
}

/* ---------------- CONTENT CHOICES ---------------- */

/** Hand-picked everyday tools. Any that stop working simply drop out (filtered by liveToolLinks). */
const FEATURED = [
  "json-formatter",
  "json-validator",
  "base64-encoder",
  "url-encoder",
  "jwt-decoder",
  "uuid-generator",
  "timestamp-converter",
  "view-source",
]

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  json: Braces,
  encoding: Binary,
  developer: Wrench,
  text: Type,
  formatter: Code2,
}

const sectionTitle = "text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
const sectionLead = "mt-1 text-sm text-muted sm:text-base"
const inlineLink = "font-medium text-primary underline-offset-2 hover:underline"

function ToolCard({ tool }: { tool: ToolLink }) {
  return (
    <Link href={tool.href} className="group block h-full rounded-container">
      <Card interactive className="flex h-full flex-col">
        <h3 className="font-semibold text-foreground group-hover:text-primary">{tool.name}</h3>
        <p className="mt-1 flex-1 text-sm leading-relaxed text-muted">{tool.description}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
          Open tool <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </Card>
    </Link>
  )
}

export default function Home() {
  const live = liveToolLinks()
  const featured = FEATURED.map((slug) => live.find((t) => t.slug === slug)).filter((t) => t !== undefined)
  const categories = toolCategories
    .map((c) => ({ ...c, tools: live.filter((t) => t.category === c.id), href: categoryHref(c.id) }))
    .filter((c) => c.tools.length > 0)
  const guides = [...getAllArticles()].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4)

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: absoluteUrl("/") },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl("/"),
      logo: absoluteUrl("/icon-512.png"),
      sameAs: ["https://github.com/devutilitieslab", "https://t.me/devutilities_lab"],
    },
  ]

  return (
    <div className="space-y-16 sm:space-y-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ---------------- HERO + SEARCH ---------------- */}
      <section aria-labelledby="hero-title" className="pt-6 sm:pt-12">
        <div className="max-w-3xl">
          <Badge variant="success">{live.length} free tools · runs in your browser</Badge>
          <h1 id="hero-title" className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Online tools for everyday developer tasks
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Format and validate JSON, encode and decode Base64 or URLs, inspect JWTs, generate UUIDs and convert
            timestamps. Fast, free and private: your data stays on your device.
          </p>
        </div>

        <div className="mt-8">
          <ToolSearch tools={live} />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/tools" className={buttonVariants({ size: "lg" })}>
            Browse all tools
          </Link>
          <Link href="/learn" className={buttonVariants({ variant: "secondary", size: "lg" })}>
            Read developer guides
          </Link>
        </div>
      </section>

      {/* ---------------- FEATURED TOOLS ---------------- */}
      <section aria-labelledby="featured-title">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 id="featured-title" className={sectionTitle}>Featured tools</h2>
            <p className={sectionLead}>The utilities developers reach for every day.</p>
          </div>
          <Link href="/tools" className={`${inlineLink} text-sm`}>All tools →</Link>
        </div>
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((tool) => (
            <li key={tool.slug}>
              <ToolCard tool={tool} />
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------- CATEGORIES ---------------- */}
      <section aria-labelledby="categories-title">
        <h2 id="categories-title" className={sectionTitle}>Browse by category</h2>
        <p className={sectionLead}>Every tool listed here works today.</p>
        <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = CATEGORY_ICONS[category.id] ?? Wrench
            return (
              <li key={category.id}>
                <Card className="h-full">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-surface text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground">
                        {category.href ? (
                          <Link href={category.href} className="hover:text-primary">{category.name}</Link>
                        ) : (
                          category.name
                        )}
                      </h3>
                      <p className="text-sm text-muted">{category.description}</p>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-1.5">
                    {category.tools.map((tool) => (
                      <li key={tool.slug}>
                        <Link href={tool.href} className="text-sm text-foreground hover:text-primary hover:underline">
                          {tool.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Card>
              </li>
            )
          })}
        </ul>
      </section>

      {/* ---------------- ABOUT ---------------- */}
      <section aria-labelledby="about-title" className="rounded-container border border-border bg-card p-6 shadow-card sm:p-8">
        <h2 id="about-title" className={sectionTitle}>About {SITE_NAME}</h2>
        <p className="mt-2 max-w-3xl leading-relaxed text-muted">
          {SITE_NAME} is a collection of focused utilities for developers, testers and anyone who works with
          structured data. Each tool does one job and explains its errors clearly.
        </p>
        <ul className="mt-6 grid gap-6 sm:grid-cols-3">
          <li className="flex gap-3">
            <ShieldCheck className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <h3 className="font-semibold text-foreground">Private by design</h3>
              <p className="mt-1 text-sm text-muted">The tools run in your browser. What you paste is not uploaded to a server.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <Zap className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <h3 className="font-semibold text-foreground">Free, no sign-up</h3>
              <p className="mt-1 text-sm text-muted">Open a tool and use it. There are no accounts or usage quotas.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <BadgeCheck className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <h3 className="font-semibold text-foreground">Tested before listed</h3>
              <p className="mt-1 text-sm text-muted">Tools that are still in development are clearly marked “coming soon” instead of shipping half-finished.</p>
            </div>
          </li>
        </ul>
      </section>

      {/* ---------------- GUIDES ---------------- */}
      {guides.length > 0 && (
        <section aria-labelledby="guides-title">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 id="guides-title" className={sectionTitle}>Guides &amp; learning resources</h2>
              <p className={sectionLead}>Practical articles on APIs and backend development.</p>
            </div>
            <Link href="/learn" className={`${inlineLink} text-sm`}>All guides →</Link>
          </div>
          <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {guides.map((article) => (
              <li key={article.slug}>
                <Link href={`/learn/${article.slug}`} className="group block h-full rounded-container">
                  <Card interactive className="h-full">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted">
                      {article.category} · {article.readingTime}
                    </p>
                    <h3 className="mt-1 font-semibold text-foreground group-hover:text-primary">{article.title}</h3>
                    {article.description && <p className="mt-1 text-sm leading-relaxed text-muted">{article.description}</p>}
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted">
            Also see the <Link href="/http-status-codes" className={inlineLink}>HTTP status codes reference</Link>.
          </p>
        </section>
      )}

      {/* ---------------- SEO CONTENT ---------------- */}
      <section aria-labelledby="seo-title" className="max-w-3xl">
        <h2 id="seo-title" className={sectionTitle}>Developer utilities that respect your data</h2>
        <div className="mt-4 space-y-6 leading-relaxed text-muted">
          <div>
            <h3 className="font-semibold text-foreground">Format and validate JSON</h3>
            <p className="mt-1">
              API responses are often minified onto a single line. The{" "}
              <Link href="/tools/json-formatter" className={inlineLink}>JSON formatter</Link> indents them for
              reading, and the <Link href="/tools/json-validator" className={inlineLink}>JSON validator</Link> points
              to the exact line and column of a syntax error, such as a trailing comma or an unquoted key.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Base64 versus URL encoding</h3>
            <p className="mt-1">
              They solve different problems. <Link href="/tools/base64-encoder" className={inlineLink}>Base64</Link>{" "}
              turns any text into a safe set of 64 characters for embedding in JSON, headers or data URLs.{" "}
              <Link href="/tools/url-encoder" className={inlineLink}>URL encoding</Link> escapes only the characters
              that have a special meaning in a URL, such as spaces, &amp; and =. Both tools handle Unicode and emoji as
              UTF-8.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Inspect tokens and timestamps</h3>
            <p className="mt-1">
              The <Link href="/tools/jwt-decoder" className={inlineLink}>JWT decoder</Link> shows a token&apos;s header,
              claims and expiry in readable form. Decoding does not verify the signature, so never trust a token based
              on its contents alone. The{" "}
              <Link href="/tools/timestamp-converter" className={inlineLink}>Unix timestamp converter</Link> detects
              seconds or milliseconds automatically and shows UTC and your local time.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
