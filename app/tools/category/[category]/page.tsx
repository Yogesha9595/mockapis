import Link from "next/link"
import { tools } from "@/data/tools"

// ✅ REQUIRED FOR STATIC EXPORT
export const dynamic = "force-static"

// ✅ GENERATE STATIC PARAMS
export async function generateStaticParams() {
  const categories = Array.from(
    new Set(tools.map((tool) => tool.category))
  )

  return categories.map((category) => ({
    category,
  }))
}

type Tool = {
  slug: string
  name: string
  description?: string
  category: string
}

export default function CategoryPage({
  params,
}: {
  params: { category: string } // ✅ FIXED
}) {

  const { category } = params // ✅ FIXED (no await)

  if (!category) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold">
          Category not found
        </h1>
      </div>
    )
  }

  const categoryTools = tools.filter(
    (tool: Tool) => tool.category === category
  )

  const title =
    category.charAt(0).toUpperCase() +
    category.slice(1) +
    " Tools"

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

        {categoryTools.map((tool) => (

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

        ))}

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