"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const stored = localStorage.getItem("theme");

    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    } else if (stored === "light") {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    } else {
      // ✅ SYSTEM PREFERENCE (IMPORTANT)
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        document.documentElement.classList.add("dark");
        setTheme("dark");
      }
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    }
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className="relative flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-card hover:bg-background transition-all duration-300 group"
    >
      {/* Glow ring (premium feel) */}
      <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition bg-primary/10" />

      {/* Sun */}
      <Sun
        className={`absolute w-5 h-5 text-yellow-500 transition-all duration-300 ${
          theme === "light"
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 rotate-90 scale-0"
        }`}
      />

      {/* Moon */}
      <Moon
        className={`absolute w-5 h-5 text-blue-400 transition-all duration-300 ${
          theme === "dark"
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 -rotate-90 scale-0"
        }`}
      />
    </button>
  );
}