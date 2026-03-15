"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

export default function Footer() {

  const [open, setOpen] = useState(false)

  return (

    <footer className="bg-black text-gray-400 mt-24 relative">

      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* GRID */}
        <div className="grid md:grid-cols-4 gap-10">

          {/* BRAND */}
          <div>

            <h3 className="text-white text-lg font-semibold mb-3">
              MockAPIs
            </h3>

            <p className="text-sm leading-relaxed">
              MockAPIs provides free developer tools and mock APIs to help
              developers test, format, convert, and debug data quickly.
              All tools run directly in the browser with no installation required.
            </p>

          </div>


          {/* RESOURCES */}
          <div>

            <h3 className="text-white text-lg font-semibold mb-3">
              Resources
            </h3>

            <ul className="space-y-2 text-sm">

              <li>
                <Link href="/docs" className="hover:text-white transition">
                  Documentation
                </Link>
              </li>

              <li>
                <Link href="/apis" className="hover:text-white transition">
                  API List
                </Link>
              </li>

              <li>
                <Link href="/playground" className="hover:text-white transition">
                  API Playground
                </Link>
              </li>

              <li>
                <Link href="/learn" className="hover:text-white transition">
                  Learn APIs
                </Link>
              </li>

              <li>
                <Link href="/tools" className="hover:text-white transition">
                  Developer Tools
                </Link>
              </li>

            </ul>

          </div>


          {/* TOOL CATEGORIES */}
          <div>

            <h3 className="text-white text-lg font-semibold mb-3">
              Tool Categories
            </h3>

            <ul className="space-y-2 text-sm">

              <li>
                <Link href="/tools/category/json" className="hover:text-white transition">
                  JSON Tools
                </Link>
              </li>

              <li>
                <Link href="/tools/category/encoding" className="hover:text-white transition">
                  Encoding Tools
                </Link>
              </li>

              <li>
                <Link href="/tools/category/developer" className="hover:text-white transition">
                  Developer Utilities
                </Link>
              </li>

              <li>
                <Link href="/tools/category/formatter" className="hover:text-white transition">
                  Code Formatters
                </Link>
              </li>

              <li>
                <Link href="/tools/category/text" className="hover:text-white transition">
                  Text Tools
                </Link>
              </li>

            </ul>

          </div>


          {/* SUPPORT */}
          <div className="relative">

            <h3 className="text-white text-lg font-semibold mb-3">
              Support
            </h3>

            <p className="text-sm mb-4">
              If MockAPIs helps your development workflow,
              consider supporting the project.
            </p>

            {/* SUPPORT BUTTON */}
            <button
    onClick={() => setOpen(!open)}
    className="bg-yellow-500 hover:bg-yellow-400 transition text-black font-medium px-4 py-2 rounded"
  >
    🎁 Support Project
  </button>

  {/* QR POPUP */}
  {open && (

    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 w-[280px] bg-white text-black rounded-lg shadow-xl p-5 z-50">

      <h4 className="font-semibold mb-2 text-sm">
        Support this project ☕
      </h4>

      <p className="text-xs text-gray-600 mb-3">
        If MockAPIs helped you, consider buying me a coffee.
      </p>

      <div className="flex justify-center">

        <Image
          src="/coffee-qr.png"
          alt="Support QR"
          width={180}
          height={180}
        />

      </div>

      <p className="text-xs text-gray-500 text-center mt-3">
        Thank you for supporting open tools ❤️
      </p>

    </div>

  )}


          </div>

        </div>


        {/* COMPLIANCE LINKS */}
        <div className="flex flex-wrap justify-center gap-6 mt-14 text-sm">

          <Link href="/about" className="hover:text-white transition">
            About
          </Link>

          <Link href="/contact" className="hover:text-white transition">
            Contact
          </Link>

          <Link href="/privacy-policy" className="hover:text-white transition">
            Privacy Policy
          </Link>

          <Link href="/terms" className="hover:text-white transition">
            Terms of Service
          </Link>

          <Link href="/disclaimer" className="hover:text-white transition">
            Disclaimer
          </Link>

        </div>


        {/* CONTACT EMAIL */}
        <div className="text-center text-sm text-gray-500 mt-6">

          Contact: support@mockapis.in

        </div>


        {/* COPYRIGHT */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">

          © {new Date().getFullYear()} MockAPIs — Built with ❤️ for developers.
          Free tools to simplify development workflows worldwide.

        </div>

      </div>

    </footer>

  )

}