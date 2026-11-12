import { Suspense } from "react"
import ClientTool from "./ClientTool"
import type { Metadata } from "next"
import { absoluteUrl, pageMetadata } from "@/lib/site"

/* ✅ STATIC EXPORT SAFE */
export const dynamic = "force-static"

const PATH = "/tools/url-encoder-decoder"

/* ✅ SEO METADATA (root template appends " | DevUtilities Lab") */
export const metadata: Metadata = pageMetadata({
  title: "URL Encoder & Decoder Tool – Free Online Encode/Decode",
  description:
    "Free URL encoder and decoder tool. Encode URLs, decode query strings, and convert special characters instantly online.",
  path: PATH,
  keywords: [
    "url encoder",
    "url decoder",
    "encode url online",
    "decode url online",
    "url encode javascript",
    "url decode tool",
  ],
})

/* ✅ Wrapper (safe for client hooks) */
function ToolWrapper() {
  return <ClientTool />
}

export default function Page() {
  return (
    <>
      <Suspense fallback={<div className="p-6 text-center">Loading tool...</div>}>
        <ToolWrapper />
      </Suspense>

      {/* ✅ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: absoluteUrl("/"),
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Tools",
                  item: absoluteUrl("/tools"),
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "URL Encoder & Decoder",
                  item: absoluteUrl(PATH),
                },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "URL Encoder & Decoder Tool",
              url: absoluteUrl(PATH),
              applicationCategory: "DeveloperApplication",
              operatingSystem: "All",
              description:
                "Free online URL encoder and decoder tool.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            },
          ]),
        }}
      />
    </>
  )
}