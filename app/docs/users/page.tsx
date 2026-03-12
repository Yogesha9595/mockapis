import EndpointCard from "@/components/EndpointCard"

export default function UsersDocs() {

  return (
    <div className="max-w-4xl mx-auto p-10">

      <h1 className="text-3xl font-bold mb-6">
        Users API
      </h1>

      <p className="mb-6 text-gray-600">
        Use the Users API to list, create, update, and delete users.
      </p>

      <h2 className="text-xl font-semibold mb-4">Endpoints</h2>

      <EndpointCard method="GET" url="/api/users" />
      <EndpointCard method="POST" url="/api/users" />

      <EndpointCard method="GET" url="/api/users/1" />
      <EndpointCard method="PUT" url="/api/users/1" />
      <EndpointCard method="PATCH" url="/api/users/1" />
      <EndpointCard method="DELETE" url="/api/users/1" />

      <h2 className="text-xl font-semibold mt-10 mb-4">
        Example Response
      </h2>

      <pre className="bg-gray-100 p-4 rounded overflow-auto">
{`{
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}`}
      </pre>

      <h2 className="text-xl font-semibold mt-10 mb-4">
        Delay Simulation
      </h2>

      <p className="mb-4 text-gray-600">
        Add a delay parameter to simulate slow APIs.
      </p>

      <EndpointCard method="GET" url="/api/users?delay=3" />

    </div>
  )
}