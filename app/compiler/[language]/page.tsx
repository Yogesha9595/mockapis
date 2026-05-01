import ClientCompiler from "./Client"
import { languages } from "@/data/compilerLanguages"
import Link from "next/link"
import { notFound } from "next/navigation"

// ✅ REQUIRED FOR STATIC EXPORT
export const dynamic = "force-static"

// ✅ REQUIRED: STATIC PARAMS
export async function generateStaticParams() {
  return Object.keys(languages).map((language) => ({
    language,
  }))
}

// ✅ ICON HELPER (UNCHANGED)
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

// ✅ METADATA (FIXED PARAMS ONLY)
export async function generateMetadata({ params }: any) {
  const { language } = params // ❗ FIXED (removed await)
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

// ✅ PAGE (ONLY PARAM FIX)
export default async function Page({ params }: any) {
  const { language } = params // ❗ FIXED (removed await)
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
        </>
      )
    },
    {
      q: `Can beginners use this ${data.name} compiler?`,
      a: (
        <>
          Absolutely. It is designed for beginners, students, and developers.
        </>
      )
    },
    {
      q: `Is this useful for coding interview preparation?`,
      a: (
        <>
          Yes, it is perfect for practicing coding problems and debugging.
        </>
      )
    },
    {
      q: `Do I need to install ${data.name} locally?`,
      a: (
        <>
          No, everything runs in your browser.
        </>
      )
    },
    {
      q: `Is it safe to use online compilers?`,
      a: (
        <>
          Yes, but avoid using sensitive data.
        </>
      )
    }
  ]

  return (
    <div>

      <ClientCompiler lang={language} />

      <div className="max-w-5xl mx-auto px-4 py-16 space-y-6">

        <h1 className="text-3xl font-bold">
          {data.name} Online Compiler – Run {data.name} Code Instantly
        </h1>

        <p>
          Run and test {data.name} code instantly in your browser.
        </p>

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

      </div>

    </div>
  )
}