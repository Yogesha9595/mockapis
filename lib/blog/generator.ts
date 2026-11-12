import fs from "fs"
import path from "path"
import { KEYWORDS } from "./keywords"
import { generateArticleTemplate } from "./templates"

const OUTPUT_PATH = path.join(process.cwd(), "content/learn")

function buildArticle(keyword: string) {
  const meta = generateArticleTemplate(keyword)

  const slug = keyword.replace(/\s+/g, "-")

  return `---
title: "${meta.title}"
description: "${meta.description}"
category: "${meta.category}"
tags: ${JSON.stringify(meta.tags)}
date: "${new Date().toISOString()}"
views: ${Math.floor(Math.random() * 500)}
---

# ${meta.title}

## Introduction
${keyword} is one of the most important concepts in modern development. In this guide, we will explain everything in detail.

## What is ${meta.title}?
${keyword} refers to...

## Why is ${keyword} important?
- Improves performance
- Enables scalability
- Used in real-world systems

## Real World Example
Example of ${keyword} in action.

## Step-by-Step Guide
1. Understand basics
2. Implement API
3. Test endpoints

## Best Practices
- Use proper structure
- Handle errors
- Optimize responses

## Common Mistakes
- Overengineering
- Poor validation

## FAQs

### What is ${keyword}?
${keyword} is...

### How does ${keyword} work?
It works by...

### Why should I use ${keyword}?
Because it improves...

## Conclusion
${keyword} is essential for modern developers.
`
}

export function generateAllArticles() {
  if (!fs.existsSync(OUTPUT_PATH)) {
    fs.mkdirSync(OUTPUT_PATH, { recursive: true })
  }

  KEYWORDS.forEach((keyword) => {
    const slug = keyword.replace(/\s+/g, "-")
    const filePath = path.join(OUTPUT_PATH, `${slug}.mdx`)

    if (fs.existsSync(filePath)) return

    const content = buildArticle(keyword)

    fs.writeFileSync(filePath, content)
    console.log("Generated:", slug)
  })
}