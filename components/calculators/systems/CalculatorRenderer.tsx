"use client";

import { useState, useEffect, useMemo } from "react";
import { calculateLoan } from "../engines/loan";
import { calculateEMI } from "../engines/emi";

import { exportToCSV } from "@/lib/tools/export";
import { exportToPDF } from "@/lib/tools/exportPdf";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

// 🔥 ENGINE SAFE RUNNER
function runEngine(engine: string, values: any) {
  try {
    switch (engine) {
      case "loan":
        return calculateLoan(values.amount, values.rate, values.years);
      case "emi":
        return calculateEMI(values.amount, values.rate, values.years);
      case "percentage":
        return {
          result: Math.round((values.value * values.percent) / 100),
        };
      default:
        return {};
    }
  } catch {
    return {};
  }
}

// 🔥 SAFE NUMBER
const safe = (v: any) => (isNaN(v) || v === undefined ? 0 : v);

// 🔥 FORMAT ₹
const format = (v: number) =>
  `₹ ${Math.round(v || 0).toLocaleString("en-IN")}`;

export default function CalculatorRenderer({ config }: any) {
  const storageKey = `calc-${config.title}`;

  const initialState = Object.fromEntries(
    config.fields.map((f: any) => [f.key, f.min ?? 0])
  );

  const [values, setValues] = useState(initialState);
  const [showTable, setShowTable] = useState(false);

  // 🔥 LOAD SAVED
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setValues(JSON.parse(saved));
    } catch {}
  }, []);

  // 🔥 SAVE
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(values));
    } catch {}
  }, [values]);

  // 🔥 COMPUTE RESULT (MEMO)
  const result = useMemo(() => runEngine(config.engine, values), [values]);

  // 🔥 PIE DATA SAFE
  const pieData = [
    { name: "Principal", value: safe(values.amount) },
    { name: "Interest", value: safe(result.totalInterest) },
  ];

  // 🔥 HANDLE CHANGE WITH VALIDATION
  function handleChange(key: string, value: number, min?: number, max?: number) {
    if (isNaN(value)) return;

    let v = value;

    if (min !== undefined) v = Math.max(v, min);
    if (max !== undefined) v = Math.min(v, max);

    setValues((prev: any) => ({ ...prev, [key]: v }));
  }

  // 🔥 SHARE
  function handleShare() {
    try {
      const params = new URLSearchParams(values).toString();
      const url = `${window.location.origin}${window.location.pathname}?${params}`;
      navigator.clipboard.writeText(url);
      alert("Link copied!");
    } catch {}
  }

  return (
    <div className="space-y-8">

      {/* 🔥 MAIN GRID */}
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">

        {/* LEFT INPUT */}
        <div className="bg-white dark:bg-gray-900 border rounded-2xl p-6 space-y-6">

          <h2 className="text-xl font-semibold">{config.title}</h2>

          {config.fields.map((f: any) => (
            <div key={f.key} className="space-y-2">

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{f.label}</span>
                <span className="text-green-600 font-semibold">
                  {safe(values[f.key]).toLocaleString()}
                </span>
              </div>

              <input
                type="range"
                min={f.min}
                max={f.max}
                step={f.step || 1}
                value={safe(values[f.key])}
                onChange={(e) =>
                  handleChange(f.key, Number(e.target.value), f.min, f.max)
                }
                className="w-full accent-green-600"
              />

              <input
                type="number"
                value={safe(values[f.key])}
                onChange={(e) =>
                  handleChange(f.key, Number(e.target.value), f.min, f.max)
                }
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          ))}

          {/* ACTIONS */}
          <div className="flex flex-wrap gap-3 pt-4">

            {result?.schedule && (
              <button
                onClick={() => setShowTable(!showTable)}
                className="px-4 py-2 border rounded-lg"
              >
                {showTable ? "Hide Table" : "Show Table"}
              </button>
            )}

            {result?.schedule && (
              <button
                onClick={() => exportToCSV(result.schedule)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                CSV
              </button>
            )}

            {result?.schedule && (
              <button
                onClick={() => exportToPDF(result.schedule)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                PDF
              </button>
            )}

            <button
              onClick={handleShare}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Share
            </button>
          </div>
        </div>

        {/* RIGHT RESULTS */}
        <div className="bg-white dark:bg-gray-900 border rounded-2xl p-6 flex flex-col justify-between">

          <div>
            <p className="text-sm text-gray-500">Total Payment</p>
            <p className="text-2xl font-bold text-green-600">
              {format(result.totalPayment)}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div>
                <p className="text-gray-500">Monthly EMI</p>
                <p className="font-semibold">{format(result.emi)}</p>
              </div>

              <div>
                <p className="text-gray-500">Interest</p>
                <p className="font-semibold">
                  {format(result.totalInterest)}
                </p>
              </div>
            </div>
          </div>

          {/* DONUT */}
          <div className="h-56 mt-6">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={70}>
                  <Cell fill="#16a34a" />
                  <Cell fill="#e5e7eb" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 🔥 FULL WIDTH CHART */}
      {result?.schedule && (
        <div className="h-72 bg-white border rounded-2xl p-4">
          <ResponsiveContainer>
            <LineChart data={result.schedule}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line dataKey="balance" stroke="#16a34a" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 🔥 TABLE */}
      {showTable && result?.schedule && (
        <div className="overflow-auto max-h-96 bg-white border rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="p-2">Month</th>
                <th className="p-2">Principal</th>
                <th className="p-2">Interest</th>
                <th className="p-2">Balance</th>
              </tr>
            </thead>
            <tbody>
              {result.schedule.map((row: any, i: number) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-2">{row.month}</td>
                  <td className="p-2">{row.principal}</td>
                  <td className="p-2">{row.interest}</td>
                  <td className="p-2">{row.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}