"use client";

type Row = {
  month: number;
  principal?: number;
  interest?: number;
  balance?: number;
};

type Props = {
  data: Row[];
};

export default function TableBlock({ data }: Props) {
  if (!data || data.length === 0) return null;

  return (
    <div
      className="
        w-full overflow-auto max-h-[500px]
        border border-gray-200 dark:border-gray-700
        rounded-xl
      "
    >
      <table className="w-full text-sm">
        {/* 🔥 HEADER */}
        <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
          <tr>
            <th className="p-3 text-left font-medium">Month</th>
            <th className="p-3 text-left font-medium">Principal</th>
            <th className="p-3 text-left font-medium">Interest</th>
            <th className="p-3 text-left font-medium">Balance</th>
          </tr>
        </thead>

        {/* 🔥 BODY */}
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className="
                border-t border-gray-200 dark:border-gray-700
                hover:bg-gray-50 dark:hover:bg-gray-800
                transition
              "
            >
              <td className="p-3">{row.month}</td>

              <td className="p-3 text-green-600 dark:text-green-400">
                {row.principal?.toLocaleString() || "-"}
              </td>

              <td className="p-3 text-red-500 dark:text-red-400">
                {row.interest?.toLocaleString() || "-"}
              </td>

              <td className="p-3 font-medium">
                {row.balance?.toLocaleString() || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}