import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { tools, isLive } from "@/data/tools"
import { getToolPage } from "@/data/toolPages"
import { getToolDefinition } from "@/lib/tools/engine"
import { pageMetadata } from "@/lib/site"
import ToolPage from "@/components/tools/ToolPage"

// ✅ REQUIRED FOR STATIC EXPORT
export const dynamic = "force-static"

// Only live tools get a page; planned/partial slugs and unknown slugs are a real 404
export const dynamicParams = false

type PageProps = {
  params: Promise<{ slug: string }>
}

/** A tool page exists only when the tool works and has its own written content. */
function pageFor(slug: string) {
  const tool = tools.find((t) => t.slug === slug)
  const content = getToolPage(slug)
  if (!tool || !isLive(tool) || !content || !getToolDefinition(slug)) return null
  return { tool, content }
}

// ✅ GENERATE STATIC PATHS
export async function generateStaticParams() {
  return tools.filter((t) => pageFor(t.slug)).map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = pageFor(slug)
  if (!page) return {}

  return pageMetadata({
    title: page.content.title,
    description: page.content.metaDescription,
    path: `/tools/${slug}`,
  })
}

// ✅ PAGE WRAPPER (Next.js 16: params is a Promise)
export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const page = pageFor(slug)
  if (!page) notFound()

  return <ToolPage slug={slug} category={page.tool.category} content={page.content} />
}
