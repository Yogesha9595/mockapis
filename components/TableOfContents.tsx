"use client"

import { useEffect, useState } from "react"

type Props = {
  headings: string[]
}

export default function TableOfContents({ headings }: Props) {
  const [active, setActive] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      let current = ""

      headings.forEach((heading) => {
        const id = heading.toLowerCase().replace(/\s+/g, "-")
        const el = document.getElementById(id)

        if (el) {
          const rect = el.getBoundingClientRect()

          if (rect.top <= 120) {
            current = id
          }
        }
      })

      setActive(current)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [headings])

  if (!headings.length) return null

  return (
    <aside className="hidden lg:block w-64 sticky top-24 h-fit">

      <div className="border-l pl-4">

        <h3 className="text-xs font-semibold text-gray-400 uppercase mb-4">
          On this page
        </h3>

        <ul className="space-y-2 text-sm">
          {headings.map((heading, index) => {
            const id = heading.toLowerCase().replace(/\s+/g, "-")

            return (
              <li key={index}>
                <a
                  href={`#${id}`}
                  className={`block leading-6 transition-all ${
                    active === id
                      ? "text-blue-600 font-medium border-l-2 border-blue-600 pl-2 -ml-2"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {heading}
                </a>
              </li>
            )
          })}
        </ul>

      </div>

    </aside>
  )
}