/**
 * Result of running a tool. Tools never throw for bad user input; they
 * return a human-readable error instead so the UI can show it directly.
 */
export type ToolResult =
  | { ok: true; output: string }
  | { ok: false; error: string }

export const ok = (output: string): ToolResult => ({ ok: true, output })
export const fail = (error: string): ToolResult => ({ ok: false, error })
