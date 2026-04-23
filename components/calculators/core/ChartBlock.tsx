"use client";

import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ChartBlock({ type, result, values }: any) {
  if (type === "donut") {
    const data = [
      { name: "Invested", value: result.invested || values.amount },
      { name: "Returns", value: result.returns || result.totalInterest },
    ];

    return (
      <div className="h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={70}>
              <Cell fill="#1d4ed8" />
              <Cell fill="#f97316" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === "dual") {
    return (
      <div className="h-64">
        <ResponsiveContainer>
          <LineChart data={result.schedule}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line dataKey="balance" stroke="#2563eb" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
}