import { Suspense } from "react"
import ClientTool from "./ClientTool"
import type { Metadata } from "next"

/* 🔥 CRITICAL FIX (prevents prerender crash) */
export const dynamic = "force-dynamic"

/* ✅ NEXT-LEVEL SEO METADATA */
export const metadata: Metadata = {
  metadataBase: new URL("https://mockapis.in"),

  title: {
    default: "URL Encoder & Decoder Tool – Free Online Encode/Decode",
    template: "%s | Mock APIs",
  },

  description:
    "Free URL encoder and decoder tool. Encode URLs, decode query strings, and convert special characters instantly online.",

  keywords: [
    "url encoder",
    "url decoder",
    "encode url online",
    "decode url online",
    "url encode javascript",
    "url decode tool",
  ],

  alternates: {
    canonical: "/tools/url-encoder-decoder",
  },

  openGraph: {
    title: "URL Encoder & Decoder Tool",
    description:
      "Encode or decode URLs instantly online with our free developer tool.",
    url: "/tools/url-encoder-decoder",
    siteName: "Mock APIs",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "URL Encoder & Decoder Tool",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "URL Encoder & Decoder Tool",
    description:
      "Free online tool to encode and decode URLs instantly.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
}

/* ✅ Wrapper (avoids direct hook conflict) */
function ToolWrapper() {
  return <ClientTool />
}

export default function Page() {
  return (
    <>
      {/* ✅ FIX: Suspense + Wrapper */}
      <Suspense fallback={<div className="p-6 text-center">Loading tool...</div>}>
        <ToolWrapper />
      </Suspense>

      {/* 🔥 ALL SCHEMAS */}
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
                  item: "https://mockapis.in",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Tools",
                  item: "https://mockapis.in/tools",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "URL Encoder & Decoder",
                  item: "https://mockapis.in/tools/url-encoder-decoder",
                },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "URL Encoder & Decoder Tool",
              url: "https://mockapis.in/tools/url-encoder-decoder",
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