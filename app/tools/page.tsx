import Link from "next/link"
import { tools } from "@/data/tools"

export default function ToolsPage() {
  return (
    <div className="max-w-6xl mx-auto p-10">

      <h1 className="text-3xl font-bold mb-10">
        Developer Tools
      </h1>

      <div className="grid grid-cols-3 gap-6">

        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="border p-6 rounded hover:shadow"
          >

            <h2 className="font-semibold mb-2">
              {tool.name}
            </h2>

            <p className="text-gray-500 text-sm">
              {tool.description}
            </p>

          </Link>
        ))}

      </div>

    </div>
  )
}