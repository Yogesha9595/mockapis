type Field = {
  key: string;
  label: string;
  min?: number;
  max?: number;
  step?: number;
};

type Result = {
  key: string;
  label: string;
  prefix?: string;
};

type CalculatorConfig = {
  title: string;
  fields: Field[];
  results: Result[];
  engine: string; // ✅ FIXED (string only)
};

export const calculatorConfig: Record<string, CalculatorConfig> = {
  // 🔥 LOAN
  loan: {
    title: "Loan Calculator",
    fields: [
      {
        key: "amount",
        label: "Loan Amount",
        min: 10000,
        max: 10000000,
        step: 10000,
      },
      {
        key: "rate",
        label: "Interest Rate (%)",
        min: 1,
        max: 20,
        step: 0.1,
      },
      {
        key: "years",
        label: "Years",
        min: 1,
        max: 30,
      },
    ],
    results: [
      { key: "emi", label: "Monthly EMI", prefix: "₹" },
      { key: "totalInterest", label: "Total Interest", prefix: "₹" },
      { key: "totalPayment", label: "Total Payment", prefix: "₹" },
    ],
    engine: "loan", // ✅ STRING
  },

  // 🔥 EMI
  emi: {
    title: "EMI Calculator",
    fields: [
      {
        key: "amount",
        label: "Loan Amount",
        min: 10000,
        max: 10000000,
        step: 10000,
      },
      {
        key: "rate",
        label: "Interest Rate (%)",
        min: 1,
        max: 20,
        step: 0.1,
      },
      {
        key: "years",
        label: "Years",
        min: 1,
        max: 30,
      },
    ],
    results: [
      { key: "emi", label: "Monthly EMI", prefix: "₹" },
      { key: "totalInterest", label: "Total Interest", prefix: "₹" },
      { key: "totalPayment", label: "Total Payment", prefix: "₹" },
    ],
    engine: "emi", // ✅ STRING
  },

  // 🔥 PERCENTAGE
  percentage: {
    title: "Percentage Calculator",
    fields: [
      { key: "value", label: "Value", min: 0, max: 100000 },
      { key: "percent", label: "Percent (%)", min: 0, max: 100 },
    ],
    results: [{ key: "result", label: "Result" }],
    engine: "percentage", // ✅ STRING
  },
};