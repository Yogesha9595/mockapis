type FAQItem = {
  question: string
  answer: string
}

export default function FAQ({ faqs }: { faqs: FAQItem[] }) {
  if (!faqs || faqs.length === 0) return null

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">
        Frequently Asked Questions
      </h2>

      {faqs.map((faq, index) => (
        <div key={index} className="mb-6">
          <h3 className="font-semibold text-lg">
            {faq.question}
          </h3>
          <p className="text-gray-700 mt-2 whitespace-pre-line">
            {faq.answer}
          </p>
        </div>
      ))}
    </div>
  )
}