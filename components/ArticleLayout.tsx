import Breadcrumb from "./Breadcrumb"
import FAQ from "./FAQ"
import ShareButtons from "./ShareButtons"

export default function ArticleLayout({
  title,
  description,
  category,
  readingTime,
  children,
  faqs,
}: {
  title: string
  description: string
  category?: string
  readingTime?: string
  children: React.ReactNode
  faqs?: { question: string; answer: string }[]
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

      {/* Breadcrumb */}
      <Breadcrumb title={title} />

      {/* Title */}
      <h1 className="text-4xl font-bold leading-tight text-gray-900 mb-4">
        {title}
      </h1>

      {/* Meta */}
      <div className="text-sm text-gray-500 mb-6">
        {category || "guide"} • {readingTime || "5 min read"}
      </div>

      {/* Description */}
      <p className="text-gray-600 text-lg leading-relaxed mb-10">
        {description}
      </p>

      {/* 🔥 MAIN CONTENT */}
      <article
        className="
        prose 
        lg:prose-lg 
        max-w-none

        prose-headings:text-gray-900
        prose-headings:font-semibold

        prose-h2:mt-10
        prose-h3:mt-6

        prose-p:text-gray-700
        prose-li:text-gray-700

        prose-strong:text-gray-900

        prose-a:text-blue-600
        hover:prose-a:text-blue-500

        prose-code:bg-gray-100 
        prose-code:px-1 
        prose-code:py-0.5 
        prose-code:rounded

        prose-pre:bg-gray-900 
        prose-pre:text-white 
        prose-pre:rounded-lg 
        prose-pre:p-4
      "
      >
        {children}
      </article>

      {/* Divider */}
      <div className="border-t mt-12 pt-8" />

      {/* FAQ */}
      <FAQ faqs={faqs || []} />

      {/* Share */}
      <ShareButtons title={title} />

    </div>
  )
}