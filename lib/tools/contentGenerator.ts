export type FAQItem = {
question: string
answer: string
}

export type ToolContent = {
intro: string
howTo: string[]
benefits: string[]
useCases: string[]
keywords: string[]
faqs: FAQItem[]
}

export function generateToolContent(toolName: string): ToolContent {

const lower = toolName.toLowerCase()

const intro = `${toolName} is a powerful online developer tool designed to help developers process and transform data instantly in their browser. Developers frequently work with structured data formats such as JSON, XML, YAML, encoded strings, timestamps, and text transformations.

Using the ${toolName}, you can quickly perform operations such as formatting, encoding, decoding, validation, and transformation without installing any software. This makes it a useful utility for frontend developers, backend engineers, DevOps professionals, and API testers.

Unlike many online utilities, this tool runs entirely in your browser which means your data is never uploaded to any server. This ensures complete privacy when processing sensitive API responses, configuration files, or application data.`

const howTo = [
`Paste your data into the ${toolName} input editor.`,
`Click the main processing button to run the ${toolName}.`,
"The processed result will appear instantly in the output panel.",
"Copy or download the generated result for use in your project."
]

const benefits = [
"Instant processing with zero latency",
"No server-side data processing",
"Developer-friendly interface",
"Works for large data structures",
"Completely free developer utility"
]

const useCases = [
"Debugging API responses",
"Formatting configuration files",
"Testing data transformations",
"Cleaning raw developer data",
"Improving readability of structured data"
]

const keywords = [
lower,
`${lower} online`,
`free ${lower} tool`,
`${lower} developer tool`,
`best ${lower} online`,
`${lower} formatter`,
`${lower} utility`,
`${lower} browser tool`
]

const faqs: FAQItem[] = [
{
question: `What is ${toolName}?`,
answer: `${toolName} is an online developer utility that allows you to process and transform structured data quickly and safely inside your browser.`
},
{
question: `Is ${toolName} free to use?`,
answer: "Yes. All developer tools available on MockAPIs are completely free to use."
},
{
question: `Is my data secure when using ${toolName}?`,
answer: "Yes. All processing happens locally in your browser and your data is never sent to any server."
},
{
question: `Who should use ${toolName}?`,
answer: `${toolName} is commonly used by developers, DevOps engineers, API testers, and anyone working with structured data formats.`
},
{
question: `Does ${toolName} support large data files?`,
answer: "Yes. The tool is optimized to handle large datasets commonly returned by APIs or configuration files."
},
{
question: "Can I copy the processed results?",
answer: "Yes. After processing the data you can easily copy the result or download the output."
},
{
question: "Do I need to install any software?",
answer: "No installation is required. The tool works directly inside your web browser."
},
{
question: "Why use online developer tools?",
answer: "Online tools allow developers to instantly process and debug structured data without writing custom scripts or installing additional software."
}
]

return {
intro,
howTo,
benefits,
useCases,
keywords,
faqs
}

}
