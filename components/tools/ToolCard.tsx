import Link from "next/link"

export default function ToolCard({ tool }: any) {
  return (
    <Link href={`/tools/${tool.slug}`}>
      <div className="group h-full p-5 rounded-2xl border border-gray-200 dark:border-gray-800 
      bg-white dark:bg-gray-900 hover:shadow-xl transition-all duration-300">

        <div className="text-lg font-semibold mb-2 group-hover:text-green-600">
          {tool.name}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {tool.description}
        </p>

        <span className="text-green-600 text-sm font-medium">
          Open Tool →
        </span>
      </div>
    </Link>
  )
}