import { units } from "@/data/units"
import Link from "next/link"

// ✅ REQUIRED FOR STATIC EXPORT
export const dynamic = "force-static"

// ✅ GENERATE STATIC PARAMS
export async function generateStaticParams() {
  return Object.keys(units).map((category) => ({
    category,
  }))
}

type PageProps = {
  params: {
    category: string
  }
}

// 🔥 SEO metadata (safe)
export function generateMetadata({ params }: PageProps) {
  const category = params.category || "converter"

  return {
    title: `${category} Converter – Free Online Tool`,
    description: `Convert ${category} units instantly using our free online converter.`,
  }
}

export default function ConverterCategoryPage({ params }: PageProps) {
  const category = params.category

  const categoryUnits =
    category === "temperature"
      ? ["celsius", "fahrenheit", "kelvin"]
      : units[category as keyof typeof units]

  // ✅ fail-safe guard
  if (!categoryUnits) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-semibold">
          Category not found
        </h1>
      </div>
    )
  }

  const unitList = Array.isArray(categoryUnits)
    ? categoryUnits
    : Object.keys(categoryUnits)

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">

      {/* Heading */}
      <h1 className="text-3xl font-bold mb-6 capitalize">
        {category} Converter
      </h1>

      {/* Unit List */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">

        <h2 className="text-lg font-semibold">
          Available Units
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {unitList.map((unit) => (
            <div
              key={unit}
              className="border p-3 rounded text-center"
            >
              {unit}
            </div>
          ))}
        </div>

      </div>

      {/* 🔥 SEO LINKS */}
      <div className="mt-10">

        <h2 className="text-lg font-semibold mb-4">
          Popular Conversions
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-blue-600">

          {unitList.slice(0, 6).map((from) =>
            unitList.slice(0, 6).map((to) => {
              if (from === to) return null

              return (
                <Link
                  key={`${from}-${to}`}
                  href={`/convert/${from}-to-${to}`}
                  className="hover:underline"
                >
                  {from} → {to}
                </Link>
              )
            })
          )}

        </div>

      </div>

      {/* 💰 Monetization */}
      <div className="mt-12 text-center text-gray-400">
        Ad Space
      </div>

    </div>
  )
}