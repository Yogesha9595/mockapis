/** SHA digests via the Web Crypto API (UTF-8 input, lowercase hex output). */
export const HASH_ALGORITHMS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const
export type HashAlgorithm = (typeof HASH_ALGORITHMS)[number]

export async function hashText(text: string, algorithm: HashAlgorithm): Promise<string> {
  const digest = await crypto.subtle.digest(algorithm, new TextEncoder().encode(text))
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("")
}
