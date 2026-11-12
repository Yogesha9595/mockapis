"use client";

import { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";

/*
 * Theme = the "dark" class on <html>. Light is the default; the choice is
 * saved in localStorage("theme") and applied before paint by the init script
 * in app/layout.tsx (keep the two in sync).
 */

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

const isDark = () => document.documentElement.classList.contains("dark");

export default function ThemeToggle() {
  // Server render assumes light (the default); the client reads the real class
  const dark = useSyncExternalStore(subscribe, isDark, () => false);

  const toggleTheme = () => {
    const next = !isDark();
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // Storage unavailable (private mode): theme still applies for this page view
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Dark theme"
      aria-pressed={dark}
      title={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="inline-flex h-10 w-10 items-center justify-center rounded-control border border-border bg-card text-foreground transition-colors hover:bg-surface"
    >
      {/* Icon follows the class directly, so it is correct before hydration */}
      <Moon className="h-5 w-5 dark:hidden" aria-hidden="true" />
      <Sun className="hidden h-5 w-5 dark:block" aria-hidden="true" />
    </button>
  );
}
