import { baseConvert } from "./baseConvert"
import { units } from "./units"

// 🔥 derive types from units
type UnitsType = typeof units

export const converterEngines = {
  length: {
    convert: (
      value: number,
      from: keyof UnitsType["length"],
      to: keyof UnitsType["length"]
    ) => {
      return baseConvert(value, units.length[from], units.length[to])
    },
  },

  weight: {
    convert: (
      value: number,
      from: keyof UnitsType["weight"],
      to: keyof UnitsType["weight"]
    ) => {
      return baseConvert(value, units.weight[from], units.weight[to])
    },
  },

  speed: {
    convert: (
      value: number,
      from: keyof UnitsType["speed"],
      to: keyof UnitsType["speed"]
    ) => {
      return baseConvert(value, units.speed[from], units.speed[to])
    },
  },

  data: {
    convert: (
      value: number,
      from: keyof UnitsType["data"],
      to: keyof UnitsType["data"]
    ) => {
      return baseConvert(value, units.data[from], units.data[to])
    },
  },

  temperature: {
    convert: (value: number, from: string, to: string) => {
      if (from === to) return value

      let celsius = value

      if (from === "fahrenheit") celsius = (value - 32) * (5 / 9)
      if (from === "kelvin") celsius = value - 273.15

      if (to === "fahrenheit") return celsius * (9 / 5) + 32
      if (to === "kelvin") return celsius + 273.15

      return celsius
    },
  },
}