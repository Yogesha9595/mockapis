import Link from "next/link"
import ApiWidget from "@/components/ApiWidget"
import ApiCodeTerminal from "@/components/ApiCodeTerminal"

export default function Home() {

  return (

    <main>

      {/* HERO FULL WIDTH */}

      <section className="w-full bg-gradient-to-b from-slate-100 to-white dark:from-slate-900 dark:to-black py-28">

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

          {/* LEFT CONTENT */}

          <div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Free Mock APIs for
              <span className="text-green-600 block">
                Modern Development
              </span>
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl">
              Test API requests, simulate real responses, and prototype applications
              faster using free mock APIs and an interactive API playground.
            </p>

            <div className="flex flex-wrap gap-4">

              <Link
                href="/playground"
                className="bg-green-600 hover:bg-green-700 transition text-white px-6 py-3 rounded-lg font-medium shadow"
              >
                Try API Playground →
              </Link>

              <Link
                href="/docs"
                className="border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 transition px-6 py-3 rounded-lg font-medium"
              >
                View Documentation
              </Link>

            </div>

            {/* trust stats */}

            <div className="flex gap-10 mt-10 text-sm text-gray-500">

              <div>
                <p className="text-xl font-semibold text-black dark:text-white">
                  10k+
                </p>
                Developers
              </div>

              <div>
                <p className="text-xl font-semibold text-black dark:text-white">
                  100+
                </p>
                API Endpoints
              </div>

              <div>
                <p className="text-xl font-semibold text-black dark:text-white">
                  99.9%
                </p>
                Uptime
              </div>

            </div>

          </div>


          {/* RIGHT TERMINAL */}

          <ApiCodeTerminal />

        </div>

      </section>


      {/* REST OF PAGE CONTAINER */}

      <div className="max-w-7xl mx-auto px-6">

        {/* API TESTER */}

        <section className="py-24">

          <ApiWidget />

        </section>


        {/* FEATURES */}

        <section className="py-24">

          <h2 className="text-3xl font-bold text-center mb-16">
            Built for Developers
          </h2>

          <div className="grid md:grid-cols-3 gap-10">

            <div className="p-8 border rounded-xl hover:shadow-lg transition bg-white dark:bg-gray-900">
              <h3 className="font-semibold text-lg mb-2">
                Mock REST APIs
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Instantly test CRUD operations with realistic API responses.
                Perfect for frontend development.
              </p>
            </div>

            <div className="p-8 border rounded-xl hover:shadow-lg transition bg-white dark:bg-gray-900">
              <h3 className="font-semibold text-lg mb-2">
                API Playground
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Send API requests directly in your browser and inspect responses instantly.
              </p>
            </div>

            <div className="p-8 border rounded-xl hover:shadow-lg transition bg-white dark:bg-gray-900">
              <h3 className="font-semibold text-lg mb-2">
                Developer Learning
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Learn REST APIs, HTTP status codes, and backend fundamentals.
              </p>
            </div>

          </div>

        </section>

      </div>

    </main>

  )

}