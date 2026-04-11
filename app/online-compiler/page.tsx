"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { languages } from "@/data/compilerLanguages"

export default function OnlineCompilerPage() {

  const [search, setSearch] = useState("")
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const popular = ["python", "javascript", "java", "cpp"]

  // 🔥 FILTER (OPTIMIZED)
  const filteredLanguages = useMemo(() => {
    return Object.keys(languages).filter((key) =>
      languages[key].name.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  // 🔥 ICON HANDLER (SAFE)
  function getIcon(lang: string) {
    const map: Record<string, string> = {
      python: "python",
      javascript: "javascript",
      java: "java",
      cpp: "cplusplus",
      c: "c",
      go: "go",
      rust: "rust",
      php: "php"
    }

    const icon = map[lang]

    return icon
      ? `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${icon}/${icon}-original.svg`
      : "https://cdn-icons-png.flaticon.com/512/2721/2721297.png"
  }

  // 🔥 FAQ DATA
  const faqs = [
    {
      q: "Do I need to install anything to use this compiler?",
      a: "No, everything runs directly in your browser. You can start coding instantly without setup."
    },
    {
      q: "Which programming languages are supported?",
      a: "Python, JavaScript, Java, C++, C, Go, Rust, PHP and more."
    },
    {
      q: "Can I run code with custom input?",
      a: "Yes, stdin input is supported for real-world testing."
    },
    {
      q: "Is this online compiler free?",
      a: "Yes, it's completely free with no hidden charges."
    },
    {
      q: "Can I save or share my code?",
      a: "Code saving is supported locally. Share feature can be added easily."
    },
    {
      q: "Is it safe to use?",
      a: "Yes for learning and testing. Avoid sensitive production data."
    },
    {
      q: "Why use an online compiler instead of IDE?",
      a: "It removes setup complexity and lets you focus only on coding."
    },
    {
      q: "Who should use this tool?",
      a: "Students, developers, and interview preparation users."
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex gap-8">

      {/* MAIN */}
      <div className="flex-1">

        {/* 🔥 HERO */}
        <section className="mb-16 text-center">

          <h1 className="text-5xl font-bold leading-tight mb-4">
            Code Online <br />
            <span className="text-blue-600">
              Faster. Simpler. Smarter.
            </span>
          </h1>

          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Skip installation and jump straight into coding. Run programs instantly,
            test ideas quickly, and focus only on what matters — writing great code.
          </p>

          {/* CTA */}
          <Link
            href="/compiler/python"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition shadow"
          >
            🚀 Start Coding Instantly
          </Link>

          {/* SEARCH */}
          <div className="mt-8">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search languages (Python, Java, C++, JS...)"
              className="w-full max-w-xl border px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* POPULAR */}
          {!search && (
            <div className="flex justify-center gap-2 mt-4 flex-wrap">
              {popular.map((lang) => (
                <Link
                  key={lang}
                  href={`/compiler/${lang}`}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  🔥 {languages[lang].name}
                </Link>
              ))}
            </div>
          )}

        </section>

        {/* 🔥 LANGUAGE GRID */}
        <section className="mb-20">

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

            {(search ? filteredLanguages : Object.keys(languages)).map((key) => {
              const lang = languages[key]

              return (
                <Link
                  key={key}
                  href={`/compiler/${key}`}
                  className="flex items-center gap-3 border rounded-xl p-4 hover:shadow-md transition hover:bg-zinc-50"
                >
                  <img
                    src={getIcon(key)}
                    alt={lang.name}
                    className="w-8 h-8"
                  />

                  <div>
                    <p className="font-medium">{lang.name}</p>
                    <p className="text-xs text-gray-500">
                      Run {lang.name}
                    </p>
                  </div>
                </Link>
              )
            })}

          </div>

        </section>

        {/* 🔥 SEO CONTENT (FINAL BOOSTED) */}
<section className="max-w-3xl space-y-6">

  <h2 className="text-2xl font-bold">
    Why Online Compilers Are the Future of Coding
  </h2>

  <p className="text-gray-600">
    Setting up a development environment can take more time than writing actual code.
    Online compilers eliminate that friction completely. You simply open your browser,
    write your code, and execute it instantly. No downloads, no configuration, and no
    dependency issues slowing you down.
  </p>

  <p className="text-gray-600">
    This makes online compilers one of the fastest ways to run code online for languages
    like <Link href="/compiler/python" className="text-blue-600">Python</Link>,{" "}
    <Link href="/compiler/javascript" className="text-blue-600">JavaScript</Link>,{" "}
    <Link href="/compiler/java" className="text-blue-600">Java</Link>, and{" "}
    <Link href="/compiler/cpp" className="text-blue-600">C++</Link>.
    Whether you're a beginner learning syntax or a developer testing logic,
    everything works instantly inside your browser.
  </p>

  <h2 className="text-2xl font-bold">
    Built for Speed, Learning, and Real-World Use
  </h2>

  <p className="text-gray-600">
    A modern online compiler is not just a simple tool — it acts as a lightweight
    online IDE. You can execute code online instantly, test algorithms, debug snippets,
    and even simulate real-world input using stdin. This makes it perfect for coding
    interviews, competitive programming, and quick experimentation.
  </p>

  <ul className="list-disc pl-6 text-gray-600 space-y-2">
    <li>Run code online without installing software</li>
    <li>Supports multiple languages in one place</li>
    <li>Fast execution with real-time output</li>
    <li>Ideal for beginners and experienced developers</li>
  </ul>

  {/* 🔥 SEO BOOST PARAGRAPH (IMPORTANT) */}
  <p className="text-gray-600">
    If you're searching for a <strong>free online compiler</strong>, a{" "}
    <strong>browser-based coding platform</strong>, or a way to{" "}
    <strong>run code online without installing software</strong>, this tool is designed
    for exactly that. From <strong>Python online compiler free</strong> to{" "}
    <strong>JavaScript code runner online</strong>, <strong>C++ compiler online</strong>,
    and <strong>Java compiler in browser</strong>, you get everything in one place.
    It works as a fast, reliable, and beginner-friendly online IDE where you can write,
    execute, test, and debug code instantly — anytime, anywhere.
  </p>

</section>

        {/* 🔥 FAQ */}
        <section className="mt-16 max-w-3xl">

          <h2 className="text-2xl font-bold mb-6 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">

            {faqs.map((item, i) => (
              <div key={i} className="border rounded-lg p-4">

                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center text-left"
                >
                  <span className="font-medium">{item.q}</span>
                  <span>{openFaq === i ? "▲" : "▼"}</span>
                </button>

                {openFaq === i && (
                  <p className="mt-3 text-gray-600">
                    {item.a}
                  </p>
                )}

              </div>
            ))}

          </div>

        </section>

      </div>

      {/* 🔥 ADS SIDEBAR */}
      <div className="hidden lg:block w-[300px]">
        <div className="sticky top-20 space-y-6">
          <div className="h-[250px] bg-zinc-200 flex items-center justify-center rounded">
            Ads 300x250
          </div>
          <div className="h-[600px] bg-zinc-200 flex items-center justify-center rounded">
            Ads 300x600
          </div>
        </div>
      </div>

    </div>
  )
}