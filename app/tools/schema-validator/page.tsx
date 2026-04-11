import type { Metadata } from "next"
import ToolClient from "./ToolClient"
import SeoContent from "./SeoContent"

export const metadata: Metadata = {
  title: "Schema Markup Validator Tool (JSON-LD + URL Checker)",
  description:
    "Validate schema markup instantly. Check JSON-LD and structured data from any URL. Free SEO schema validator with scoring and insights.",

  keywords: [
    "schema validator",
    "json ld validator",
    "structured data testing tool",
    "schema markup checker",
    "rich results test alternative",
  ],

  openGraph: {
    title: "Schema Markup Validator Tool",
    description:
      "Validate JSON-LD and structured data instantly with SEO scoring.",
    url: "https://mockapis.in/tools/schema-validator",
    siteName: "MockAPIs",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Schema Markup Validator Tool",
    description:
      "Validate JSON-LD and structured data instantly with SEO scoring.",
  },

  alternates: {
    canonical: "https://mockapis.in/tools/schema-validator",
  },
}

export default function Page() {
  return (
    <>
      {/* HERO TOOL (FULL WIDTH) */}
      <section className="w-full min-h-screen bg-[#f8fafc]">
        <div className="max-w-[1400px] mx-auto">
          <ToolClient />
        </div>
      </section>

      {/* SEO CONTENT */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <SeoContent />
      </section>

      {/* STRUCTURED DATA (VERY IMPORTANT FOR SEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Schema Markup Validator Tool",
              applicationCategory: "DeveloperTool",
              operatingSystem: "All",
              description:
                "Validate JSON-LD and structured data instantly with this free schema validator tool.",
              url: "https://mockapis.in/tools/schema-validator",
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What is a schema validator?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "A schema validator checks structured data like JSON-LD to ensure it follows proper format and SEO guidelines.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Is this schema validator free?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, this tool is completely free to use for validating schema markup.",
                  },
                },
              ],
            },
          ]),
        }}
      />
    </>
  )
}