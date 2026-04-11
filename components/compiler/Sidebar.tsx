"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { languages } from "@/data/compilerLanguages"

// 🔥 ICON HELPER
function getIcon(lang: string) {
  const map: Record<string, string> = {
    python: "python",
    javascript: "javascript",
    java: "java",
    cpp: "cplusplus",
    c: "c",
    go: "go",
    rust: "rust",
    php: "php"
  }

  const icon = map[lang]

  return icon
    ? `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${icon}/${icon}-original.svg`
    : "https://cdn-icons-png.flaticon.com/512/2721/2721297.png"
}

export default function Sidebar() {

  const pathname = usePathname()

  return (
    <div className="w-[70px] bg-zinc-900 border-r border-zinc-800 flex flex-col items-center py-3 gap-2 relative">

      {Object.keys(languages).map((lang) => {

        // ✅ FIXED ACTIVE CHECK
        const isActive = pathname === `/compiler/${lang}`

        return (
          <div key={lang} className="relative group">

            <Link
              href={`/compiler/${lang}`}
              className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-600 shadow-[0_0_25px_rgba(59,130,246,0.7)] scale-105 border border-blue-400"
                    : "hover:bg-zinc-800 hover:scale-105"
                }`}
            >

              {/* ICON */}
              <img
                src={getIcon(lang)}
                alt={languages[lang].name}
                className="w-6 h-6 object-contain"
                onError={(e: any) => {
                  e.target.src = "https://cdn-icons-png.flaticon.com/512/2721/2721297.png"
                }}
              />

            </Link>

            {/* 🔥 TOOLTIP (FIXED) */}
            <span
              className="absolute left-14 top-1/2 -translate-y-1/2 
              bg-black text-xs px-2 py-1 rounded-md 
              opacity-0 group-hover:opacity-100 transition 
              whitespace-nowrap pointer-events-none z-50"
            >
              {languages[lang].name}
            </span>

          </div>
        )
      })}

    </div>
  )
}