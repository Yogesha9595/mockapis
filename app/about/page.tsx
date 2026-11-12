import type { Metadata } from "next"
import { pageMetadata } from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  title: "About DevUtilities Lab",
  description:
    "DevUtilities Lab is a developer-focused platform providing free, privacy-friendly tools for working with APIs, JSON, encoding, formatting, and data transformation.",
  path: "/about",
})

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-8">

      <h1 className="text-3xl font-bold">
        About DevUtilities Lab
      </h1>

      <p>
        DevUtilities Lab is a developer-focused platform that provides free
        tools and utilities to help developers work with APIs, JSON,
        encoding, formatting, and data transformation.
      </p>

      <p>
        Our mission is to create fast, simple, and privacy-friendly
        tools that run directly in the browser.
      </p>

      <p>
        These tools are designed for developers, students,
        API testers, and engineers who need quick utilities
        during development.
      </p>

    </div>
  )
}