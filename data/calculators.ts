export type Calculator = {
  slug: string;
  name: string;
  description: string;
  category: "finance" | "health" | "math" | "date" | "utility";
  featured?: boolean;
  icon?: string;
};

export const calculators: Calculator[] = [
  // 🔥 FEATURED (Top SEO + High RPM)
  {
    slug: "emi",
    name: "EMI Calculator",
    description: "Calculate Equated Monthly Installments instantly.",
    category: "finance",
    featured: true,
    icon: "💰",
  },
  {
    slug: "loan",
    name: "Loan Calculator",
    description: "Calculate loan payments and total interest.",
    category: "finance",
    featured: true,
    icon: "🏦",
  },
  {
    slug: "bmi",
    name: "BMI Calculator",
    description: "Calculate Body Mass Index easily.",
    category: "health",
    featured: true,
    icon: "⚖️",
  },
  {
    slug: "age",
    name: "Age Calculator",
    description: "Calculate your age based on birth date.",
    category: "date",
    featured: true,
    icon: "🎂",
  },
  {
    slug: "percentage",
    name: "Percentage Calculator",
    description: "Calculate percentages instantly.",
    category: "math",
    featured: true,
    icon: "📊",
  },

  // 💼 Finance
  {
    slug: "mortgage",
    name: "Mortgage Calculator",
    description: "Estimate mortgage payments.",
    category: "finance",
    icon: "🏠",
  },
  {
    slug: "interest",
    name: "Interest Calculator",
    description: "Calculate simple interest instantly.",
    category: "finance",
  },
  {
    slug: "compound-interest",
    name: "Compound Interest Calculator",
    description: "Calculate compound interest growth.",
    category: "finance",
  },
  {
    slug: "investment",
    name: "Investment Calculator",
    description: "Estimate investment returns.",
    category: "finance",
  },
  {
    slug: "sip",
    name: "SIP Calculator",
    description: "Calculate systematic investment plan returns.",
    category: "finance",
  },
  {
    slug: "roi",
    name: "ROI Calculator",
    description: "Calculate return on investment.",
    category: "finance",
  },
  {
    slug: "gst",
    name: "GST Calculator",
    description: "Calculate GST amount quickly.",
    category: "finance",
  },

  // ❤️ Health
  {
    slug: "bmr",
    name: "BMR Calculator",
    description: "Calculate basal metabolic rate.",
    category: "health",
  },
  {
    slug: "body-fat",
    name: "Body Fat Calculator",
    description: "Estimate body fat percentage.",
    category: "health",
  },
  {
    slug: "ideal-weight",
    name: "Ideal Weight Calculator",
    description: "Calculate healthy body weight.",
    category: "health",
  },
  {
    slug: "calorie",
    name: "Calorie Calculator",
    description: "Estimate daily calorie needs.",
    category: "health",
  },

  // 🧮 Math
  {
    slug: "fraction",
    name: "Fraction Calculator",
    description: "Perform fraction calculations.",
    category: "math",
  },
  {
    slug: "square-root",
    name: "Square Root Calculator",
    description: "Find square roots quickly.",
    category: "math",
  },

  // 📅 Date
  {
    slug: "date-difference",
    name: "Date Difference Calculator",
    description: "Calculate days between dates.",
    category: "date",
  },

  // ⚙️ Utility
  {
    slug: "discount",
    name: "Discount Calculator",
    description: "Calculate discounts on products.",
    category: "utility",
  },
  {
    slug: "tip",
    name: "Tip Calculator",
    description: "Calculate restaurant tips easily.",
    category: "utility",
  },
  {
    slug: "fuel-cost",
    name: "Fuel Cost Calculator",
    description: "Estimate fuel trip cost.",
    category: "utility",
  },
  {
    slug: "electricity-bill",
    name: "Electricity Bill Calculator",
    description: "Estimate electricity costs.",
    category: "utility",
  },
];