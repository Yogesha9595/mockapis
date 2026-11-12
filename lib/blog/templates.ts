export function generateArticleTemplate(keyword: string) {
  const title = keyword.replace(/\b\w/g, (c) => c.toUpperCase())

  return {
    title,
    description: `Complete guide on ${keyword} with examples, use cases, and best practices.`,
    category: "API",
    tags: keyword.split(" "),
  }
}