import { baseConvert } from "./baseConvert"
import { units } from "./units"

// 🔥 derive types
type UnitsType = typeof units
type UnitCategory = keyof UnitsType | "temperature"

// 🔥 generic engine type
type ConverterEngine = {
  convert: (value: number, from: string, to: string) => number
}

export const converterEngines: Record<UnitCategory, ConverterEngine> = {
  length: {
    convert: (value, from, to) => {
      const f = from as keyof UnitsType["length"]
      const t = to as keyof UnitsType["length"]
      return baseConvert(value, units.length[f], units.length[t])
    },
  },

  weight: {
    convert: (value, from, to) => {
      const f = from as keyof UnitsType["weight"]
      const t = to as keyof UnitsType["weight"]
      return baseConvert(value, units.weight[f], units.weight[t])
    },
  },

  speed: {
    convert: (value, from, to) => {
      const f = from as keyof UnitsType["speed"]
      const t = to as keyof UnitsType["speed"]
      return baseConvert(value, units.speed[f], units.speed[t])
    },
  },

  data: {
    convert: (value, from, to) => {
      const f = from as keyof UnitsType["data"]
      const t = to as keyof UnitsType["data"]
      return baseConvert(value, units.data[f], units.data[t])
    },
  },

  temperature: {
    convert: (value, from, to) => {
      if (from === to) return value

      let celsius = value

      if (from === "fahrenheit") celsius = (value - 32) * (5 / 9)
      else if (from === "kelvin") celsius = value - 273.15

      if (to === "fahrenheit") return celsius * (9 / 5) + 32
      if (to === "kelvin") return celsius + 273.15

      return celsius
    },
  },
}