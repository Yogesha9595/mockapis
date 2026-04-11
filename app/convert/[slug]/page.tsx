import Link from "next/link"
import { units } from "@/data/units"
import { convertUnit } from "@/lib/converterEngine"

type PageProps = {
  params: {
    slug: string
  }
  searchParams?: {
    value?: string
  }
}

// ✅ Helper: safe slug parsing
function parseSlug(slug: string) {
  if (!slug.includes("-to-")) return null
  const [from, to] = slug.split("-to-")
  if (!from || !to) return null
  return { from, to }
}

// 🔥 SEO Metadata
export function generateMetadata({ params }: PageProps) {
  const parsed = parseSlug(params.slug)

  if (!parsed) {
    return {
      title: "Unit Converter",
      description: "Free online unit converter",
    }
  }

  const { from, to } = parsed

  return {
    title: `${from} to ${to} Converter – Free Online Tool`,
    description: `Convert ${from} to ${to} instantly using our free online unit converter. Fast, accurate and easy to use.`,
  }
}

export default function ConvertPage({ params, searchParams }: PageProps) {
  const parsed = parseSlug(params.slug)

  if (!parsed) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-semibold">
          Invalid conversion URL
        </h1>
      </div>
    )
  }

  const { from: fromUnit, to: toUnit } = parsed

  const inputValue = Number(searchParams?.value ?? 1)

  let category: string | null = null

  // 🔍 detect category safely
  for (const key in units) {
    const group = units[key as keyof typeof units]

    if (
      group &&
      typeof group === "object" &&
      fromUnit in group &&
      toUnit in group
    ) {
      category = key
      break
    }
  }

  // ❌ invalid case
  if (!category) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-semibold">
          Conversion not supported
        </h1>
      </div>
    )
  }

  // ✅ conversion
  const result = convertUnit({
    category,
    value: inputValue,
    from: fromUnit,
    to: toUnit,
  })

  const formattedResult = Number(result.toFixed(6))

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">

      {/* 🔥 SEO Heading */}
      <h1 className="text-3xl font-bold mb-6 capitalize">
        {inputValue} {fromUnit} to {toUnit}
      </h1>

      <div className="border rounded-xl p-6 bg-white shadow-sm space-y-4">

        {/* ✅ Result */}
        <p className="text-lg">
          <span className="font-semibold">{inputValue}</span> {fromUnit}
          {" = "}
          <span className="font-semibold text-blue-600">
            {formattedResult}
          </span>{" "}
          {toUnit}
        </p>

        {/* 🔗 Input → reload page (SEO trick) */}
        <form method="GET">
          <input
            type="number"
            name="value"
            defaultValue={inputValue}
            className="border p-3 rounded w-full"
            placeholder={`Enter ${fromUnit}`}
          />
        </form>

        {/* 🔥 SEO CONTENT BLOCK (VERY IMPORTANT) */}
        <div className="text-gray-600 text-sm leading-6 space-y-2">
          <p>
            Use this free online tool to convert <strong>{fromUnit}</strong> to{" "}
            <strong>{toUnit}</strong> quickly and accurately.
          </p>
          <p>
            Enter any value to instantly get the converted result. This converter
            supports multiple unit categories including length, weight,
            temperature, speed, and data.
          </p>
        </div>

      </div>

      {/* 🔥 INTERNAL LINKS (SEO BOOST) */}
      <div className="mt-10">

        <h2 className="text-lg font-semibold mb-4">
          Related Conversions
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-blue-600">

          <Link href={`/convert/${fromUnit}-to-${fromUnit}`}>
            {fromUnit} → {fromUnit}
          </Link>

          <Link href={`/convert/${toUnit}-to-${fromUnit}`}>
            {toUnit} → {fromUnit}
          </Link>

          <Link href={`/convert/${fromUnit}-to-${toUnit}`}>
            {fromUnit} → {toUnit}
          </Link>

        </div>

      </div>

      {/* 💰 Monetization */}
      <div className="mt-12 text-center text-gray-400">
        Ad Space
      </div>

    </div>
  )
}