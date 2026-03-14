"use client"

import { useState, useEffect } from "react"

export default function ApiWidget() {

  const [method, setMethod] = useState("GET")
  const [endpoint, setEndpoint] = useState("/api/users")

  const [body, setBody] = useState(`{
  "name": "Jane Doe",
  "email": "jane@example.com"
}`)

  const [response, setResponse] = useState("// Response will appear here")
  const [rawResponse, setRawResponse] = useState("")

  const [status, setStatus] = useState<number | null>(null)
  const [time, setTime] = useState<number | null>(null)
  const [size, setSize] = useState<number | null>(null)

  const [pretty, setPretty] = useState(true)
  const [loading, setLoading] = useState(false)

  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {

    const params = new URLSearchParams(window.location.search)

    const m = params.get("method")
    const e = params.get("endpoint")
    const b = params.get("body")

    if (m) setMethod(m.toUpperCase())
    if (e) setEndpoint(e)

    if (b) {
      try {
        setBody(JSON.stringify(JSON.parse(b), null, 2))
      } catch {
        setBody(b)
      }
    }

  }, [])

  async function sendRequest() {

    setLoading(true)

    const start = performance.now()

    try {

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body:
          method === "POST" ||
          method === "PUT" ||
          method === "PATCH" ||
          method === "DELETE"
            ? body
            : undefined
      })

      const end = performance.now()

      const text = await res.text()

      setStatus(res.status)
      setTime(Math.round(end - start))

      const kb = new Blob([text]).size / 1024
      setSize(Number(kb.toFixed(2)))

      setRawResponse(text)

      try {
        const json = JSON.parse(text)
        setResponse(JSON.stringify(json, null, 2))
      } catch {
        setResponse(text)
      }

      setHistory((prev) => {
        const item = `${method} ${endpoint}`
        const updated = [item, ...prev.filter(i => i !== item)]
        return updated.slice(0, 5)
      })

    } catch {

      setResponse("Error connecting to API")

    }

    setLoading(false)
  }

  function copyResponse() {
    navigator.clipboard.writeText(response)
  }

  function clearResponse() {
    setResponse("// Response cleared")
    setRawResponse("")
    setStatus(null)
    setTime(null)
    setSize(null)
  }

  function downloadJSON() {

    const blob = new Blob([response], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "api-response.json"
    a.click()
  }

  function shareURL() {

    const params = new URLSearchParams()

    params.set("method", method)
    params.set("endpoint", endpoint)

    if (method !== "GET") {
      params.set("body", body)
    }

    const url = `${window.location.origin}?${params.toString()}`

    navigator.clipboard.writeText(url)

    alert("Shareable request URL copied!")
  }

  function runExample(e: string) {
    setEndpoint(e)
    setTimeout(sendRequest, 100)
  }

  return (

    <section className="py-24">

      <div className="text-center mb-10 max-w-2xl mx-auto">

        <h2 className="text-3xl font-bold mb-3">
          Test a Mock API Instantly
        </h2>

        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Send API requests directly in your browser and inspect responses instantly.
          Perfect for developers, students and frontend testing.
        </p>

      </div>


      <div className="bg-[#0b0f19] border border-gray-800 rounded-xl p-6 shadow-xl shadow-green-900/20">

        <div className="flex items-center gap-2 mb-6">

          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>

          <span className="ml-4 text-xs text-gray-400">
            mockapis playground
          </span>

        </div>


        {/* Example endpoints */}

        <div className="flex flex-wrap gap-2 mb-4">

          {[
            "/api/users",
            "/api/users/1",
            "/api/users?delay=3"
          ].map((e)=>(
            <button
              key={e}
              onClick={()=>runExample(e)}
              className="text-xs px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-gray-200 transition"
            >
              {e}
            </button>
          ))}

        </div>


        {/* Request history */}

        {history.length > 0 && (

          <div className="mb-4 text-xs text-gray-400">

            Recent:

            <div className="flex flex-wrap gap-2 mt-2">

              {history.map((h,i)=>(
                <button
                  key={i}
                  onClick={()=>{
                    const [m,e] = h.split(" ")
                    setMethod(m)
                    setEndpoint(e)
                  }}
                  className="px-2 py-1 bg-gray-800 rounded text-gray-300 hover:bg-gray-700"
                >
                  {h}
                </button>
              ))}

            </div>

          </div>

        )}


        <div className="grid md:grid-cols-2 gap-6">

          {/* REQUEST */}

          <div>

            <p className="text-xs text-gray-400 mb-2">REQUEST</p>

            <input
              value={endpoint}
              onChange={(e)=>setEndpoint(e.target.value)}
              placeholder="/api/users"
              className="w-full bg-[#0f172a] border border-gray-700 rounded-md px-3 py-2 text-sm mb-3 text-white"
            />

            <div className="flex gap-2 mb-3">

              {["GET","POST","PUT","PATCH","DELETE"].map((m)=>(
                <button
                  key={m}
                  onClick={()=>setMethod(m)}
                  className={`px-3 py-1 text-xs rounded-md border transition
                  ${method===m
                    ? "bg-green-600 border-green-600 text-white"
                    : "border-gray-600 text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  {m}
                </button>
              ))}

            </div>


            <textarea
              value={body}
              onChange={(e)=>setBody(e.target.value)}
              disabled={method==="GET"}
              className="w-full h-36 bg-[#0f172a] border border-gray-700 rounded-md p-3 text-xs font-mono text-green-400 disabled:opacity-40"
            />


            <button
              onClick={sendRequest}
              disabled={loading}
              className="mt-4 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition py-2 rounded-md text-sm font-medium shadow-lg"
            >
              {loading ? "Sending Request..." : "Send Request →"}
            </button>

          </div>


          {/* RESPONSE */}

          <div>

            <div className="flex justify-between items-center mb-2">

              <p className="text-xs text-gray-400">RESPONSE</p>

              <div className="flex flex-wrap gap-2">

                <button
                  onClick={()=>setPretty(!pretty)}
                  className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-gray-200 rounded-md"
                >
                  {pretty ? "Raw" : "Pretty"}
                </button>

                <button
                  onClick={copyResponse}
                  className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                >
                  Copy
                </button>

                <button
                  onClick={downloadJSON}
                  className="text-xs px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
                >
                  Download
                </button>

                <button
                  onClick={clearResponse}
                  className="text-xs px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md"
                >
                  Clear
                </button>

                <button
                  onClick={shareURL}
                  className="text-xs px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md"
                >
                  Share URL
                </button>

              </div>

            </div>


            {(status || time) && (

              <div className="flex gap-4 text-xs text-gray-400 mb-2">

                <span>
                  Status:
                  <span className="ml-1 bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                    {status}
                  </span>
                </span>

                <span>
                  Time:
                  <span className="ml-1 text-green-400">{time} ms</span>
                </span>

                <span>
                  Size:
                  <span className="ml-1 text-green-400">{size} KB</span>
                </span>

              </div>

            )}

            <pre className="bg-[#020617] border border-gray-800 rounded-md p-4 text-xs text-green-400 h-[230px] overflow-auto">

{pretty ? response : rawResponse}

            </pre>

          </div>

        </div>

      </div>

    </section>
  )
}