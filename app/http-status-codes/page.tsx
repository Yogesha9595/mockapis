const statusCodes = [
  { code: 200, title: "OK", description: "The request succeeded." },
  { code: 201, title: "Created", description: "The request succeeded and a resource was created." },
  { code: 204, title: "No Content", description: "The server processed the request but returned no content." },
  { code: 400, title: "Bad Request", description: "The server could not understand the request." },
  { code: 401, title: "Unauthorized", description: "Authentication is required." },
  { code: 403, title: "Forbidden", description: "The client does not have permission." },
  { code: 404, title: "Not Found", description: "The requested resource could not be found." },
  { code: 409, title: "Conflict", description: "The request conflicts with the current state." },
  { code: 500, title: "Internal Server Error", description: "The server encountered an unexpected condition." },
  { code: 503, title: "Service Unavailable", description: "The server is temporarily unable to handle the request." }
]

export default function StatusCodesPage() {

  return (
    <div className="max-w-5xl mx-auto p-10">

      <h1 className="text-3xl font-bold mb-6">
        HTTP Status Codes Reference
      </h1>

      <p className="text-gray-600 mb-10">
        Learn common HTTP status codes used in APIs and web development.
      </p>

      <div className="space-y-4">

        {statusCodes.map((s) => (

          <div
            key={s.code}
            className="border rounded p-5 hover:bg-gray-50"
          >

            <div className="flex items-center gap-4 mb-2">

              <span className="text-lg font-bold">
                {s.code}
              </span>

              <span className="text-gray-700 font-medium">
                {s.title}
              </span>

            </div>

            <p className="text-gray-600">
              {s.description}
            </p>

          </div>

        ))}

      </div>

    </div>
  )
}