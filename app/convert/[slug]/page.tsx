import Link from "next/link"
import { units } from "@/data/units"
import { convertUnit } from "@/lib/converterEngine"

// ✅ derive type from units (NO external file needed)
type UnitCategory = keyof typeof units

type PageProps = {
  params: {
    slug: string
  }
  searchParams?: {
    value?: string
  }
}

// ✅ Safe slug parsing
function parseSlug(slug: string): { from: string; to: string } | null {
  if (!slug.includes("-to-")) return null

  const [from, to] = slug.split("-to-")
  if (!from || !to) return null

  return {
    from: from.toLowerCase(),
    to: to.toLowerCase(),
  }
}

// ✅ Detect category safely
function getCategory(
  from: string,
  to: string
): UnitCategory | null {
  for (const key in units) {
    const typedKey = key as UnitCategory
    const group = units[typedKey]

    if (group && typeof group === "object") {
      if (from in group && to in group) {
        return typedKey
      }
    }
  }
  return null
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
    description: `Convert ${from} to ${to} instantly using our free online unit converter.`,
  }
}

export default function ConvertPage({
  params,
  searchParams,
}: PageProps) {
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

  // ✅ Safe number parsing
  const inputValue = Number(searchParams?.value ?? 1)
  const safeValue = isNaN(inputValue) ? 1 : inputValue

  const category = getCategory(fromUnit, toUnit)

  if (!category) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-semibold">
          Conversion not supported
        </h1>
      </div>
    )
  }

  // ✅ SAFE conversion (no type error now)
  const result = convertUnit({
    category,
    value: safeValue,
    from: fromUnit,
    to: toUnit,
  })

  const formattedResult = Number(result.toFixed(6))

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">

      <h1 className="text-3xl font-bold mb-6 capitalize">
        {safeValue} {fromUnit} to {toUnit}
      </h1>

      <div className="border rounded-xl p-6 bg-white shadow-sm space-y-4">

        <p className="text-lg">
          <span className="font-semibold">{safeValue}</span> {fromUnit}
          {" = "}
          <span className="font-semibold text-blue-600">
            {formattedResult}
          </span>{" "}
          {toUnit}
        </p>

        <form method="GET">
          <input
            type="number"
            name="value"
            defaultValue={safeValue}
            className="border p-3 rounded w-full"
            placeholder={`Enter ${fromUnit}`}
          />
        </form>

        <div className="text-gray-600 text-sm leading-6 space-y-2">
          <p>
            Convert <strong>{fromUnit}</strong> to{" "}
            <strong>{toUnit}</strong> instantly using our free tool.
          </p>
          <p>
            Supports length, weight, temperature, speed, and data conversions.
          </p>
        </div>

      </div>

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

      <div className="mt-12 text-center text-gray-400">
        Ad Space
      </div>

    </div>
  )
}