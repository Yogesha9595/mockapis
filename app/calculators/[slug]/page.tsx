import { calculators } from "@/data/calculators"
import Link from "next/link"

type Props = {
  params: { slug: string }
}

export function generateStaticParams() {

  return calculators.map((calc) => ({
    slug: calc.slug
  }))

}

export function generateMetadata({ params }: Props) {

  const calc = calculators.find(c => c.slug === params.slug)

  return {
    title: `${calc?.name} – Free Online Calculator`,
    description: `Use our free ${calc?.name} to calculate results instantly. Fast, accurate and easy to use.`,
  }

}

export default function CalculatorPage({ params }: Props) {

  const calc = calculators.find(c => c.slug === params.slug)

  if (!calc) {
    return <div className="py-20 text-center">Calculator not found</div>
  }

  return (

    <div className="max-w-4xl mx-auto px-6 py-16">

      <h1 className="text-3xl font-bold mb-6">
        {calc.name}
      </h1>

      <p className="text-gray-600 mb-6">
        {calc.description}
      </p>

      <div className="border rounded-xl p-6 bg-white">

        {/* Calculator UI placeholder */}

        <p className="text-gray-500">
          Interactive calculator will appear here.
        </p>

      </div>

      {/* SEO Content */}

      <div className="mt-12 prose max-w-none">

        <h2>What is {calc.name}?</h2>

        <p>
          The {calc.name.toLowerCase()} is a free online tool designed to help users
          perform quick and accurate calculations. Whether you are managing finances,
          solving mathematical problems, or analyzing health metrics, online
          calculators simplify complex calculations into instant results.
        </p>

        <h2>How to Use the {calc.name}</h2>

        <ul>
          <li>Enter the required values into the input fields</li>
          <li>Click the calculate button</li>
          <li>Instantly view your result</li>
        </ul>

        <h2>Popular Calculators</h2>

        <ul>

          <li>
            <Link href="/calculators/percentage">Percentage Calculator</Link>
          </li>

          <li>
            <Link href="/calculators/age">Age Calculator</Link>
          </li>

          <li>
            <Link href="/calculators/bmi">BMI Calculator</Link>
          </li>

          <li>
            <Link href="/calculators/loan">Loan Calculator</Link>
          </li>

        </ul>

      </div>

    </div>

  )
}