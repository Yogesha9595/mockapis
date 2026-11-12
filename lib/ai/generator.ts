import OpenAI from "openai"
import dotenv from "dotenv"

// ✅ FORCE LOAD ENV
dotenv.config({ path: ".env.local" })

/* ---------------- ENV CHECK ---------------- */
if (!process.env.OPENAI_API_KEY) {
  throw new Error("❌ OPENAI_API_KEY is missing. Check .env.local file.")
}

/* ---------------- CLIENT ---------------- */
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/* ---------------- AI CALL ---------------- */
async function callAI(prompt: string): Promise<string> {
  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini", // ✅ updated model
      temperature: 0.7,
      input: [
        {
          role: "system",
          content:
            "You are a senior backend engineer writing high-quality developer blog content. Avoid fluff. Focus on real-world depth, clarity, and practical examples.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    })

    return response.output_text || ""
  } catch (error) {
    console.error("❌ OpenAI API Error:", error)
    return ""
  }
}

/* ---------------- SECTION GENERATOR ---------------- */

export async function generateSections(keyword: string) {
  return {
    hook: await callAI(`
Write a strong developer-focused introduction for "${keyword}".
Start with a real-world problem. No definitions. No fluff.
`),

    problem: await callAI(`
Explain real-world problems developers face with "${keyword}".
Use practical examples from production systems.
`),

    failure: await callAI(`
Show real-world failure cases of "${keyword}" APIs.
Explain what breaks, why it breaks, and impact on users.
`),

    solution: await callAI(`
Explain how to design "${keyword}" correctly for production systems.
Use structured explanation with practical patterns.
`),

    bestPractices: await callAI(`
List 5 advanced best practices for "${keyword}".
Each should include explanation + real-world reasoning.
Avoid generic tips.
`),

    faq: await callAI(`
Write 3 high-quality FAQs about "${keyword}".
Format STRICTLY:

Q: question  
A: answer
`),
  }
}