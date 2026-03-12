import EndpointCard from "@/components/EndpointCard"

export default function APIs() {

  return (
    <div className="max-w-3xl mx-auto p-10">

      <h1 className="text-3xl font-bold mb-6">
        Mock API Endpoints
      </h1>

      <EndpointCard method="GET" url="/api/users" />
      <EndpointCard method="POST" url="/api/users" />

      <EndpointCard method="GET" url="/api/users/1" />
      <EndpointCard method="PUT" url="/api/users/1" />
      <EndpointCard method="PATCH" url="/api/users/1" />
      <EndpointCard method="DELETE" url="/api/users/1" />

      <EndpointCard method="POST" url="/api/login" />

    </div>
  )
}