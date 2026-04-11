"use client"

type Box = {
  top: number
  right: number
  bottom: number
  left: number
}

type ElementBox = {
  tag: string
  className?: string
  id?: string
  margin?: Box
  padding?: Box
  border?: Box
  width?: number
  height?: number
}

export default function BoxModel({ element }: { element: ElementBox | null }) {
  if (!element) {
    return (
      <div className="p-4 text-sm text-gray-400">
        Hover an element to inspect box model
      </div>
    )
  }

  const margin = element.margin || emptyBox()
  const padding = element.padding || emptyBox()
  const border = element.border || emptyBox()

  return (
    <div className="p-4 text-xs space-y-4">

      {/* 🔹 ELEMENT INFO */}
      <div className="space-y-1 border-b pb-3">
        <p>
          <strong className="text-gray-600">Tag:</strong>{" "}
          <span className="text-blue-600">{element.tag}</span>
        </p>

        <p>
          <strong className="text-gray-600">Class:</strong>{" "}
          <span className="text-green-600">
            {element.className || "-"}
          </span>
        </p>

        <p>
          <strong className="text-gray-600">ID:</strong>{" "}
          <span className="text-purple-600">
            {element.id || "-"}
          </span>
        </p>
      </div>

      {/* 🔥 BOX MODEL VISUAL */}
      <div className="text-center">

        {/* MARGIN */}
        <div className="bg-orange-100 border border-orange-300 p-3">
          <BoxValues label="margin" box={margin} />

          {/* BORDER */}
          <div className="bg-yellow-100 border border-yellow-400 p-3 mt-2">
            <BoxValues label="border" box={border} />

            {/* PADDING */}
            <div className="bg-green-100 border border-green-400 p-3 mt-2">
              <BoxValues label="padding" box={padding} />

              {/* CONTENT */}
              <div className="bg-blue-100 border border-blue-400 p-4 mt-2">
                <div className="text-[11px] text-gray-700">
                  <p>
                    {element.width || 0} × {element.height || 0}
                  </p>
                  <p className="mt-1 text-gray-500">content</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

/**
 * 🔹 Box value renderer
 */
function BoxValues({
  label,
  box,
}: {
  label: string
  box: Box
}) {
  return (
    <div className="text-[10px] text-gray-700 space-y-1">
      <p className="font-semibold text-gray-500">{label}</p>

      <div className="flex justify-between">
        <span>{box.top}</span>
        <span>{box.right}</span>
        <span>{box.bottom}</span>
        <span>{box.left}</span>
      </div>
    </div>
  )
}

/**
 * 🔹 Default empty box
 */
function emptyBox(): Box {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }
}