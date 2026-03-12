import Link from "next/link"

export default function Learn() {
  return (
    <div className="max-w-5xl mx-auto p-10">

      <h1 className="text-3xl font-bold mb-4">
        API Learning Hub
      </h1>

      <p className="text-gray-600 mb-10">
        Learn the fundamentals of APIs, HTTP requests, and modern web development.
      </p>

      <div className="grid md:grid-cols-2 gap-5">

        <Link href="/learn/what-is-api" className="border p-5 rounded hover:bg-gray-50">
          <h2 className="font-semibold text-lg">What is an API?</h2>
          <p className="text-sm text-gray-600">
            Understand how APIs work and why they are used.
          </p>
        </Link>

        <Link href="/learn/crud-api" className="border p-5 rounded hover:bg-gray-50">
          <h2 className="font-semibold text-lg">CRUD Operations in APIs</h2>
          <p className="text-sm text-gray-600">
            Learn create, read, update and delete operations.
          </p>
        </Link>

        <Link href="/learn/idempotent-api" className="border p-5 rounded hover:bg-gray-50">
          <h2 className="font-semibold text-lg">What is Idempotent API?</h2>
          <p className="text-sm text-gray-600">
            Understand idempotent HTTP methods.
          </p>
        </Link>

        <Link href="/learn/rest-vs-graphql" className="border p-5 rounded hover:bg-gray-50">
          <h2 className="font-semibold text-lg">REST vs GraphQL</h2>
          <p className="text-sm text-gray-600">
            Compare REST APIs and GraphQL APIs.
          </p>
        </Link>

      </div>

    </div>
  )
}