export interface ToolFAQ {
  readonly question: string;
  readonly answer: string;
}

export interface ToolExample {
  readonly input: string;
  readonly output: string;
}

export interface ToolContentType {
  readonly title: string;
  readonly intro: string;
  readonly howTo: string[];
  readonly benefits: string[];
  readonly example: ToolExample;
  readonly keywords: string[];
  readonly faqs: ToolFAQ[];
}

export const toolContent: Record<string, ToolContentType> = {
  "json-formatter": {
    title: "JSON Formatter Online",
    intro: `JSON Formatter is a powerful online developer tool that allows you to format, validate, and beautify raw JSON instantly. Developers frequently work with JSON responses from APIs, configuration files, and databases, but the data is often minified and difficult to read.

This JSON formatter converts compact JSON strings into structured, human-readable format with proper indentation. Whether you're debugging an API response, validating JSON syntax, or simply making JSON easier to read, this tool provides a fast and reliable solution.

Unlike many online utilities, this formatter runs entirely in your browser, ensuring your data never leaves your device. That makes it safe to use even with sensitive API responses or private configuration data.`,
    
    howTo: [
      "Paste raw JSON data into the input editor.",
      "Click the 'Format / Beautify JSON' button.",
      "The formatted JSON will instantly appear in the output panel.",
      "Copy or download the formatted result.",
    ],

    benefits: [
      "Makes JSON easy to read and debug",
      "Detects invalid JSON syntax",
      "Improves API development workflow",
      "Runs completely in the browser",
      "Free and accessible from any device",
    ],

    example: {
      input: `{"name":"John","age":30,"skills":["React","Node"]}`,
      output: `{
  "name": "John",
  "age": 30,
  "skills": [
    "React",
    "Node"
  ]
}`,
    },

    keywords: [
      "json formatter online",
      "beautify json online",
      "format json online free",
      "json beautifier tool",
      "json formatter for api response",
      "online json formatter for developers",
    ],

    faqs: [
      {
        question: "What is a JSON formatter?",
        answer: "A JSON formatter converts compact or minified JSON into a structured and readable format using indentation and line breaks.",
      },
      {
        question: "Is this JSON formatter safe to use?",
        answer: "Yes. All formatting happens locally inside your browser and your data is never sent to a server.",
      },
      {
        question: "Can I validate JSON with this tool?",
        answer: "Yes. If the JSON contains syntax errors the formatter will display an error message.",
      },
      {
        question: "Why should developers format JSON?",
        answer: "Formatting JSON improves readability, debugging efficiency, and makes it easier to inspect API responses.",
      },
      {
        question: "Does this tool work for large JSON files?",
        answer: "Yes. The tool is optimized to handle large JSON payloads typically used in APIs.",
      },
      {
        question: "Is JSON formatting the same as JSON validation?",
        answer: "No. Formatting changes the structure for readability while validation checks whether the JSON syntax is correct.",
      },
      {
        question: "Can I download formatted JSON?",
        answer: "Yes. After formatting you can copy or download the formatted output.",
      },
      {
        question: "Is this JSON formatter free?",
        answer: "Yes. All developer tools on MockAPIs are completely free to use.",
      },
    ],
  },

  "json-to-yaml": {
    title: "JSON to YAML Converter",
    intro: `JSON to YAML Converter allows developers to convert JSON objects into YAML format instantly. YAML is widely used in configuration files such as Kubernetes manifests, Docker Compose files, and CI/CD pipelines.

This tool simplifies the conversion process by transforming JSON structures into clean YAML syntax without requiring manual scripting or third-party libraries.`,
    
    howTo: [
      "Paste JSON data into the input editor.",
      "Click the 'Convert JSON to YAML' button.",
      "The YAML output will appear instantly.",
      "Copy or download the generated YAML.",
    ],

    benefits: [
      "Simplifies DevOps configuration workflows",
      "Converts nested JSON structures correctly",
      "Works instantly in the browser",
      "No installation required",
    ],

    example: {
      input: `{"name":"MockAPIs","version":1}`,
      output: `name: MockAPIs
version: 1`,
    },

    keywords: [
      "json to yaml converter",
      "convert json to yaml online",
      "json yaml converter free",
      "json to yaml for kubernetes",
      "yaml converter developer tool",
    ],

    faqs: [
      {
        question: "What is YAML used for?",
        answer: "YAML is commonly used in configuration files such as Kubernetes manifests, Docker Compose files, and CI/CD pipelines.",
      },
      {
        question: "Can JSON be converted to YAML?",
        answer: "Yes. JSON is a subset of YAML, which makes conversion straightforward.",
      },
      {
        question: "Is JSON to YAML conversion safe?",
        answer: "Yes. The conversion runs locally in your browser and your data is never uploaded.",
      },
      {
        question: "Why do developers prefer YAML for configuration?",
        answer: "YAML is easier to read and write compared to JSON when dealing with large configuration files.",
      },
    ],
  },
};