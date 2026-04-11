"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function UniversalConverter() {

const [query,setQuery] = useState("")
const router = useRouter()

function handleConvert(){

const parts = query.toLowerCase().split(" ")

if(parts.length !== 4) return

const value = parts[0]
const from = parts[1]
const to = parts[3]

router.push(`/convert/${from}-to-${to}?value=${value}`)

}

return (

<div className="border rounded-xl p-6">

<input
type="text"
placeholder="Example: 10 km to miles"
value={query}
onChange={(e)=>setQuery(e.target.value)}
className="border p-3 w-full rounded"
/>

<button
onClick={handleConvert}
className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
>
Convert
</button>

</div>

)

}