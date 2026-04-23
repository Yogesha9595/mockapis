export function calculatePercentage(
  value: number,
  percent: number,
  mode: "of" | "increase" | "decrease" = "of"
) {
  let result = 0;

  if (mode === "of") {
    result = (value * percent) / 100;
  }

  if (mode === "increase") {
    result = value + (value * percent) / 100;
  }

  if (mode === "decrease") {
    result = value - (value * percent) / 100;
  }

  return {
    result: Math.round(result),
  };
}