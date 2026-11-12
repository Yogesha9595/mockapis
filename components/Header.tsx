"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import ThemeToggle from "./ThemeToggle";
import SupportButton from "./SupportButton";
import ToolsMenu from "./nav/ToolsMenu";
import SearchDialog from "./nav/SearchDialog";
import { navCategories, PRIMARY_LINKS } from "./nav/navData";
import { liveToolLinks } from "@/data/tools";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/* Computed once: the registry is static data */
const CATEGORIES = navCategories();
const SEARCHABLE_TOOLS = liveToolLinks();

const isActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(href + "/");

const linkClass = (active: boolean) =>
  cn(
    "rounded-control px-3 py-2 text-sm font-medium transition-colors",
    active ? "bg-surface text-foreground" : "text-muted hover:bg-surface hover:text-foreground"
  );

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuId = useId();

  // Close the mobile menu with Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85">
      {/* Skip link: first focusable element on every page */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:rounded-control focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-raised"
      >
        Skip to content
      </a>

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* `relative` anchors the Tools menu panel to this row */}
        <div className="relative flex h-16 items-center justify-between gap-3">

          <div className="flex min-w-0 items-center gap-6">
            {/* LOGO (not a heading: each page has its own H1) */}
            <Link href="/" className="flex shrink-0 items-center gap-2 rounded-control" aria-label="DevUtilities Lab home">
              <Image src="/favicon-32.png" alt="" width={28} height={28} priority />
              <span className="text-lg font-bold tracking-tight text-foreground">
                Dev<span className="text-primary">Utilities</span> <span className="font-semibold text-muted">Lab</span>
              </span>
            </Link>

            {/* DESKTOP NAV */}
            <nav aria-label="Main" className="hidden md:block">
              <ul className="flex items-center gap-1">
                <li>
                  <ToolsMenu categories={CATEGORIES} active={isActive(pathname, "/tools")} />
                </li>
                {PRIMARY_LINKS.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link href={item.href} aria-current={active ? "page" : undefined} className={linkClass(active)}>
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* ACTIONS */}
          <div className="flex shrink-0 items-center gap-2">
            <SearchDialog tools={SEARCHABLE_TOOLS} />
            <ThemeToggle />
            <div className="hidden xl:block">
              <SupportButton />
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls={menuId}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className={buttonVariants({ variant: "ghost", size: "icon", className: "md:hidden" })}
            >
              {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* MOBILE NAV */}
        <nav id={menuId} aria-label="Main" hidden={!menuOpen} className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-border py-3 md:hidden">
          <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted">Tool categories</p>
          <ul className="space-y-1">
            {CATEGORIES.map((category) => {
              // A category without its own page links straight to its single tool
              const href = category.href ?? category.tools[0].href;
              const label = category.href ? category.name : category.tools[0].name;
              const active = isActive(pathname, href);
              return (
                <li key={category.id}>
                  <Link href={href} onClick={closeMenu} aria-current={active ? "page" : undefined} className={cn("block text-base", linkClass(active))}>
                    {label}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link href="/tools" onClick={closeMenu} aria-current={pathname === "/tools" ? "page" : undefined} className={cn("block text-base", linkClass(pathname === "/tools"))}>
                All tools
              </Link>
            </li>
          </ul>

          <ul className="mt-3 space-y-1 border-t border-border pt-3">
            {PRIMARY_LINKS.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link href={item.href} onClick={closeMenu} aria-current={active ? "page" : undefined} className={cn("block text-base", linkClass(active))}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
