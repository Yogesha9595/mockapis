"use client";

import { useState, useMemo } from "react";
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

type Row = {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
};

function calculateLoan(amount: number, rate: number, years: number) {
  const P = amount;
  const r = rate / 12 / 100;
  const n = years * 12;

  if (!P || !r || !n) {
    return { emi: 0, schedule: [] as Row[], totalInterest: 0, totalPayment: 0 };
  }

  const emi =
    (P * r * Math.pow(1 + r, n)) /
    (Math.pow(1 + r, n) - 1);

  let balance = P;
  const schedule: Row[] = [];

  for (let i = 1; i <= n; i++) {
    const interest = balance * r;
    const principal = emi - interest;
    balance -= principal;

    schedule.push({
      month: i,
      emi: Math.round(emi),
      principal: Math.round(principal),
      interest: Math.round(interest),
      balance: Math.max(0, Math.round(balance)),
    });
  }

  const totalPayment = emi * n;
  const totalInterest = totalPayment - P;

  return {
    emi: Math.round(emi),
    schedule,
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
  };
}

export default function LoanCalculator() {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(5);

  const [compareAmount, setCompareAmount] = useState(600000);

  const [showTable, setShowTable] = useState(false);

  const result = useMemo(
    () => calculateLoan(amount, rate, years),
    [amount, rate, years]
  );

  const compare = useMemo(
    () => calculateLoan(compareAmount, rate, years),
    [compareAmount, rate, years]
  );

  // 🔥 CSV EXPORT
  const exportCSV = () => {
    const headers = "Month,EMI,Principal,Interest,Balance\n";
    const rows = result.schedule
      .map(
        (r) =>
          `${r.month},${r.emi},${r.principal},${r.interest},${r.balance}`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "loan_schedule.csv";
    a.click();
  };

  // 🔥 PDF EXPORT (simple print)
  const exportPDF = () => {
    window.print();
  };

  const pieData = [
    { name: "Principal", value: amount },
    { name: "Interest", value: result.totalInterest },
  ];

  return (
    <div className="space-y-10">
      {/* 🔥 SLIDERS */}
      <div className="space-y-6">
        <div>
          <label>Loan Amount: ₹ {amount.toLocaleString()}</label>
          <input
            type="range"
            min="10000"
            max="10000000"
            step="10000"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label>Interest Rate: {rate}%</label>
          <input
            type="range"
            min="1"
            max="20"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label>Tenure: {years} years</label>
          <input
            type="range"
            min="1"
            max="30"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* 🔥 RESULTS */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded">
          <p>EMI</p>
          <h2 className="font-bold text-blue-600">
            ₹ {result.emi.toLocaleString()}
          </h2>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <p>Total Interest</p>
          <p>₹ {result.totalInterest.toLocaleString()}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <p>Total Payment</p>
          <p>₹ {result.totalPayment.toLocaleString()}</p>
        </div>
      </div>

      {/* 🔥 COMPARE */}
      <div className="bg-gray-50 p-4 rounded">
        <p className="mb-2 font-semibold">Compare Loan</p>

        <input
          type="number"
          value={compareAmount}
          onChange={(e) => setCompareAmount(Number(e.target.value))}
          className="border p-2 rounded w-full mb-2"
        />

        <p>
          EMI Difference: ₹{" "}
          {(compare.emi - result.emi).toLocaleString()}
        </p>
      </div>

      {/* 🔥 ACTIONS */}
      <div className="flex gap-4">
        <button
          onClick={() => setShowTable(!showTable)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {showTable ? "Hide Schedule" : "Show Schedule"}
        </button>

        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Export CSV
        </button>

        <button
          onClick={exportPDF}
          className="px-4 py-2 bg-gray-800 text-white rounded"
        >
          Export PDF
        </button>
      </div>

      {/* 🔥 CHART */}
      <div className="h-64 border rounded-xl p-4">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={pieData} dataKey="value" innerRadius={60}>
              <Cell fill="#2563eb" />
              <Cell fill="#22c55e" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 🔥 AMORTIZATION TABLE */}
      {showTable && (
        <div className="overflow-auto border rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Month</th>
                <th className="p-2">EMI</th>
                <th className="p-2">Principal</th>
                <th className="p-2">Interest</th>
                <th className="p-2">Balance</th>
              </tr>
            </thead>

            <tbody>
              {result.schedule.map((row) => (
                <tr key={row.month}>
                  <td className="p-2">{row.month}</td>
                  <td className="p-2">₹ {row.emi}</td>
                  <td className="p-2">₹ {row.principal}</td>
                  <td className="p-2">₹ {row.interest}</td>
                  <td className="p-2">₹ {row.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}