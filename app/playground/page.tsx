"use client"

import { useState } from "react"

export default function Playground() {

  const [method, setMethod] = useState("GET")
  const [endpoint, setEndpoint] = useState("/api/users")
  const [body, setBody] = useState(`{
  "name": "Alice",
  "email": "alice@test.com"
}`)
  const [response, setResponse] = useState("")
  const [status, setStatus] = useState<number | null>(null)
  const [time, setTime] = useState<number | null>(null)

  const sendRequest = async () => {

    try {

      const url = endpoint.startsWith("http")
        ? endpoint
        : `http://localhost:3000${endpoint}`

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

      const data = await res.json()

      setResponse(JSON.stringify(data, null, 2))

    } catch (err) {
      setResponse("Error: " + err)
    }

  }

  return (
    <div className="max-w-4xl mx-auto p-10">

      <h1 className="text-3xl font-bold mb-8">
        API Playground
      </h1>

      {/* Request controls */}
      <div className="flex gap-4 mb-4">

        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="border p-2"
        >
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>PATCH</option>
          <option>DELETE</option>
        </select>

        <input
          type="text"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          className="border p-2 flex-1"
        />

        <button
          onClick={sendRequest}
          className="bg-black text-white px-5 py-2 rounded"
        >
          Send
        </button>

      </div>

      {/* Body editor */}
      {(method === "POST" || method === "PUT" || method === "PATCH") && (
        <textarea
          className="w-full border p-3 mb-6 h-40 font-mono"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      )}

      {/* Status info */}
      {(status || time) && (
        <div className="mb-4 text-sm text-gray-600">
          Status: {status} | Time: {time} ms
        </div>
      )}

      {/* Response viewer */}
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {response}
      </pre>

    </div>
  )
}