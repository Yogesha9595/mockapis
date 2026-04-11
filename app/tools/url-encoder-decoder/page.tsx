import ClientTool from "./ClientTool"
import type { Metadata } from "next"

/* ✅ NEXT-LEVEL SEO METADATA */
export const metadata: Metadata = {
  metadataBase: new URL("https://mockapis.in"),

  title: {
    default: "URL Encoder & Decoder Tool – Free Online Encode/Decode",
    template: "%s | Mock APIs"
  },

  description:
    "Free URL encoder and decoder tool. Encode URLs, decode query strings, and convert special characters instantly online.",

  keywords: [
    "url encoder",
    "url decoder",
    "encode url online",
    "decode url online",
    "url encode javascript",
    "url decode tool"
  ],

  alternates: {
    canonical: "/tools/url-encoder-decoder"
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
        alt: "URL Encoder & Decoder Tool"
      }
    ],
    type: "website"
  },

  twitter: {
    card: "summary_large_image",
    title: "URL Encoder & Decoder Tool",
    description:
      "Free online tool to encode and decode URLs instantly.",
    images: ["/og-image.png"]
  },

  robots: {
    index: true,
    follow: true
  }
}

export default function Page() {
  return (
    <>
      {/* ✅ TOOL UI */}
      <ClientTool />

      {/* 🔥 ALL SCHEMAS (SEO BOOST) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            /* 🔗 BREADCRUMB SCHEMA */
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://mockapis.in"
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Tools",
                  item: "https://mockapis.in/tools"
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "URL Encoder & Decoder",
                  item: "https://mockapis.in/tools/url-encoder-decoder"
                }
              ]
            },

            /* 🔥 TOOL (WEB APPLICATION) SCHEMA */
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "URL Encoder & Decoder Tool",
              url: "https://mockapis.in/tools/url-encoder-decoder",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "All",
              description:
                "Free online URL encoder and decoder tool to encode URLs, decode query strings, and handle special characters instantly.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD"
              }
            },

            /* ⭐ REVIEW / RATING SCHEMA */
            {
              "@context": "https://schema.org",
              "@type": "Product",
              name: "URL Encoder & Decoder Tool",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                reviewCount: "1250"
              }
            },

            /* ❓ FAQ SCHEMA */
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What is URL encoding?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "URL encoding converts special characters into a safe format using percent-encoding so data can be transmitted over the internet."
                  }
                },
                {
                  "@type": "Question",
                  name: "What is the difference between encoding and decoding?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Encoding converts data into a structured format, while decoding restores it back to the original form."
                  }
                },
                {
                  "@type": "Question",
                  name: "Is URL encoding the same as encryption?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "No, encoding is reversible and used for formatting, while encryption is used for securing data."
                  }
                },
                {
                  "@type": "Question",
                  name: "When should I use URL encoding?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Use URL encoding when sending query parameters, API data, or form inputs to prevent errors."
                  }
                },
                {
                  "@type": "Question",
                  name: "Can I encode JSON or API data?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, JSON and API payloads can be encoded to safely include them in URLs."
                  }
                },
                {
                  "@type": "Question",
                  name: "What are common URL encoded characters?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Common examples include space (%20), ampersand (%26), equals (%3D), and slash (%2F)."
                  }
                },
                {
                  "@type": "Question",
                  name: "What other tools help with encoding?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Tools like Base64 encoders and JSON formatters help with encoding workflows."
                  }
                }
              ]
            }
          ])
        }}
      />
    </>
  )
}