type Props = {
  toolName: string;
}

export default function ToolContent({ toolName }: Props) {
  // Use 'lower' for dynamic internal routing if needed
  const slug = toolName.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="max-w-4xl mt-14 space-y-12">
      {/* INTRO */}
      <section aria-labelledby="intro-title">
        <h2 id="intro-title" className="text-2xl font-bold mb-4 text-gray-900">
          What is {toolName}?
        </h2>
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            {toolName} is a free online developer utility designed to help
            developers quickly process and transform structured data directly
            inside their browser. Many modern applications rely on formats like
            JSON, XML, YAML, Base64, or encoded text to exchange data between
            APIs, databases, and services.
          </p>
          <p>
            When working with raw data responses from APIs or configuration
            files, the structure is often compact and difficult to read.
            Using the <strong>{toolName}</strong> tool, you can instantly analyze,
            format, validate, or convert your data into a readable structure
            without installing any software.
          </p>
          <p className="bg-teal-50 p-4 border-l-4 border-teal-500 rounded-r">
            <strong>Privacy Note:</strong> The entire processing happens locally in your browser, 
            which means your data never leaves your device. This ensures complete privacy 
            and makes the tool safe for debugging sensitive API responses.
          </p>
        </div>
      </section>

      {/* HOW TO USE */}
      <section aria-labelledby="howto-title">
        <h2 id="howto-title" className="text-2xl font-bold mb-4 text-gray-900">
          How to Use {toolName}
        </h2>
        <ol className="list-decimal pl-6 space-y-3 text-gray-700">
          <li>Paste your data into the input editor on the left side of the tool.</li>
          <li>Click the "Format", "Validate", or transformation button depending on the function.</li>
          <li>The processed output will instantly appear in the result editor.</li>
          <li>Copy the result or download the output file directly for your project.</li>
        </ol>
      </section>

      {/* BENEFITS */}
      <section aria-labelledby="benefits-title">
        <h2 id="benefits-title" className="text-2xl font-bold mb-4 text-gray-900">
          Benefits of Using {toolName}
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
          <li className="flex items-center gap-2">
            <span className="text-teal-600">✓</span> Instant data processing
          </li>
          <li className="flex items-center gap-2">
            <span className="text-teal-600">✓</span> No installation required
          </li>
          <li className="flex items-center gap-2">
            <span className="text-teal-600">✓</span> 100% Free developer utility
          </li>
          <li className="flex items-center gap-2">
            <span className="text-teal-600">✓</span> Runs securely in-browser
          </li>
          <li className="flex items-center gap-2">
            <span className="text-teal-600">✓</span> Debug API responses faster
          </li>
          <li className="flex items-center gap-2">
            <span className="text-teal-600">✓</span> Supports modern workflows
          </li>
        </ul>
      </section>

      {/* RELATED TOOLS */}
      <section aria-labelledby="related-title">
        <h2 id="related-title" className="text-2xl font-bold mb-4 text-gray-900">
          Related Developer Tools
        </h2>
        <p className="text-gray-700 mb-4">
          If you frequently work with structured data, you may also find these tools useful:
        </p>
        <div className="flex flex-wrap gap-3">
          {["JSON Formatter", "JSON Validator", "JSON Minify", "Base64 Encoder"].map((item) => (
            <a
              key={item}
              href={`/tools/${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="px-4 py-2 border border-gray-200 rounded-full text-sm font-medium text-teal-600 hover:bg-teal-50 hover:border-teal-200 transition"
            >
              {item}
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}