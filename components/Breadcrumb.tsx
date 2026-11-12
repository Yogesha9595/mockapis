import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { absoluteUrl } from "@/lib/site"

export type BreadcrumbItem = { label: string; href?: string }

/**
 * Accessible breadcrumb trail (nav > ol, aria-current on the last item)
 * plus matching BreadcrumbList structured data. The last item is the
 * current page and is not a link.
 */
export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1">
              {item.href && !last ? (
                <Link href={item.href} className="rounded-control hover:text-foreground hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={last ? "font-medium text-foreground" : undefined}>
                  {item.label}
                </span>
              )}
              {!last && <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
