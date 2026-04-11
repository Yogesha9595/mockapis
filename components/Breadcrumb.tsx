import Link from "next/link"

export default function Breadcrumb({
  title,
}: {
  title: string
}) {
  return (
    <div className="text-sm text-gray-500 mb-4">
      <Link href="/" className="hover:underline">
        Home
      </Link>{" "}
      /{" "}
      <Link href="/learn" className="hover:underline">
        Learn
      </Link>{" "}
      / <span className="text-gray-700">{title}</span>
    </div>
  )
}