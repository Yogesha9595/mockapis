"use client"

import { useState } from "react"

export default function EndpointCard({ method, url }: any) {

  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 1500)

    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex justify-between items-center border p-3 rounded mb-3">

      <div>
        <span className="font-bold mr-3">{method}</span>
        <span>{url}</span>
      </div>

      <button
        onClick={copy}
        className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
      >
        {copied ? "Copied!" : "Copy"}
      </button>

    </div>
  )
}