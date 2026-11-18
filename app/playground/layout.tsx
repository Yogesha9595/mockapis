import type { Metadata } from "next"

/* The page is a client component, so its robots rule lives here.
   Out of search results: the mock API routes it calls are not deployed. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  return children
}
