"use client"

import { useState } from "react"

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export default function Playground() {

  const [method, setMethod] = useState<Method>("GET")
  const [endpoint, setEndpoint] = useState("/api/users")

  const [body, setBody] = useState(`{
  "name": "Alice",
  "email": "alice@test.com"
}`)

  const [response, setResponse] = useState("")
  const [headers, setHeaders] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<number | null>(null)
  const [time, setTime] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const methodColors: Record<Method, string> = {
    GET: "bg-green-600",
    POST: "bg-blue-600",
    PUT: "bg-orange-500",
    PATCH: "bg-yellow-500",
    DELETE: "bg-red-600"
  }

  const sendRequest = async () => {

    setLoading(true)

    try {

      const url = endpoint.startsWith("http")
        ? endpoint
        : endpoint

      const start = Date.now()

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body:
          method === "GET" || method === "DELETE"
            ? undefined
            : body
      })

      const end = Date.now()

      setStatus(res.status)
      setTime(end - start)

      const headerObj: Record<string, string> = {}

      res.headers.forEach((value, key) => {
        headerObj[key] = value
      })

      setHeaders(headerObj)

      let data

      try {
        data = await res.json()
      } catch {
        data = { message: "No response body" }
      }

      setResponse(JSON.stringify(data, null, 2))

    } catch {

      setResponse("Request failed")

    }

    setLoading(false)

  }

  const copyResponse = () => {
    if (!response) return
    navigator.clipboard.writeText(response)
  }

  const statusColor =
    status && status >= 200 && status < 300
      ? "text-green-600"
      : "text-red-600"

  return (

    <div className="max-w-5xl mx-auto p-10">

      <h1 className="text-3xl font-bold mb-8">
        API Playground
      </h1>

      {/* Request Panel */}

      <div className="border rounded mb-6">

        <div className="flex items-center gap-3 p-4 border-b">

          <span
            className={`text-white px-3 py-1 rounded text-sm ${methodColors[method]}`}
          >
            {method}
          </span>

          <input
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className="flex-1 border rounded p-2 font-mono text-sm"
          />

          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as Method)}
            className="border rounded p-2"
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>PATCH</option>
            <option>DELETE</option>
          </select>

          <button
            onClick={sendRequest}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Executing..." : "Execute"}
          </button>

        </div>

        {(method === "POST" || method === "PUT" || method === "PATCH") && (

          <div className="p-4">

            <p className="text-sm mb-2 font-medium">
              Request Body
            </p>

            <textarea
              className="w-full border rounded p-3 font-mono text-sm h-40"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />

          </div>

        )}

      </div>

      {/* Status Info */}

      {(status !== null || time !== null) && (

        <div className="mb-4 text-sm">

          <span className={`mr-6 ${statusColor}`}>
            Status: <b>{status}</b>
          </span>

          <span>
            Time: <b>{time} ms</b>
          </span>

        </div>

      )}

      {/* Response */}

      <div className="mb-6">

        <div className="flex justify-between items-center mb-2">

          <p className="font-medium">
            Response
          </p>

          {response && (

            <button
              onClick={copyResponse}
              className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
            >
              Copy
            </button>

          )}

        </div>

        <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
          {response || "Execute a request to see the response"}
        </pre>

      </div>

      {/* Response Headers */}

      {Object.keys(headers).length > 0 && (

        <div>

          <p className="font-medium mb-2">
            Response Headers
          </p>

          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(headers, null, 2)}
          </pre>

        </div>

      )}

    </div>

  )

}