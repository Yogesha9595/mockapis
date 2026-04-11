import type { MDXComponents } from "mdx/types"
import CodeBlock from "./components/CodeBlock"

/* ✅ Helper: slug generator (robust) */
function slugify(text: any) {
  if (!text) return ""
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

export function useMDXComponents(
  components: MDXComponents
): MDXComponents {
  return {
    /* ---------------- HEADINGS ---------------- */

    h1: (props) => (
      <h1
        id={slugify(props.children)}
        className="text-3xl font-bold mt-10 mb-4 scroll-mt-24"
        {...props}
      />
    ),

    h2: (props) => (
      <h2
        id={slugify(props.children)}
        className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24 border-b pb-2"
        {...props}
      />
    ),

    h3: (props) => (
      <h3
        id={slugify(props.children)}
        className="text-xl font-semibold mt-8 mb-3 scroll-mt-24"
        {...props}
      />
    ),

    /* ---------------- TEXT ---------------- */

    p: (props) => (
      <p
        className="text-gray-700 leading-7 mb-5 text-[17px]"
        {...props}
      />
    ),

    ul: (props) => (
      <ul className="list-disc pl-6 mb-5 text-gray-700 space-y-1" {...props} />
    ),

    ol: (props) => (
      <ol className="list-decimal pl-6 mb-5 text-gray-700 space-y-1" {...props} />
    ),

    li: (props) => <li {...props} />,

    a: (props) => (
      <a
        className="text-blue-600 underline hover:text-blue-800 transition"
        {...props}
      />
    ),

    blockquote: (props) => (
      <blockquote
        className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-6"
        {...props}
      />
    ),

    /* ---------------- INLINE CODE ---------------- */

    code: ({ children, ...props }: any) => {
      return (
        <code
          className="bg-gray-100 px-1.5 py-0.5 rounded text-sm text-pink-600"
          {...props}
        >
          {children}
        </code>
      )
    },

    /* ---------------- CODE BLOCK ---------------- */

    pre: (props: any) => {
      const code = props.children?.props?.children || ""
      const className = props.children?.props?.className || ""

      // Extract language from className: language-js
      const language = className.replace("language-", "") || "code"

      return <CodeBlock language={language}>{code}</CodeBlock>
    },

    /* ---------------- TABLE ---------------- */

    table: (props) => (
      <div className="overflow-x-auto my-6">
        <table className="w-full border border-gray-200" {...props} />
      </div>
    ),

    th: (props) => (
      <th className="border px-3 py-2 bg-gray-100 text-left" {...props} />
    ),

    td: (props) => (
      <td className="border px-3 py-2" {...props} />
    ),

    /* ---------------- IMAGE ---------------- */

    img: (props) => (
      <img
        className="rounded-lg my-6 shadow-sm"
        {...props}
      />
    ),

    ...components,
  }
}