"use client"

import { useEffect, useState } from "react"

const apiExamples = [
`$ curl https://mockapis.dev/api/users/1

{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "Developer"
}`,

`$ curl https://mockapis.dev/api/products

[
  {
    "id": 101,
    "name": "Wireless Mouse",
    "price": 29.99
  }
]`,

`$ curl https://mockapis.dev/api/orders/501

{
  "orderId": 501,
  "status": "Shipped",
  "total": 149.50
}`
]

export default function ApiCodeTerminal() {

  const [text, setText] = useState("")
  const [exampleIndex, setExampleIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {

    const current = apiExamples[exampleIndex]

    if (charIndex < current.length) {

      const timeout = setTimeout(() => {
        setText(prev => prev + current[charIndex])
        setCharIndex(charIndex + 1)
      }, 10)

      return () => clearTimeout(timeout)

    } else {

      setTimeout(() => {
        setText("")
        setCharIndex(0)
        setExampleIndex((exampleIndex + 1) % apiExamples.length)
      }, 2000)

    }

  }, [charIndex, exampleIndex])

  return (

    <div className="bg-black rounded-xl shadow-xl p-6 font-mono text-sm text-green-400">

      <div className="flex gap-2 mb-4">
        <span className="w-3 h-3 bg-red-500 rounded-full"></span>
        <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
      </div>

      <pre className="whitespace-pre-wrap overflow-auto">
        {text}
        <span className="animate-pulse">|</span>
      </pre>

    </div>

  )
}