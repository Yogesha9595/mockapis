import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { tools, isLive } from "@/data/tools"
import { getToolPage } from "@/data/toolPages"
import { getToolDefinition } from "@/lib/tools/engine"
import { pageMetadata } from "@/lib/site"
import ToolPage from "@/components/tools/ToolPage"
import ToolPageClient from "./ToolPageClient"

// ✅ REQUIRED FOR STATIC EXPORT
export const dynamic = "force-static"

// Only the slugs listed in data/tools.ts exist; anything else is a real 404
export const dynamicParams = false

type PageProps = {
  params: Promise<{ slug: string }>
}

// ✅ GENERATE STATIC PATHS
export async function generateStaticParams() {
  return tools.map((tool) => ({
    slug: tool.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const tool = tools.find((t) => t.slug === slug)

  if (!tool) return {}

  return {
    ...pageMetadata({
      title: tool.name,
      description: getToolPage(slug)?.metaDescription ?? tool.description,
      path: `/tools/${tool.slug}`,
    }),
    // Incomplete / placeholder tools stay reachable but out of search results
    ...(isLive(tool) ? {} : { robots: { index: false, follow: true } }),
  }
}

// ✅ PAGE WRAPPER (Next.js 16: params is a Promise)
export default async function Page({ params }: PageProps) {
  const { slug } = await params

  const tool = tools.find((t) => t.slug === slug)
  if (!tool) notFound()

  // Tools with written page content use the shared template; the rest keep
  // the previous generic page until they are migrated one by one.
  const content = getToolPage(slug)
  if (content && isLive(tool) && getToolDefinition(slug)) {
    return <ToolPage slug={slug} name={tool.name} category={tool.category} content={content} />
  }

  return <ToolPageClient slug={slug} />
}
