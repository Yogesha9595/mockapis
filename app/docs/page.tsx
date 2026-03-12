import Link from "next/link"

export default function Docs() {
  return (
    <div className="max-w-5xl mx-auto p-10">

      <h1 className="text-3xl font-bold mb-4">
        API Documentation
      </h1>

      <p className="text-gray-600 mb-10">
        Explore the MockAPIs platform. Test endpoints, learn API concepts,
        and use our mock APIs for development and testing.
      </p>

      <div className="grid md:grid-cols-2 gap-5">

        <Link
          href="/docs/users"
          className="block border p-5 rounded-lg hover:bg-gray-50 transition"
        >
          <h2 className="font-semibold text-lg mb-1">
            Users API
          </h2>
          <p className="text-sm text-gray-600">
            Learn how to list, create, update and delete users.
          </p>
        </Link>

        <Link
          href="/docs/auth"
          className="block border p-5 rounded-lg hover:bg-gray-50 transition"
        >
          <h2 className="font-semibold text-lg mb-1">
            Authentication API
          </h2>
          <p className="text-sm text-gray-600">
            Example login and authentication endpoints.
          </p>
        </Link>

        <Link
          href="/http-status-codes"
          className="block border p-5 rounded-lg hover:bg-gray-50 transition"
        >
          <h2 className="font-semibold text-lg mb-1">
            HTTP Status Codes
          </h2>
          <p className="text-sm text-gray-600">
            Understand common API response codes like 200, 404, and 500.
          </p>
        </Link>

        <Link
          href="/playground"
          className="block border p-5 rounded-lg hover:bg-gray-50 transition"
        >
          <h2 className="font-semibold text-lg mb-1">
            API Playground
          </h2>
          <p className="text-sm text-gray-600">
            Test API endpoints directly in your browser.
          </p>
        </Link>

        <Link
          href="/apis"
          className="block border p-5 rounded-lg hover:bg-gray-50 transition"
        >
          <h2 className="font-semibold text-lg mb-1">
            Mock API Endpoints
          </h2>
          <p className="text-sm text-gray-600">
            Browse all available mock API endpoints.
          </p>
        </Link>

      </div>

    </div>
  )
}