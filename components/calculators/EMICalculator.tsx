"use client";

import { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function EMICalculator() {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(5);

  const { emi, totalInterest, totalPayment } = useMemo(() => {
    const P = amount;
    const r = rate / 12 / 100;
    const n = years * 12;

    if (!P || !r || !n) {
      return { emi: 0, totalInterest: 0, totalPayment: 0 };
    }

    const emi =
      (P * r * Math.pow(1 + r, n)) /
      (Math.pow(1 + r, n) - 1);

    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    return {
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
    };
  }, [amount, rate, years]);

  const data = [
    { name: "Principal", value: amount },
    { name: "Interest", value: totalInterest },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Inputs */}
      <div className="space-y-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full border p-2 rounded"
          placeholder="Loan Amount"
        />

        <input
          type="number"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="w-full border p-2 rounded"
          placeholder="Interest Rate (%)"
        />

        <input
          type="number"
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
          className="w-full border p-2 rounded"
          placeholder="Years"
        />
      </div>

      {/* Results */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-600">
          ₹ {emi.toLocaleString()}
        </h2>

        <p>Total Interest: ₹ {totalInterest.toLocaleString()}</p>
        <p>Total Payment: ₹ {totalPayment.toLocaleString()}</p>

        <div className="h-60">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data} dataKey="value" innerRadius={50}>
                <Cell fill="#2563eb" />
                <Cell fill="#22c55e" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}