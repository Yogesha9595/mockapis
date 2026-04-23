import { calculators } from "@/data/calculators";
import Link from "next/link";
import { notFound } from "next/navigation";

import { calculatorConfig } from "@/config/calculators";
import CalculatorRenderer from "@/components/calculators/systems/CalculatorRenderer";

// ✅ Static export
export function generateStaticParams() {
  return calculators.map((calc) => ({
    slug: calc.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const calc = calculators.find((c) => c.slug === slug);

  if (!calc) {
    return {
      title: "Calculator Not Found",
    };
  }

  return {
    title: `${calc.name} – Free Online Calculator`,
    description: `Use ${calc.name} instantly with charts & insights.`,
  };
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const calc = calculators.find((c) => c.slug === slug);
  if (!calc) notFound();

  const config = calculatorConfig[slug];

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-10">

      {/* 🔥 3 COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr_300px] gap-6">

        {/* ================= LEFT SIDEBAR ================= */}
        <aside className="hidden lg:block sticky top-24 h-fit">
          <div className="bg-white dark:bg-gray-900 border rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-sm text-gray-500">
              Calculators
            </h3>

            {calculators.map((c) => (
              <Link
                key={c.slug}
                href={`/calculators/${c.slug}`}
                className={`
                  block px-3 py-2 rounded-lg text-sm transition
                  ${
                    slug === c.slug
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }
                `}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </aside>

        {/* ================= MAIN HERO ================= */}
        <main className="space-y-8">

          {/* HERO TITLE */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{calc.name}</h1>
            <p className="text-gray-500">
              Calculate instantly with interactive charts
            </p>
          </div>

          {/* 🔥 FULL WIDTH CALCULATOR */}
          <div className="bg-white dark:bg-gray-900 border rounded-2xl p-6 shadow-sm">
            {config ? (
              <CalculatorRenderer config={config} />
            ) : (
              <p>Coming soon...</p>
            )}
          </div>

          {/* 🔥 SEO ARTICLE (BELOW ONLY) */}
          <div className="prose max-w-none dark:prose-invert">
            <h2>{calc.name} Guide</h2>
            <p>
              Use this calculator to get accurate results instantly with
              interactive charts, amortization breakdown, and export features.
            </p>
          </div>
        </main>

        {/* ================= RIGHT SIDEBAR ================= */}
        <aside className="hidden lg:block sticky top-24 h-fit space-y-6">

          {/* 🔥 ADS SLOT */}
          <div className="bg-gray-100 dark:bg-gray-800 border rounded-xl h-64 flex items-center justify-center text-sm text-gray-400">
            Ad Space
          </div>

          {/* 🔥 INTERNAL SEO LINKS */}
          <div className="bg-white dark:bg-gray-900 border rounded-xl p-4">
            <h3 className="font-semibold mb-3 text-sm">
              Popular Calculators
            </h3>

            <ul className="space-y-2 text-sm">
              <li><Link href="/calculators/sip">SIP Calculator</Link></li>
              <li><Link href="/calculators/emi">EMI Calculator</Link></li>
              <li><Link href="/calculators/fd">FD Calculator</Link></li>
              <li><Link href="/calculators/ppf">PPF Calculator</Link></li>
              <li><Link href="/calculators/bmi">BMI Calculator</Link></li>
            </ul>
          </div>

          {/* 🔥 CTA */}
          <div className="bg-blue-600 text-white rounded-xl p-4 text-center">
            <p className="text-sm">Boost your productivity</p>
            <button className="mt-2 bg-white text-blue-600 px-4 py-2 rounded-lg text-sm">
              Explore Tools
            </button>
          </div>

        </aside>
      </div>
    </div>
  );
}