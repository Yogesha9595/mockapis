export default function WhatIsAPI() {

  return (
    <div className="max-w-3xl mx-auto p-10">

      <h1 className="text-3xl font-bold mb-6">
        What is an API?
      </h1>

      <p className="mb-4 text-gray-700">
        API stands for Application Programming Interface. It allows different
        software applications to communicate with each other.
      </p>

      <p className="mb-4 text-gray-700">
        APIs are commonly used in web development to send and receive data
        between a client (frontend) and a server (backend).
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">
        Example API Request
      </h2>

      <pre className="bg-gray-100 p-4 rounded overflow-auto">
{`GET /api/users`}
      </pre>

      <h2 className="text-xl font-semibold mt-8 mb-3">
        Example Response
      </h2>

      <pre className="bg-gray-100 p-4 rounded overflow-auto">
{`{
 "data": [
   {
     "id": 1,
     "name": "John Doe"
   }
 ]
}`}
      </pre>

    </div>
  )
}