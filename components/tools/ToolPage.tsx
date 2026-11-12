import Link from "next/link"
import { ArrowRight, Check, Info } from "lucide-react"

import Breadcrumb from "@/components/Breadcrumb"
import { ToolLayout } from "@/components/tools/ToolLayout"
import ToolWorkbench from "@/components/tools/ToolWorkbench"
import { Card } from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import { liveToolLinks, toolCategories, categoryHref, type ToolLink } from "@/data/tools"
import type { ToolPageContent } from "@/data/toolPages"
import { getToolDefinition } from "@/lib/tools/engine"
import { absoluteUrl, SITE_NAME } from "@/lib/site"

/* ==========================================================================
   Shared tool page template (server component).
   Only <ToolWorkbench> runs in the browser; everything else is static HTML.
   ========================================================================== */

type ToolPageProps = {
  slug: string
  name: string
  category: string
  content: ToolPageContent
}

const sectionTitle = "text-lg font-semibold tracking-tight text-foreground sm:text-xl"

export default function ToolPage({ slug, name, category, content }: ToolPageProps) {
  const categoryInfo = toolCategories.find((c) => c.id === category)
  const catHref = categoryHref(category)
  const definition = getToolDefinition(slug)

  // Sample output is computed by the real tool at build time, so it is always accurate
  const example = definition && definition.primary.run(definition.sample)

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    url: absoluteUrl(`/tools/${slug}`),
    description: content.metaDescription ?? content.intro,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any (runs in the browser)",
    isAccessibleForFree: true,
    publisher: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />

      <div className="mx-auto w-full max-w-6xl">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            ...(categoryInfo ? [{ label: categoryInfo.name, href: catHref ?? undefined }] : []),
            { label: name },
          ]}
        />
      </div>

      <ToolLayout
        title={name}
        description={content.intro}
        badges={<Badge variant="success">Runs in your browser</Badge>}
      >
        <ToolWorkbench slug={slug} />

        {/* ---------------- CONTENT BELOW THE TOOL ---------------- */}
        {/* grid-cols-1 = minmax(0,1fr): without it the implicit column grows to the widest example line on phones */}
        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0 space-y-12">
            <HowToUse steps={content.howTo} />
            <FormatsAndLimits formats={content.formats} limitations={content.limitations} />
            {definition && example?.ok && (
              <ExampleBlock
                inputLabel={definition.inputLabel}
                outputLabel={definition.outputLabel}
                input={definition.sample}
                output={example.output}
                action={definition.primary.label}
              />
            )}
            {content.faq && content.faq.length > 0 && <Faq items={content.faq} />}
          </div>

          <aside aria-labelledby="related-title" className="lg:sticky lg:top-24 lg:self-start">
            <RelatedTools slug={slug} category={category} preferred={content.related} />
          </aside>
        </div>
      </ToolLayout>
    </>
  )
}

/* ---------------- SECTIONS ---------------- */

function HowToUse({ steps }: { steps: string[] }) {
  return (
    <section aria-labelledby="howto-title">
      <h2 id="howto-title" className={sectionTitle}>How to use</h2>
      <ol className="mt-4 space-y-3">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-3">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-semibold text-foreground"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <span className="leading-relaxed text-muted">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}

function FormatsAndLimits({ formats, limitations }: { formats: string[]; limitations: string[] }) {
  return (
    <section aria-labelledby="formats-title" className="grid gap-6 md:grid-cols-2">
      <div>
        <h2 id="formats-title" className={sectionTitle}>Supported formats</h2>
        <ul className="mt-4 space-y-2.5">
          {formats.map((f, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-muted">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className={sectionTitle}>Limitations</h2>
        <ul className="mt-4 space-y-2.5">
          {limitations.map((l, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-muted">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
              <span>{l}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function ExampleBlock({
  inputLabel,
  outputLabel,
  input,
  output,
  action,
}: {
  inputLabel: string
  outputLabel: string
  input: string
  output: string
  action: string
}) {
  const pre = "max-h-72 overflow-auto rounded-control border border-border bg-surface p-3 font-mono text-xs leading-relaxed text-foreground sm:text-sm"
  return (
    <section aria-labelledby="example-title">
      <h2 id="example-title" className={sectionTitle}>Example</h2>
      <p className="mt-1 text-sm text-muted">This is the built-in example and the tool&apos;s real result for {action}.</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <figure className="min-w-0">
          <figcaption className="mb-1.5 text-sm font-medium text-foreground">{inputLabel}</figcaption>
          <pre className={pre} tabIndex={0}><code>{input}</code></pre>
        </figure>
        <figure className="min-w-0">
          <figcaption className="mb-1.5 text-sm font-medium text-foreground">{outputLabel}</figcaption>
          <pre className={pre} tabIndex={0}><code>{output}</code></pre>
        </figure>
      </div>
    </section>
  )
}

function Faq({ items }: { items: { question: string; answer: string }[] }) {
  // Structured data mirrors exactly the visible questions and answers
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  }
  return (
    <section aria-labelledby="faq-title">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h2 id="faq-title" className={sectionTitle}>Frequently asked questions</h2>
      <div className="mt-4 divide-y divide-border rounded-container border border-border bg-card">
        {items.map((f, i) => (
          <details key={i} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-medium text-foreground marker:hidden hover:bg-surface [&::-webkit-details-marker]:hidden">
              <h3 className="text-base font-medium">{f.question}</h3>
              <span className="text-muted transition-transform group-open:rotate-45" aria-hidden="true">+</span>
            </summary>
            <p className="px-4 pb-4 text-sm leading-relaxed text-muted">{f.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

function RelatedTools({ slug, category, preferred = [] }: { slug: string; category: string; preferred?: string[] }) {
  const live = liveToolLinks().filter((t) => t.slug !== slug)
  // Order: tools this page recommends, then same category, then anything else
  const ordered: ToolLink[] = [
    ...preferred.map((s) => live.find((t) => t.slug === s)).filter((t): t is ToolLink => t !== undefined),
    ...live.filter((t) => t.category === category),
    ...live,
  ]
  const related = ordered.filter((t, i) => ordered.findIndex((x) => x.slug === t.slug) === i).slice(0, 6)

  return (
    <Card>
      <h2 id="related-title" className="text-base font-semibold text-foreground">Related tools</h2>
      <ul className="mt-3 space-y-1">
        {related.map((t) => (
          <li key={t.slug}>
            <Link href={t.href} className="group -mx-2 flex items-center justify-between gap-2 rounded-control px-2 py-2 hover:bg-surface">
              <span className="min-w-0">
                <span className="block text-sm font-medium text-foreground group-hover:text-primary">{t.name}</span>
                <span className="block truncate text-xs text-muted">{t.description}</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/tools" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">All tools →</Link>
    </Card>
  )
}
