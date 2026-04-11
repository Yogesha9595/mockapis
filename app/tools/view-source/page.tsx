import ToolClient from "./ToolClient"
import SeoContent from "./SeoContent"

export const metadata = {
  title: "View Page Source Online & HTML Beautifier Tool (Free)",
  description:
    "View, analyze, and beautify HTML source code of any website instantly. Free online HTML formatter with SEO insights, meta tags, headings, and structure analysis.",
  keywords: [
    "view page source online",
    "html beautifier",
    "html formatter",
    "inspect html code",
    "beautify html online",
    "view website source",
  ],
  alternates: {
    canonical: "https://yourdomain.com/tools/view-source",
  },
  openGraph: {
    title: "HTML Beautifier & View Source Tool",
    description:
      "Beautify and analyze HTML instantly with SEO insights and structured output.",
    url: "https://yourdomain.com/tools/view-source",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "View Page Source Tool",
    description: "Beautify and analyze HTML instantly",
  },
}

export default function Page() {
  return (
    <main className="bg-gray-50 min-h-screen">

      {/* 🔥 FULL WIDTH TOOL */}
      <section className="w-full px-4 md:px-6 xl:px-8 py-6">
        <ToolClient />
      </section>

      {/* 💰 AD */}
      <section className="max-w-6xl mx-auto px-4 my-10">
        <div className="bg-gray-100 text-center py-6 rounded-lg border text-sm text-gray-500">
          Ad Banner (728x90)
        </div>
      </section>

      {/* 🧠 SEO CONTENT */}
      <section className="bg-white border-t">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <SeoContent />
        </div>
      </section>

      {/* 💰 BOTTOM AD */}
      <section className="max-w-6xl mx-auto px-4 my-12">
        <div className="bg-gray-100 text-center py-6 rounded-lg border text-sm text-gray-500">
          Ad Slot
        </div>
      </section>

    </main>
  )
}