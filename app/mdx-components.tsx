import type { MDXComponents } from "mdx/types"
import CodeBlock from "@/components/CodeBlock"

/* ---------------- HELPERS ---------------- */

/* ✅ Extract plain text from React children */
function extractText(children: any): string {
  if (!children) return ""

  if (typeof children === "string") return children

  if (Array.isArray(children)) {
    return children.map(extractText).join("")
  }

  if (typeof children === "object" && children.props?.children) {
    return extractText(children.props.children)
  }

  return ""
}

/* ✅ Robust slug generator */
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

/* ---------------- EXPORT ---------------- */

export function useMDXComponents(
  components: MDXComponents
): MDXComponents {
  return {
    /* ---------------- HEADINGS ---------------- */

    h1: ({ children, ...props }) => {
      const text = extractText(children)
      const id = slugify(text)

      return (
        <h1
          id={id}
          className="text-3xl font-bold mt-10 mb-4 scroll-mt-24"
          {...props}
        >
          {children}
        </h1>
      )
    },

    /* ✅ ONLY THIS WILL BE USED IN TOC */
    h2: ({ children, ...props }) => {
      const text = extractText(children)
      const id = slugify(text)

      return (
        <h2
          id={id}
          data-toc="true" /* 🔥 IMPORTANT FOR TOC */
          className="text-2xl font-semibold mt-12 mb-4 scroll-mt-24 border-b pb-2"
          {...props}
        >
          {children}
        </h2>
      )
    },

    h3: ({ children, ...props }) => {
      const text = extractText(children)
      const id = slugify(text)

      return (
        <h3
          id={id}
          className="text-xl font-semibold mt-8 mb-3 scroll-mt-24"
          {...props}
        >
          {children}
        </h3>
      )
    },

    /* ---------------- TEXT ---------------- */

    p: (props) => (
      <p className="text-gray-700 dark:text-gray-300 leading-7 mb-5 text-[17px]" {...props} />
    ),

    ul: (props) => (
      <ul className="list-disc pl-6 mb-5 text-gray-700 dark:text-gray-300 space-y-1" {...props} />
    ),

    ol: (props) => (
      <ol className="list-decimal pl-6 mb-5 text-gray-700 dark:text-gray-300 space-y-1" {...props} />
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
        className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 my-6"
        {...props}
      />
    ),

    /* ---------------- INLINE CODE ---------------- */

    code: ({ children, ...props }: any) => (
      <code
        className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm text-pink-600 dark:text-pink-400"
        {...props}
      >
        {children}
      </code>
    ),

    /* ---------------- CODE BLOCK ---------------- */

    pre: (props: any) => {
      const child = props.children

      const code =
        typeof child?.props?.children === "string"
          ? child.props.children
          : ""

      const className = child?.props?.className || ""

      const language = className.startsWith("language-")
        ? className.replace("language-", "")
        : "code"

      return <CodeBlock language={language}>{code}</CodeBlock>
    },

    /* ---------------- TABLE ---------------- */

    table: (props) => (
      <div className="overflow-x-auto my-6">
        <table className="w-full border border-gray-200 dark:border-gray-700 text-sm" {...props} />
      </div>
    ),

    th: (props) => (
      <th className="border px-3 py-2 bg-gray-100 dark:bg-gray-800 text-left" {...props} />
    ),

    td: (props) => (
      <td className="border px-3 py-2 dark:border-gray-700" {...props} />
    ),

    /* ---------------- IMAGE ---------------- */

    img: (props) => (
      <img className="rounded-lg my-6 shadow-sm" {...props} />
    ),

    ...components,
  }
}