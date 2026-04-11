import Link from "next/link"
import { unitCategories } from "@/data/unitCategories"

export default function CategoryPage({ params }) {

const converters = unitCategories[params.category]

if (!converters) {
return <div className="py-20 text-center">Category not found</div>
}

return (

<div className="max-w-6xl mx-auto px-6 py-16">

<h1 className="text-3xl font-bold mb-8 capitalize">
{params.category} Converters
</h1>

<div className="grid md:grid-cols-3 gap-6">

{converters.map((conversion:string)=>{

const [from,to] = conversion.split("-to-")

return(

<Link
key={conversion}
href={`/convert/${conversion}`}
className="border p-5 rounded hover:shadow"
>

<h2 className="font-semibold">

{from} to {to}

</h2>

<p className="text-sm text-gray-500">

Convert {from} to {to} instantly

</p>

</Link>

)

})}

</div>

</div>

)

}