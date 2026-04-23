"use client";

export default function ActionBar({
  features,
  result,
  toggleTable,
}: any) {
  return (
    <div className="flex flex-wrap gap-3">
      {features?.table && (
        <button
          onClick={toggleTable}
          className="px-4 py-2 border rounded"
        >
          Show Table
        </button>
      )}

      {features?.export && (
        <>
          <button className="px-4 py-2 bg-green-600 text-white rounded">
            CSV
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded">
            PDF
          </button>
        </>
      )}

      {features?.share && (
        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Share
        </button>
      )}
    </div>
  );
}