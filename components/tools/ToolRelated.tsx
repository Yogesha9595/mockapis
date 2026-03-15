import Link from "next/link"
import { tools } from "@/data/tools"

interface Props {
currentSlug: string
}

export default function ToolRelated({ currentSlug }: Props) {

const related = tools
.filter((tool) => tool.slug !== currentSlug)
.slice(0, 6)

return ( <div className="mt-16">


  <h2 className="text-2xl font-semibold mb-6">
    Related Tools
  </h2>

  <div className="grid md:grid-cols-3 gap-4">

    {related.map((tool) => (
      <Link
        key={tool.slug}
        href={`/tools/${tool.slug}`}
        className="border rounded p-4 hover:shadow"
      >
        <h3 className="font-semibold">
          {tool.name}
        </h3>

        <p className="text-sm text-gray-500">
          {tool.description}
        </p>
      </Link>
    ))}

  </div>

</div>


)
}
