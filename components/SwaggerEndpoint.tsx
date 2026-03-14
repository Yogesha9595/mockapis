"use client"

import { useState } from "react"

type Props = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  endpoint: string
  description: string
}

export default function SwaggerEndpoint({
  method,
  endpoint,
  description
}: Props) {

  const [open, setOpen] = useState(false)
  const [body, setBody] = useState("{}")
  const [response, setResponse] = useState("")
  const [status, setStatus] = useState<string | null>(null)
  const [time, setTime] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const execute = async () => {

    setLoading(true)

    const start = Date.now()

    try {

      const url = endpoint.startsWith("http")
        ? endpoint
        : endpoint

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

      setTime(end - start)
      setStatus(`${res.status} ${res.statusText}`)

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

  const methodColor: Record<string, string> = {
    GET: "bg-green-600",
    POST: "bg-blue-600",
    PUT: "bg-orange-500",
    PATCH: "bg-yellow-500",
    DELETE: "bg-red-600"
  }

  return (

    <div className="border rounded mb-4">

      {/* Endpoint Header */}

      <div
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50"
        onClick={() => setOpen(!open)}
      >

        <span className={`text-white px-3 py-1 rounded text-sm ${methodColor[method]}`}>
          {method}
        </span>

        <span className="font-mono text-sm">
          {endpoint}
        </span>

        <span className="text-gray-500 text-sm">
          {description}
        </span>

      </div>

      {/* Expanded Section */}

      {open && (

        <div className="border-t p-4">

          {(method === "POST" || method === "PUT" || method === "PATCH") && (

            <div className="mb-4">

              <p className="text-sm font-medium mb-2">
                Request Body
              </p>

              <textarea
                className="w-full border p-3 rounded font-mono text-sm h-32"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />

            </div>

          )}

          <button
            onClick={execute}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Executing..." : "Execute"}
          </button>

          {status && (

            <div className="mt-4 text-sm">

              <span className="mr-6">
                Status: <b>{status}</b>
              </span>

              <span>
                Time: <b>{time} ms</b>
              </span>

            </div>

          )}

          {response && (

            <div className="mt-4">

              <div className="flex justify-between mb-2">

                <p className="text-sm font-medium">
                  Response
                </p>

                <button
                  onClick={copyResponse}
                  className="text-xs bg-gray-200 px-2 py-1 rounded"
                >
                  Copy
                </button>

              </div>

              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {response}
              </pre>

            </div>

          )}

        </div>

      )}

    </div>

  )

}