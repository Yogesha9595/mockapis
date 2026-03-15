export type FAQItem = {
question: string
answer: string
}

export function generateFAQSchema(faqs: FAQItem[]) {

return {
"@context": "https://schema.org",
"@type": "FAQPage",
"mainEntity": faqs.map((faq) => ({
"@type": "Question",
"name": faq.question,
"acceptedAnswer": {
"@type": "Answer",
"text": faq.answer
}
}))
}

}
