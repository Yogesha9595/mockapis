"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"

export default function SupportButton() {

  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (

    <div ref={ref} className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm bg-yellow-400 hover:bg-yellow-500 transition px-3 py-1 rounded font-medium"
      >
        🎁 Support
      </button>

      {open && (

        <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg p-4 shadow-lg z-50">

          <p className="text-sm font-semibold mb-1">
            Support this project ☕
          </p>

          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            If MockAPIs helped you, consider buying me a coffee.
          </p>

          <div className="flex justify-center">

            <Image
              src="/coffee-qr.png"
              alt="Buy me a coffee QR"
              width={160}
              height={160}
              className="rounded"
            />

          </div>

          <p className="text-xs text-center mt-3 text-gray-500 dark:text-gray-400">
            Thank you for supporting open tools ❤️
          </p>

        </div>

      )}

    </div>

  )

}