"use client"

import { useState } from "react"

interface Props {
toolName: string
}

export default function ToolExample({ toolName }: Props) {

const exampleJSON = `{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "Developer",
  "skills": ["JavaScript", "React", "Node.js"],
  "active": true
}`

const [copied, setCopied] = useState(false)

function copyExample() {
navigator.clipboard.writeText(exampleJSON)
setCopied(true)

setTimeout(() => {
  setCopied(false)
}, 2000)

}

return (

<div className="mt-16 max-w-4xl space-y-6">

  {/* Title */}
  <h2 className="text-2xl font-semibold">
    Example Usage
  </h2>


  {/* Steps */}
  <div>

    <h3 className="font-semibold mb-2">
      How to test the {toolName}
    </h3>

    <ol className="list-decimal pl-6 space-y-2 text-gray-700">

      <li>
        Copy the sample JSON data below.
      </li>

      <li>
        Paste it into the input editor of the {toolName}.
      </li>

      <li>
        Click the <strong>Format</strong> or processing button.
      </li>

      <li>
        View the formatted output in the result editor.
      </li>

    </ol>

  </div>


  {/* Example Code */}
  <div>

    <div className="flex justify-between items-center mb-2">

      <h3 className="font-semibold">
        Sample JSON Data
      </h3>

      <button
        onClick={copyExample}
        className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
      >
        {copied ? "Copied" : "Copy"}
      </button>

    </div>

    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">


{exampleJSON} </pre>


  </div>

</div>


)
}
