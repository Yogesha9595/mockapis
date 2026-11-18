import type { Metadata } from "next"
import ToolClient from "./ToolClient"
import SeoContent from "./SeoContent"
import { pageMetadata } from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  title: "View Page Source Online & HTML Beautifier Tool (Free)",
  description:
    "Beautify pasted HTML source, preview it safely, and inspect its structure, meta tags, headings and links. Free online HTML formatter that runs in your browser.",
  path: "/tools/view-source",
})

export default function Page() {
  return (
    <main className="bg-gray-50 min-h-screen">

      {/* 🔥 FULL WIDTH TOOL */}
      <section className="w-full px-4 md:px-6 xl:px-8 py-6">
        <ToolClient />
      </section>

      {/* 🧠 SEO CONTENT */}
      <section className="bg-white border-t">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <SeoContent />
        </div>
      </section>

    </main>
  )
}