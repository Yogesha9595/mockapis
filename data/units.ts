export const units = {
  length: {
    meter: 1,
    kilometer: 1000,
    centimeter: 0.01,
    millimeter: 0.001,
    mile: 1609.34,
    yard: 0.9144,
    foot: 0.3048,
    inch: 0.0254,
  },

  weight: {
    gram: 1,
    kilogram: 1000,
    milligram: 0.001,
    pound: 453.592,
    ounce: 28.3495,
  },

  speed: {
    "m/s": 1,
    "km/h": 0.277778,
    mph: 0.44704,
  },

  data: {
    byte: 1,
    kilobyte: 1024,
    megabyte: 1024 ** 2,
    gigabyte: 1024 ** 3,
  },
} as const

// 🔥 ADD THIS TYPE
export type UnitCategory = keyof typeof units