import ClientCompiler from "./Client"
import { languages } from "@/data/compilerLanguages"
import Link from "next/link"
import { notFound } from "next/navigation"

// ✅ ICON HELPER
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

// ✅ METADATA
export async function generateMetadata({ params }: any) {
  const { language } = await params
  const data = languages[language]

  if (!data) {
    return {
      title: "Online Compiler",
      description: "Run code online instantly"
    }
  }

  return {
    title: `${data.name} Online Compiler (Free) – Run ${data.name} Code Online Instantly`,
    description: `Run ${data.name} code online instantly with our free ${data.name} compiler. No installation required. Supports input, fast execution, and real-time output.`,
    keywords: [
      `${data.name} online compiler`,
      `run ${data.name} code online`,
      `${data.name} compiler free`,
      `${data.name} online IDE`,
      `${data.name} code runner`,
      `execute ${data.name} programs online`,
      `${data.name} compiler without installation`,
      `${data.name} coding platform`,
      `${data.name} code editor online`
    ]
  }
}

// ✅ PAGE
export default async function Page({ params }: any) {
  const { language } = await params
  const data = languages[language]

  if (!data) return notFound()

  const otherLanguages = Object.keys(languages).filter(
    (l) => l !== language
  )

  const faqs = [
    {
      q: `How can I run ${data.name} code online instantly?`,
      a: (
        <>
          You can write your {data.name} code in the editor and click run to execute it instantly.
          If you want to try other languages, you can also use our{" "}
          <Link href="/compiler/javascript" className="text-blue-600">JavaScript compiler</Link>{" "}
          or{" "}
          <Link href="/compiler/java" className="text-blue-600">Java compiler</Link>.
        </>
      )
    },
    {
      q: `Is this ${data.name} online compiler completely free?`,
      a: (
        <>
          Yes, this {data.name} compiler is completely free and works directly in your browser.
          You can switch between tools like{" "}
          <Link href="/compiler/cpp" className="text-blue-600">C++ compiler</Link>{" "}
          without any cost.
        </>
      )
    },
    {
      q: `Does this ${data.name} compiler support input (stdin)?`,
      a: (
        <>
          Yes, you can provide custom input (stdin) to test real-world programs and algorithms.
          This is useful for problem solving and competitive coding practice.
        </>
      )
    },
    {
      q: `Can beginners use this ${data.name} compiler?`,
      a: (
        <>
          Absolutely. It is designed for beginners, students, and developers.
          The simple UI makes it easy to learn and experiment with coding concepts quickly.
        </>
      )
    },
    {
      q: `Is this useful for coding interview preparation?`,
      a: (
        <>
          Yes, it is perfect for practicing coding problems, algorithms, and debugging solutions.
          You can quickly test logic without setting up a local environment.
        </>
      )
    },
    {
      q: `Do I need to install ${data.name} locally?`,
      a: (
        <>
          No, everything runs in your browser. You don’t need to install or configure anything
          to start coding and testing your programs.
        </>
      )
    },
    {
      q: `Is it safe to use online compilers?`,
      a: (
        <>
          Yes, it is safe for learning and testing purposes. However, avoid using sensitive
          or production-level data while running code online.
        </>
      )
    }
  ]

  return (
    <div>

      {/* 🔥 COMPILER */}
      <ClientCompiler lang={language} />

      {/* 🔥 SEO CONTENT */}
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-6">

        <h1 className="text-3xl font-bold">
          {data.name} Online Compiler – Run {data.name} Code Instantly
        </h1>

        <p>
          Looking for a fast, free, and reliable {data.name} online compiler? This tool lets you write,
          run, and test {data.name} code instantly in your browser without installing any software.
          Whether you're a beginner learning programming or a developer testing quick logic,
          everything works in seconds.
        </p>

        <p>
          With real-time execution, input support, and a clean interface, this {data.name} compiler acts
          like a lightweight online IDE. You can run code online anytime, anywhere — on desktop or mobile.
        </p>

        {/* 🔥 SEO BOOST (IMPORTANT) */}
        <p>
          If you're searching for a <strong>{data.name} online compiler free</strong>, a{" "}
          <strong>way to run {data.name} code online without installation</strong>, or a{" "}
          <strong>{data.name} code runner with instant output</strong>, this platform is built for you.
          It helps you <strong>execute {data.name} programs online</strong>, debug faster, and practice coding problems efficiently.
        </p>

        <h2 className="text-xl font-semibold">
          What is a {data.name} Online Compiler?
        </h2>

        <p>
          A {data.name} online compiler is a browser-based coding platform that allows you to write,
          compile, and execute programs instantly without setting up a local development environment.
        </p>

        <h2 className="text-xl font-semibold">
          Key Features
        </h2>

        <ul className="list-disc pl-6 space-y-2">
          <li>Instant code execution</li>
          <li>No installation required</li>
          <li>Supports input and output</li>
          <li>Fast and reliable performance</li>
          <li>Beginner-friendly interface</li>
        </ul>

        {/* 🔥 INTERNAL LINKING (WITH ICONS) */}
        <h2 className="text-xl font-semibold mt-8">
          Explore Other Compilers
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {otherLanguages.map((l) => (
            <Link
              key={l}
              href={`/compiler/${l}`}
              className="flex items-center gap-2 border px-3 py-2 rounded hover:bg-zinc-100 text-sm"
            >
              <img
                src={getIcon(l)}
                alt={languages[l].name}
                className="w-5 h-5"
              />
              {languages[l].name}
            </Link>
          ))}
        </div>

         {/* 🔥 FAQ (REFERENCE UI STYLE) */}
        <h2 className="text-3xl font-bold text-center mt-16 mb-6 text-black">
          FAQs
        </h2>

        <div className="max-w-3xl mx-auto divide-y">

          {faqs.map((item, i) => (
            <details key={i} className="group py-5">

              <summary className="flex justify-between items-center cursor-pointer list-none text-lg font-medium">
                <span>{i + 1}. {item.q}</span>
                <span className="transition group-open:rotate-180 text-orange-500">
                  ⌄
                </span>
              </summary>

              <div className="mt-3 text-gray-600 text-sm leading-relaxed">
                {item.a}
              </div>

            </details>
          ))}

        </div>

      </div>

      {/* 🔥 FAQ SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: typeof f.a === "string" ? f.a : ""
              }
            }))
          })
        }}
      />

    </div>
  )
}