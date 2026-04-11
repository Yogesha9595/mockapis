import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://devutilitieslab.com"),

  title: {
    default: "DevUtilities Lab – Free Developer Tools & Utilities",
    template: "%s | DevUtilities Lab",
  },

  description:
    "Free developer tools including mock APIs, JSON formatter, converters, compilers, and API playground to build faster.",

  keywords: [
    "developer tools",
    "mock api",
    "json formatter",
    "api testing",
    "online compiler",
    "unit converter",
    "free dev tools",
    "api playground",
    "json validator",
  ],

  authors: [{ name: "DevUtilities Lab Team" }],
  creator: "DevUtilities Lab",
  publisher: "DevUtilities Lab",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: "https://devutilitieslab.com",
    siteName: "DevUtilities Lab",
    title: "DevUtilities Lab – Free Developer Tools & Utilities",
    description:
      "All-in-one platform for developers: mock APIs, JSON tools, compilers, converters, and more.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DevUtilities Lab",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "DevUtilities Lab – Free Developer Tools",
    description:
      "Free developer tools including mock APIs, JSON tools, compilers, and converters.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#020617", // ✅ match dark theme
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ✅ DARK MODE INIT (NO FLICKER) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  const stored = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (stored === 'dark' || (!stored && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>

      <body
        className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground antialiased overflow-x-hidden`}
      >
        {/* HEADER */}
        <Header />

        {/* MAIN */}
        <main className="flex-grow w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
          {children}
        </main>

        {/* FOOTER */}
        <Footer />
      </body>
    </html>
  );
}