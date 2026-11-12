/** Join class names, skipping falsy values. (No dependency needed for our usage.) */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ")
}
