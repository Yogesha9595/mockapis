import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { tools, isLive } from "@/data/tools"
import { pageMetadata } from "@/lib/site"

// ✅ REQUIRED FOR STATIC EXPORT
export const dynamic = "force-static"

// Only categories present in data/tools.ts exist; anything else is a real 404
export const dynamicParams = false

type PageProps = {
  params: Promise<{ category: string }>
}

function categoryTitle(category: string) {
  return category.charAt(0).toUpperCase() + category.slice(1) + " Tools"
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params

  // A category with no working tools is a list of placeholders: keep it out of search
  const hasLiveTool = tools.some((t) => t.category === category && isLive(t))

  return {
    ...pageMetadata({
      title: categoryTitle(category),
      description: `Explore free online ${category} tools for developers. Format, convert, encode, validate, and transform your data instantly.`,
      path: `/tools/category/${category}`,
    }),
    ...(hasLiveTool ? {} : { robots: { index: false, follow: true } }),
  }
}

// ✅ GENERATE STATIC PARAMS
export async function generateStaticParams() {
  const categories = Array.from(
    new Set(tools.map((tool) => tool.category))
  )

  return categories.map((category) => ({
    category,
  }))
}

// ✅ Next.js 16: params is a Promise
export default async function CategoryPage({ params }: PageProps) {

  const { category } = await params

  const categoryTools = tools.filter(
    (tool) => tool.category === category
  )

  if (categoryTools.length === 0) notFound()

  const title = categoryTitle(category)

  return (

    <div className="max-w-6xl mx-auto px-4 py-12">

      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-4">
        {title}
      </h1>

      <p className="text-gray-600 mb-10">
        Explore free online {category} tools for developers.
        Format, convert, encode, validate, and transform your
        data instantly using these lightweight utilities.
      </p>

      {/* Tools Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {categoryTools.map((tool) =>
          isLive(tool) ? (

            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="border rounded-lg p-5 hover:shadow transition bg-white"
            >

              <h2 className="font-semibold mb-2">
                {tool.name}
              </h2>

              <p className="text-sm text-gray-500">
                {tool.description}
              </p>

            </Link>

          ) : (

            /* Unfinished tool: visible but not linked, same as the /tools hub */
            <div
              key={tool.slug}
              className="border rounded-lg p-5 bg-white opacity-60 cursor-not-allowed"
            >

              <h2 className="font-semibold mb-2">
                {tool.name}
              </h2>

              <p className="text-sm text-gray-500">
                {tool.description}
              </p>

              <div className="mt-3 text-xs text-gray-400">
                Coming soon
              </div>

            </div>

          )
        )}

      </div>

      {/* Empty state */}
      {categoryTools.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          No tools found in this category.
        </div>
      )}

    </div>
  )
}