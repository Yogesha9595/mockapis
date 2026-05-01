import { tools } from "@/data/tools"
import ToolPageClient from "./ToolPageClient"

// ✅ REQUIRED FOR STATIC EXPORT
export const dynamic = "force-static"

// ✅ GENERATE STATIC PATHS
export async function generateStaticParams() {
  return tools.map((tool) => ({
    slug: tool.slug,
  }))
}

// ✅ PAGE WRAPPER
export default function Page({
  params,
}: {
  params: { slug: string }
}) {
  return <ToolPageClient slug={params.slug} />
}