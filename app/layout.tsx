import "./globals.css";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "@/lib/site";
import { googleTagsBootstrapScript, gaConfigScript, gaMeasurementId } from "@/lib/analytics";

/* AdSense publisher (site-wide loader only; no ad units are placed) */
const ADSENSE_CLIENT = "ca-pub-1954376162691867";

/* GA4 ID from NEXT_PUBLIC_GA_ID; null unless set, valid, and a production build */
const GA_ID = gaMeasurementId();

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter", // consumed by --font-sans in app/globals.css
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: `${SITE_NAME} – Free Developer Tools & Utilities`,
    template: `%s | ${SITE_NAME}`,
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

  authors: [{ name: `${SITE_NAME} Team` }],
  creator: SITE_NAME,
  publisher: SITE_NAME,

  // NOTE: no `alternates.canonical` or `openGraph.url` here on purpose.
  // Values set in the root layout are inherited by every page that doesn't
  // override them, which previously made every page canonicalize to "/".
  // Pages declare their own canonical via `pageMetadata()` in lib/site.ts.

  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} – Free Developer Tools & Utilities`,
    description:
      "All-in-one platform for developers: mock APIs, JSON tools, compilers, converters, and more.",
    images: [{ url: DEFAULT_OG_IMAGE, alt: SITE_NAME }],
  },

  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} – Free Developer Tools`,
    description:
      "Free developer tools including mock APIs, JSON tools, compilers, and converters.",
    images: [DEFAULT_OG_IMAGE],
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
  themeColor: "#f9fafb", // matches --background (light is the default theme)
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* GOOGLE ADSENSE account verification (with public/ads.txt) */}
        <meta name="google-adsense-account" content={ADSENSE_CLIENT} />

        {/* CONSENT MODE DEFAULTS, then the AdSense loader — in that order, guaranteed.
            Denied in the EEA, UK and Switzerland; granted elsewhere. No ad units are placed.
            (A plain async <script> would be hoisted above this by React; see lib/analytics.ts.) */}
        <script id="google-tags-bootstrap" dangerouslySetInnerHTML={{ __html: googleTagsBootstrapScript(ADSENSE_CLIENT) }} />

        {/* THEME INIT (runs before paint, no flicker). Light is the default;
            dark applies only when the visitor chose it with the toggle.
            Keep in sync with components/ThemeToggle.tsx. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}})();`,
          }}
        />
      </head>

      <body
        className={`${inter.className} ${inter.variable} min-h-screen flex flex-col bg-background text-foreground antialiased overflow-x-hidden`}
      >
        {/* HEADER */}
        <Header />

        {/* MAIN */}
        <main id="main-content" tabIndex={-1} className="flex-grow w-full focus:outline-none max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
          {children}
        </main>

        {/* FOOTER */}
        <Footer />

        {/* GOOGLE ANALYTICS 4 (production builds with NEXT_PUBLIC_GA_ID only) */}
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4-config" strategy="afterInteractive">
              {gaConfigScript(GA_ID)}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}