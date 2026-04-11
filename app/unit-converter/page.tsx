"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { convertUnit } from "@/lib/converterEngine"
import { units } from "@/data/units"
import { unitCategories } from "@/data/unitCategories"

type UnitCategory = keyof typeof units | "temperature"

export default function UnitConverterPage() {
  const [category, setCategory] = useState<UnitCategory>("length")
  const [value, setValue] = useState(1)
  const [from, setFrom] = useState("meter")
  const [to, setTo] = useState("kilometer")
  const [result, setResult] = useState(0)
  const [copied, setCopied] = useState(false)

  // ✅ SAFE + TYPE CORRECT
  const getUnits = (cat: UnitCategory): string[] => {
    if (cat === "temperature") {
      return ["celsius", "fahrenheit", "kelvin"]
    }

    const safeCategory = cat as keyof typeof units
    return Object.keys(units[safeCategory] || {})
  }

  const currentUnits = getUnits(category)

  useEffect(() => {
    if (!from || !to) return

    try {
      const res = convertUnit({ category, value, from, to })
      setResult(Number(res.toFixed(6)))
    } catch (err) {
      console.error("Conversion error:", err)
    }
  }, [category, value, from, to])

  const handleCategoryChange = (newCategory: string) => {
    const safeCategory = newCategory as UnitCategory
    setCategory(safeCategory)

    const unitList = getUnits(safeCategory)

    setFrom(unitList[0])
    setTo(unitList[1] || unitList[0])
  }

  const handleSwap = () => {
    setFrom(to)
    setTo(from)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(result))
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error("Copy failed:", err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold text-center mb-2">
          Free Unit Converter Tool
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Convert length, weight, temperature, data and more instantly.
        </p>

        <div className="bg-white shadow-lg rounded-2xl p-6 space-y-6">

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-black"
            >
              {unitCategories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Converter */}
          <div className="grid md:grid-cols-2 gap-4">

            {/* FROM */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">From</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full p-3 border rounded-lg"
              />
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full p-3 border rounded-lg"
              >
                {currentUnits.map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>
            </div>

            {/* TO */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">To</label>
              <div className="relative">
                <input
                  value={result}
                  readOnly
                  className="w-full p-3 border rounded-lg bg-gray-100 pr-16"
                />
                <button
                  onClick={handleCopy}
                  className="absolute right-2 top-2 text-xs bg-black text-white px-2 py-1 rounded"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full p-3 border rounded-lg"
              >
                {currentUnits.map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap */}
          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              className="px-6 py-2 bg-black text-white rounded-lg hover:scale-105 transition"
            >
              🔄 Swap Units
            </button>
          </div>

        </div>

        {/* SEO LINKS */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-4">
            Popular Conversions
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-blue-600">
            <Link href="/convert/meter-to-kilometer">meter → kilometer</Link>
            <Link href="/convert/km-to-mile">km → mile</Link>
            <Link href="/convert/kg-to-pound">kg → pound</Link>
            <Link href="/convert/mb-to-gb">mb → gb</Link>
            <Link href="/convert/mph-to-km-h">mph → km/h</Link>
            <Link href="/convert/celsius-to-fahrenheit">°C → °F</Link>
          </div>
        </div>

        {/* SEO CONTENT */}
        <div className="mt-10 text-gray-600 text-sm leading-6">
          <h2 className="font-semibold mb-2">About This Tool</h2>
          <p>
            This free online unit converter helps you convert between different
            measurement units quickly and accurately.
          </p>
        </div>

      </div>
    </div>
  )
}