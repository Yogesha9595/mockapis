import Link from "next/link"
import { unitCategories } from "@/data/unitCategories"

export default function UnitsPage(){

return(

<div className="max-w-6xl mx-auto px-6 py-16">

<h1 className="text-4xl font-bold mb-10">
Unit Converter
</h1>

<div className="grid md:grid-cols-3 gap-8">

{Object.keys(unitCategories).map((category)=>{

return(

<Link
key={category}
href={`/units/${category}`}
className="border p-6 rounded hover:shadow"
>

<h2 className="text-xl font-semibold capitalize">
{category} Converters
</h2>

<p className="text-gray-500 text-sm mt-2">
Convert {category} units instantly
</p>

</Link>

)

})}

</div>

</div>

)

}