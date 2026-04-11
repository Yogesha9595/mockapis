"use client"

export default function SchemaScore({ score = 0 }: { score: number }) {
  // Determine color based on score
  const getColor = () => {
    if (score >= 80) return "bg-green-500"
    if (score >= 50) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getTextColor = () => {
    if (score >= 80) return "text-green-600"
    if (score >= 50) return "text-yellow-600"
    return "text-red-600"
  }

  const getLabel = () => {
    if (score >= 80) return "Excellent"
    if (score >= 50) return "Needs Improvement"
    return "Poor"
  }

  return (
    <div className="bg-white border rounded-lg p-5 shadow-sm space-y-3">

      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">Schema Score</span>
        <span className={`text-sm font-medium ${getTextColor()}`}>
          {getLabel()}
        </span>
      </div>

      {/* Score Number */}
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-gray-900">
          {score}
        </span>
        <span className="text-gray-400 text-sm">/ 100</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${getColor()}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Hint */}
      <p className="text-xs text-gray-500">
        Improve your schema by fixing missing fields and adding required properties.
      </p>

    </div>
  )
}