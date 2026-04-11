"use client"

import Link from "next/link"
import { Send } from "lucide-react"

export default function FloatingCTA() {
  return (
    <div className="fixed bottom-20 right-4 sm:right-6 z-50">

      {/* PULSE RING */}
      <div className="absolute inset-0 rounded-full bg-blue-500 opacity-30 blur-xl animate-ping"></div>

      {/* BUTTON */}
      <Link
        href="https://t.me/devutilities_lab"
        target="_blank"
        className="relative flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 hover:shadow-xl text-white px-5 py-3 rounded-full shadow-lg transition-all duration-300"
      >
        <Send size={18} />
        <span className="hidden sm:inline font-medium">
          Join Telegram
        </span>
      </Link>

    </div>
  )
}