"use client"

import { useState } from "react"
import Link from "next/link"
import { tools } from "@/data/tools"

type Tool = {
slug: string
name: string
category: string
}

export default function ToolSidebar() {

const [openCategory, setOpenCategory] = useState<string | null>(null)

// Group tools by category
const categories = tools.reduce((acc: Record<string, Tool[]>, tool: Tool) => {


if (!acc[tool.category]) {
  acc[tool.category] = []
}

acc[tool.category].push(tool)

return acc


}, {})

const toggleCategory = (category: string) => {
setOpenCategory(openCategory === category ? null : category)
}

return (

<aside className="space-y-6 text-sm">

  {/* Developer Tools */}
  <div className="border rounded-xl p-5 bg-white shadow-sm">

    <h3 className="font-semibold mb-4 text-gray-800">
      Tool Categories
    </h3>

    <div className="space-y-3">

      {Object.entries(categories).map(([category, toolsList]) => {

        const title =
          category.charAt(0).toUpperCase() + category.slice(1)

        const visibleTools = toolsList.slice(0, 4)

        return (

          <div key={category}>

            <button
              onClick={() => toggleCategory(category)}
              className="flex justify-between items-center w-full font-medium text-left hover:text-blue-600"
            >
              {title} Tools

              <span className="text-gray-400">
                {openCategory === category ? "−" : "+"}
              </span>
            </button>

            {openCategory === category && (

              <ul className="mt-2 pl-3 space-y-2 text-gray-600">

                {visibleTools.map((tool) => (

                  <li key={tool.slug}>

                    <Link
                      href={`/tools/${tool.slug}`}
                      className="hover:text-blue-600"
                    >
                      {tool.name}
                    </Link>

                  </li>

                ))}

                <li>

                  <Link
                    href={`/tools/category/${category}`}
                    className="text-blue-600 text-xs"
                  >
                    View all →
                  </Link>

                </li>

              </ul>

            )}

          </div>

        )

      })}

    </div>

  </div>

</aside>


)
}
