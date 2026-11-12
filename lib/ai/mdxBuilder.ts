export function buildMDX(keyword: string, sections: any) {
  const date = new Date().toISOString().split("T")[0]

  /* ---------------- CLEAN TEXT ---------------- */

  const clean = (text: string) => {
    if (!text) return ""

    return text
      .replace(/```[\s\S]*?```/g, "") // remove AI code blocks
      .replace(/`/g, "") // remove inline code
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  }

  /* ---------------- FORMAT LISTS ---------------- */

  const formatList = (text: string) => {
    if (!text) return ""

    return text
      .split("\n")
      .map((line: string) => line.trim())
      .filter(Boolean)
      .map((line: string) => {
        if (line.startsWith("-") || line.match(/^\d+\./)) return line
        return `- ${line}`
      })
      .join("\n")
  }

  /* ---------------- FAQ FORMAT ---------------- */

  const formatFAQ = (faqText: string) => {
    if (!faqText) return ""

    const lines = faqText.split("\n").filter(Boolean)

    let result = ""
    let question = ""

    for (const line of lines) {
      if (line.toLowerCase().startsWith("q:")) {
        question = line.replace(/q:/i, "").trim()
      }

      if (line.toLowerCase().startsWith("a:")) {
        const answer = line.replace(/a:/i, "").trim()

        result += `
### ❓ ${question}

${answer}

`
      }
    }

    return result
  }

  /* ---------------- BUILD ---------------- */

  return `---
title: "${keyword} – Complete Guide for Developers"
description: "Learn ${keyword} with real-world examples, production issues, and best practices."
date: "${date}"
category: "API"
tags: ["${keyword}", "api", "backend"]
keywords: ["${keyword}", "api tutorial", "developer guide"]
---

# ${keyword}

> A complete developer-focused guide to ${keyword} with real-world use cases and production-ready insights.

---

## 🚀 Introduction

${clean(sections.hook)}

---

## ⚠️ Real Problems Developers Face

${clean(sections.problem)}

---

## 💥 What Breaks in Production

${clean(sections.failure)}

---

## 🧠 Production-Ready Approach

${clean(sections.solution)}

---

## 📊 Best Practices

${formatList(clean(sections.bestPractices))}

---

## 📋 Summary Table

| Practice | Why It Matters |
|----------|---------------|
| Consistent API structure | Prevents frontend/backend mismatch |
| Input validation | Avoids runtime crashes |
| Proper error handling | Improves debugging |
| Pagination | Handles large datasets efficiently |
| Security layers | Protects user data |

---

## 🧪 Real Example (Node.js API)

\`\`\`ts
import express from "express"

const app = express()

app.get("/users", async (req, res) => {
  try {
    const users = await db.users.findMany({
      take: 10,
    })

    return res.status(200).json({
      success: true,
      data: users,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    })
  }
})

app.listen(3000)
\`\`\`

---

## ❌ Common Mistakes

- Inconsistent response formats  
- Ignoring HTTP status codes  
- Missing validation  
- Over-fetching data  
- Poor error messages  

---

## ❓ FAQs

${formatFAQ(sections.faq)}

---

## 🏁 Final Thoughts

${keyword} is not just about implementation — it’s about building systems that are scalable, reliable, and easy to maintain.

Design it right early, and you eliminate most production issues later.

---

## 🔗 Related Articles

- API Basics → /learn  
- REST API Design → /learn/rest-api-design  
- API Testing → /learn/api-testing-tools  
`
}