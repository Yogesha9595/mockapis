import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",

  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./content/**/*.{mdx}",
  ],

  theme: {
    extend: {
      // ✅ CONNECT CSS VARIABLES TO TAILWIND
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        border: "var(--border)",
        muted: "var(--muted)",
        primary: "var(--primary)",
      },

      typography: {
        DEFAULT: {
          css: {
            maxWidth: "100%",
            color: "var(--muted)",

            h1: {
              fontWeight: "700",
              letterSpacing: "-0.02em",
              color: "var(--foreground)",
            },
            h2: {
              fontWeight: "600",
              marginTop: "2rem",
              color: "var(--foreground)",
            },
            h3: {
              fontWeight: "600",
              color: "var(--foreground)",
            },

            p: {
              lineHeight: "1.8",
            },

            a: {
              color: "#2563eb",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            },

            code: {
              backgroundColor: "var(--border)",
              padding: "2px 6px",
              borderRadius: "6px",
              fontWeight: "500",
            },

            pre: {
              backgroundColor: "#0f172a",
              color: "#e5e7eb",
              borderRadius: "10px",
              padding: "16px",
            },
          },
        },

        invert: {
          css: {
            color: "var(--muted)",

            h1: { color: "var(--foreground)" },
            h2: { color: "var(--foreground)" },
            h3: { color: "var(--foreground)" },

            a: {
              color: "#60a5fa",
            },

            code: {
              backgroundColor: "var(--border)",
              color: "var(--foreground)",
            },

            pre: {
              backgroundColor: "#020617",
            },
          },
        },
      },
    },
  },

  plugins: [typography],
};

export default config;