import type { Metadata } from "next"
import { pageMetadata } from "@/lib/site"
import ToolsHub from "./ToolsHub"

/* Server wrapper so /tools has its own metadata; the interactive hub is a client component. */
export const metadata: Metadata = pageMetadata({
  title: "All Developer Tools",
  description:
    "Browse every free tool on DevUtilities Lab: JSON formatter and validator, Base64 and URL encoders, JWT decoder, UUID generator, timestamp converter, text tools and HTML, CSS and XML minifiers.",
  path: "/tools",
})

export default function ToolsPage() {
  return <ToolsHub />
}
