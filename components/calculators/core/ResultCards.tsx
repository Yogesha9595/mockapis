"use client";

import { useEffect, useState } from "react";

type Result = {
  label: string;
  value: string | number;
};

type Props = {
  results: Result[];
  sticky?: boolean; // 🔥 enable sticky bar
};

// 🔥 number animation
function useAnimatedNumber(value: number, duration = 400) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return display;
}

export default function ResultCards({ results, sticky }: Props) {
  return (
    <div
      className={`
        grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4
        ${sticky ? "sticky top-4 z-20" : ""}
      `}
    >
      {results.map((r, i) => {
        const isNumber =
          typeof r.value === "number" ||
          !isNaN(Number(r.value));

        const animatedValue = isNumber
          ? useAnimatedNumber(Number(r.value))
          : r.value;

        return (
          <div
            key={i}
            className="
              bg-white dark:bg-gray-900
              border border-gray-200 dark:border-gray-700
              rounded-xl p-4 sm:p-5
              shadow-sm hover:shadow-md
              transition-all duration-200
            "
          >
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {r.label}
            </p>

            <p className="mt-1 text-lg sm:text-xl font-semibold text-blue-600 dark:text-blue-400">
              {typeof animatedValue === "number"
                ? animatedValue.toLocaleString()
                : animatedValue}
            </p>
          </div>
        );
      })}
    </div>
  );
}