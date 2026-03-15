"use client"

import { useState } from "react"

interface Props {
toolName: string
}

export default function ToolFAQ({ toolName }: Props) {

const [open, setOpen] = useState<number | null>(0)

const faqs = [
{
q: `What is ${toolName}?`,
a: `${toolName} is an online developer utility that helps process, format, validate, or transform structured data directly in your browser without installing any software.`
},
{
q: `Is ${toolName} free to use?`,
a: `Yes. All tools available on MockAPIs are completely free to use for developers, students, and engineers.`
},
{
q: `Is my data secure when using ${toolName}?`,
a: `Yes. All processing happens locally in your browser, which means your data never leaves your device and is not stored on any server.`
},
{
q: `Do I need to install anything to use ${toolName}?`,
a: `No installation is required. You can use ${toolName} directly from your browser without downloading any plugins or software.`
},
{
q: `Can ${toolName} handle large files?`,
a: `Most modern browsers can handle large datasets efficiently. However extremely large files may depend on your browser memory limits.`
},
{
q: `Who should use ${toolName}?`,
a: `Developers, API testers, DevOps engineers, and data analysts commonly use ${toolName} when debugging APIs, validating structured data, or converting formats.`
},
{
q: `Does ${toolName} work on mobile devices?`,
a: `Yes. The tool works on mobile browsers, tablets, and desktop devices. However for large datasets a desktop environment is recommended.`
},
{
q: `What browsers support ${toolName}?`,
a: `The tool works on all modern browsers including Chrome, Firefox, Edge, Safari, and Brave.`
}
]

const faqSchema = {
"@context": "https://schema.org",
"@type": "FAQPage",
"mainEntity": faqs.map((faq) => ({
"@type": "Question",
"name": faq.q,
"acceptedAnswer": {
"@type": "Answer",
"text": faq.a
}
}))
}

return (


<div className="mt-16">

  <h2 className="text-2xl font-semibold mb-6">
    Frequently Asked Questions
  </h2>

  <div className="space-y-3">

    {faqs.map((faq, index) => (

      <div
        key={index}
        className="border rounded-lg p-4 cursor-pointer"
        onClick={() => setOpen(open === index ? null : index)}
      >

        <h3 className="font-semibold flex justify-between items-center">

          {faq.q}

          <span className="text-gray-400">
            {open === index ? "−" : "+"}
          </span>

        </h3>

        {open === index && (
          <p className="text-gray-600 mt-2">
            {faq.a}
          </p>
        )}

      </div>

    ))}

  </div>


  {/* FAQ SCHEMA */}
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(faqSchema)
    }}
  />

</div>


)
}
