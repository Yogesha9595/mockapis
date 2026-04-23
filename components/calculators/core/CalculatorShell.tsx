"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Field = {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
};

type Result = {
  label: string;
  value: string | number;
};

type Props = {
  title: string;
  fields: Field[];
  results: Result[];
  actions?: React.ReactNode;
  children?: React.ReactNode;
};

// 🔥 Safe number formatter
const format = (val: any) => {
  if (val === null || val === undefined) return "-";
  const num = Number(val);
  if (isNaN(num)) return val;
  return num.toLocaleString("en-IN");
};

export default function CalculatorShell({
  title,
  fields,
  results,
  actions,
  children,
}: Props) {
  // 🔥 dynamic mapping instead of fixed indexes
  const principal = useMemo(() => {
    return Number(results.find(r => r.label.toLowerCase().includes("principal"))?.value || 0);
  }, [results]);

  const interest = useMemo(() => {
    return Number(results.find(r => r.label.toLowerCase().includes("interest"))?.value || 0);
  }, [results]);

  const total = useMemo(() => principal + interest, [principal, interest]);

  const chartData = total > 0
    ? [
        { name: "Principal", value: principal },
        { name: "Interest", value: interest },
      ]
    : [];

  const percent = total > 0
    ? Math.round((interest / total) * 100)
    : 0;

  return (
    <div className="w-full">

      {/* 🚀 HERO SECTION */}
      <section className="w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-8 lg:gap-10">

          {/* 🔥 LEFT INPUT */}
          <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Adjust values to see instant results
              </p>
            </div>

            {fields.map((f, i) => {
              const isInvalid =
                (f.min !== undefined && f.value < f.min) ||
                (f.max !== undefined && f.value > f.max);

              return (
                <div key={i} className="space-y-2">

                  {/* LABEL */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">
                      {f.label}
                    </span>
                    <span className="font-semibold text-blue-600">
                      {format(f.value)}
                    </span>
                  </div>

                  {/* SLIDER */}
                  <input
                    type="range"
                    min={f.min}
                    max={f.max}
                    step={f.step || 1}
                    value={f.value}
                    onChange={(e) => f.onChange(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />

                  {/* INPUT */}
                  <input
                    type="number"
                    value={f.value}
                    min={f.min}
                    max={f.max}
                    step={f.step || 1}
                    onChange={(e) => {
                      let val = Number(e.target.value);

                      // 🔥 validation clamp
                      if (f.min !== undefined) val = Math.max(val, f.min);
                      if (f.max !== undefined) val = Math.min(val, f.max);

                      f.onChange(val);
                    }}
                    className={`
                      w-full px-3 py-2 rounded-lg border
                      bg-white dark:bg-gray-800
                      text-gray-900 dark:text-white
                      focus:ring-2 focus:ring-blue-500 outline-none
                      ${isInvalid ? "border-red-500" : "border-gray-300 dark:border-gray-700"}
                    `}
                  />

                  {isInvalid && (
                    <p className="text-xs text-red-500">
                      Value must be between {f.min} and {f.max}
                    </p>
                  )}
                </div>
              );
            })}

            {actions && (
              <div className="flex flex-wrap gap-3 pt-2">
                {actions}
              </div>
            )}
          </div>

          {/* 🔥 RIGHT RESULT PANEL */}
          <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">

            {/* 🔥 PRIMARY RESULT */}
            <div>
              <p className="text-sm text-gray-500">
                {results[2]?.label || "Total"}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-600">
                {format(results[2]?.value)}
              </h2>
            </div>

            {/* 🔥 SECONDARY RESULTS */}
            <div className="grid grid-cols-2 gap-4">
              {results.slice(0, 2).map((r, i) => (
                <div key={i}>
                  <p className="text-sm text-gray-500">{r.label}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {format(r.value)}
                  </p>
                </div>
              ))}
            </div>

            {/* 🔥 DONUT CHART */}
            {chartData.length > 0 && (
              <div className="relative h-56 sm:h-64">

                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      innerRadius={70}
                      outerRadius={100}
                    >
                      <Cell fill="#2563eb" />
                      <Cell fill="#22c55e" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                {/* CENTER TEXT */}
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                  <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {percent}%
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500">
                    Interest
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 📊 EXTRA */}
      {children && (
        <section className="max-w-7xl mx-auto px-4 lg:px-8 py-8 sm:py-10">
          {children}
        </section>
      )}

      {/* 🧠 SEO CONTENT */}
      <section className="max-w-4xl mx-auto px-4 py-10 sm:py-12 prose dark:prose-invert">
        <h2>What is {title}?</h2>
        <p>
          This {title.toLowerCase()} helps you calculate accurate financial values
          instantly with real-time updates and interactive charts.
        </p>

        <h2>Benefits</h2>
        <ul>
          <li>Instant calculations</li>
          <li>Interactive sliders</li>
          <li>Visual insights</li>
          <li>Mobile friendly</li>
        </ul>
      </section>
    </div>
  );
}