/**
 * Generic base conversion using factors
 */
export function baseConvert(
  value: number,
  fromFactor: number,
  toFactor: number
): number {
  if (!value || isNaN(value)) return 0
  if (!fromFactor || !toFactor) return 0

  const base = value * fromFactor
  return base / toFactor
}