"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

import ThemeToggle from "./ThemeToggle";
import SupportButton from "./SupportButton";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/apis", label: "APIs" },
    { href: "/docs", label: "Docs" },
    { href: "/playground", label: "Playground" },
    { href: "/tools", label: "Tools" },
    { href: "/learn", label: "Learn" },
    { href: "/http-status-codes", label: "HTTP Codes" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/60 shadow-[0_4px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEIGHT INCREASED */}
        <div className="flex items-center justify-between h-[68px]">

          {/* LOGO (UNCHANGED) */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/favicon-32.png" alt="logo" width={32} height={32} />
            <h1 className="text-lg sm:text-xl font-bold text-foreground">
              Dev<span className="text-primary">Utilities</span>
              <span className="text-muted ml-1">Lab</span>
            </h1>
          </Link>

          {/* DESKTOP NAV (UPGRADED TYPOGRAPHY) */}
          <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative transition-all duration-200 ${
                    isActive
                      ? "text-foreground font-semibold"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {item.label}

                  {/* PREMIUM UNDERLINE */}
                  <span
                    className={`absolute left-0 -bottom-[8px] h-[2px] bg-primary transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">

            {/* THEME */}
            <ThemeToggle />

            {/* CTA (MORE PREMIUM) */}
            <Link
              href="/playground"
              className="hidden sm:inline-flex items-center px-5 py-2.5 text-sm font-semibold rounded-lg bg-primary text-white hover:opacity-90 transition shadow-md"
            >
              Try API
            </Link>

            {/* SUPPORT */}
            <div className="hidden sm:block">
              <SupportButton />
            </div>

            {/* MOBILE MENU */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-xl px-2 py-1 text-foreground"
            >
              ☰
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div
            ref={menuRef}
            className="md:hidden mt-3 rounded-xl bg-card border border-border p-4 space-y-3 shadow-2xl"
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-lg text-sm transition ${
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted hover:bg-background hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <Link
              href="/playground"
              className="block text-center mt-2 px-4 py-2.5 rounded-lg bg-primary text-white font-medium"
            >
              Try API
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}