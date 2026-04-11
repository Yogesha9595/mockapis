import Link from "next/link"
import { calculators } from "@/data/calculators"

export default function CalculatorsPage(){

return(

<div className="max-w-6xl mx-auto px-6 py-16">

<h1 className="text-4xl font-bold mb-10">
Free Online Calculators
</h1>

<div className="grid md:grid-cols-3 gap-6">

{calculators.map(calc => (

<Link
key={calc.slug}
href={`/calculators/${calc.slug}`}
className="border rounded-xl p-6 hover:shadow"
>

<h2 className="text-xl font-semibold">
{calc.name}
</h2>

<p className="text-gray-500 text-sm mt-2">
{calc.description}
</p>

</Link>

))}

</div>

</div>

)

}