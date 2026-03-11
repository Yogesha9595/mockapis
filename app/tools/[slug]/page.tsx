import { tools } from "@/data/tools"

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {

  const { slug } = await params

  const tool = tools.find((t) => t.slug === slug)

  if (!tool) {
    return <div className="p-10">Tool not found</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-10">

      <h1 className="text-3xl font-bold mb-4">
        {tool.name}
      </h1>

      <p className="mb-6 text-gray-600">
        {tool.description}
      </p>

      <textarea
        className="w-full border p-4 h-48 rounded"
        placeholder="Paste input here..."
      />

      <button className="mt-4 bg-black text-white px-6 py-2 rounded">
        Run Tool
      </button>

    </div>
  )
}