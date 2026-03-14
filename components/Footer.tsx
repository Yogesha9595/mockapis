import Link from "next/link"

export default function Footer() {

  return (

      <footer className="bg-black text-gray-400 py-16 mt-20">

        <div className="max-w-6xl mx-auto px-6">

          <div className="grid md:grid-cols-3 gap-10">

            <div>

              <h3 className="text-white font-semibold mb-3">
                MockAPIs
              </h3>

              <p className="text-sm">
                Free mock APIs for testing, prototyping and learning API development.
              </p>

            </div>


            <div>

              <h3 className="text-white font-semibold mb-3">
                Resources
              </h3>

              <ul className="space-y-2 text-sm">

                <li><Link href="/docs">Documentation</Link></li>
                <li><Link href="/apis">API List</Link></li>
                <li><Link href="/playground">API Playground</Link></li>
                <li><Link href="/learn">Learn APIs</Link></li>

              </ul>

            </div>


            <div>

              <h3 className="text-white font-semibold mb-3">
                Support
              </h3>

              <p className="text-sm mb-3">
                If this project helps you, consider supporting it.
              </p>

              <button className="bg-yellow-500 hover:bg-yellow-400 transition text-black px-4 py-2 rounded">
                🎁 Support Project
              </button>

            </div>

          </div>


          <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm">

            © {new Date().getFullYear()} MockAPIs

          </div>

        </div>

      </footer>
  )
}