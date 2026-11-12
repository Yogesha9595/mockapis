import "dotenv/config"

import fs from "fs"
import path from "path"
import { generateSections } from "../lib/ai/generator"
import { buildMDX } from "../lib/ai/mdxBuilder"

/* ---------------- CONFIG ---------------- */

const OUTPUT_DIR = path.join(process.cwd(), "content/learn")

const KEYWORDS = [
  "REST API Design",
  "API Pagination Strategies",
  "Authentication in APIs",
  "Error Handling in APIs",
]

/* ---------------- HELPERS ---------------- */

function createSlug(keyword: string) {
  return keyword
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
}

/* ---------------- MAIN ---------------- */

async function run() {
  console.log("\n🚀 Starting AI Article Generation...\n")

  /* 🔥 DEBUG ENV (REMOVE AFTER TEST) */
  console.log("🔑 API KEY LOADED:", !!process.env.OPENAI_API_KEY)

  /* 🔐 ENV CHECK */
  if (!process.env.OPENAI_API_KEY) {
    console.error("\n❌ ERROR: Missing OPENAI_API_KEY")
    console.error("👉 Fix this:")
    console.error("1. Create .env.local in root")
    console.error("2. Add: OPENAI_API_KEY=your_key")
    console.error("3. Restart terminal\n")
    process.exit(1)
  }

  /* 📁 Ensure output directory */
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  for (const keyword of KEYWORDS) {
    const slug = createSlug(keyword)
    const filePath = path.join(OUTPUT_DIR, `${slug}.mdx`)

    console.log(`🧠 Generating: ${keyword}`)

    try {
      /* ⚠️ Skip if file exists */
      if (fs.existsSync(filePath)) {
        console.log(`⚠️ Skipped (already exists): ${slug}\n`)
        continue
      }

      /* 🔥 AI CALL */
      const sections = await generateSections(keyword)

      if (!sections || !sections.hook) {
        throw new Error("AI returned empty content")
      }

      /* 🧩 Build MDX */
      const mdx = buildMDX(keyword, sections)

      /* 💾 Save file */
      fs.writeFileSync(filePath, mdx, "utf-8")

      console.log(`✅ Saved: ${slug}.mdx\n`)
    } catch (error) {
      console.error(`❌ Failed: ${keyword}`)
      console.error(error)
      console.log("")
    }
  }

  console.log("🎉 All articles processed!\n")
}

/* ---------------- EXECUTE ---------------- */

run().catch((err) => {
  console.error("🔥 Fatal Error:", err)
  process.exit(1)
})