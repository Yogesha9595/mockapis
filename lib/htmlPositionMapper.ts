export function getRangeFromNode(html: string, node: any) {
  const before = html.slice(0, node.startIndex)
  const line = before.split("\n").length

  return {
    startLineNumber: line,
    startColumn: 1,
    endLineNumber: line,
    endColumn: 200,
  }
}