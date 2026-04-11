"use client"

import Link from "next/link"

export default function StickyBar() {
  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-black text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        
        <p className="text-sm text-gray-300 text-center sm:text-left">
          🚀 Build faster with free developer tools
        </p>

        <Link
          href="/"
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-sm font-medium transition"
        >
          Explore Tools
        </Link>

      </div>
    </div>
  )
}