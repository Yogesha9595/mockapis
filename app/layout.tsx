import "./globals.css"
import type { Metadata } from "next"

import Header from "@/components/Header"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: "MockAPIs – Free Mock APIs for Developers",
  description:
    "MockAPIs provides free mock REST APIs for developers to test applications, learn APIs, and prototype faster.",
  keywords: [
    "mock api",
    "dummy api",
    "api testing",
    "rest api playground",
    "api for testing",
    "mock rest api",
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (

<html lang="en">

<body className="min-h-screen bg-white text-black dark:bg-black dark:text-white">

{/* HEADER */}

<Header />

{/* PAGE CONTENT */}

<main className="min-h-[70vh]">
{children}
</main>

{/* FOOTER */}

<Footer />

</body>

</html>

  )
}