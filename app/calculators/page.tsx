import Link from "next/link";
import { calculators } from "@/data/calculators";

// ✅ Force static (Cloudflare safe)
export const dynamic = "force-static";

// ✅ SEO Metadata (improved)
export const metadata = {
  title: "Free Online Calculators – Fast & Accurate Tools",
  description:
    "Explore free online calculators for finance, health, math, and more. Fast, accurate, and easy-to-use tools like BMI, EMI, age, and percentage calculators.",
  keywords: [
    "free calculators",
    "online calculator",
    "BMI calculator",
    "EMI calculator",
    "loan calculator",
    "percentage calculator",
  ],
};

// ✅ Types (future-proof)
type Calculator = {
  slug: string;
  name: string;
  description: string;
};

// ✅ Page Component
export default function CalculatorsPage() {
  const data: Calculator[] = calculators || [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Heading */}
      <header className="mb-10">
        <h1 className="text-4xl font-bold mb-4">
          Free Online Calculators
        </h1>

        <p className="text-gray-600 max-w-2xl">
          Use our collection of free online calculators for finance, health,
          math, and everyday calculations. Simple, fast, and accurate tools
          designed to save your time.
        </p>
      </header>

      {/* Grid */}
      <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data.length > 0 ? (
          data.map((calc) => (
            <Link
              key={calc.slug}
              href={`/calculators/${calc.slug}`}
              className="group block border rounded-xl p-6 hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Open ${calc.name}`}
            >
              <h2 className="text-xl font-semibold group-hover:text-blue-600 transition">
                {calc.name}
              </h2>

              <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                {calc.description}
              </p>

              <span className="inline-block mt-4 text-sm text-blue-500 group-hover:underline">
                Use Calculator →
              </span>
            </Link>
          ))
        ) : (
          <p className="text-gray-500 col-span-full">
            No calculators available right now.
          </p>
        )}
      </section>

      {/* SEO Content */}
      <section className="mt-16 prose max-w-none">
        <h2>Why Use Online Calculators?</h2>

        <p>
          Online calculators help you perform complex calculations instantly
          without manual effort. Whether you need to calculate loan EMI,
          body mass index (BMI), percentages, or age, these tools provide
          quick and accurate results.
        </p>

        <h2>Popular Categories</h2>

        <ul>
          <li>Finance Calculators (Loan, EMI, Interest)</li>
          <li>Health Calculators (BMI, BMR, Ideal Weight)</li>
          <li>Math Calculators (Percentage, Ratio, Exponent)</li>
          <li>Date & Time Calculators</li>
        </ul>
      </section>
    </div>
  );
}