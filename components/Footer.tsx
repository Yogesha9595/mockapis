import Link from "next/link"
import { FaGithub, FaTelegramPlane } from "react-icons/fa"
import { navCategories, COMPANY_LINKS, LEGAL_LINKS, RESOURCE_LINKS } from "./nav/navData"
import { SITE_NAME } from "@/lib/site"

/* Server component: no client JavaScript. Every link points to a real page. */

/* Only accounts verified to exist (2026-11-12). */
const SOCIAL = [
  { href: "https://github.com/devutilitieslab", label: "DevUtilities Lab on GitHub", icon: FaGithub },
  { href: "https://t.me/devutilities_lab", label: "DevUtilities Lab on Telegram", icon: FaTelegramPlane },
]

const linkClass = "text-sm text-muted transition-colors hover:text-foreground"

/** Internal page → next/link. Non-page files (sitemap.xml) → plain <a>, so no client-side navigation is attempted. */
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return /\.[a-z]+$/.test(href) ? (
    <a href={href} className={linkClass}>{children}</a>
  ) : (
    <Link href={href} className={linkClass}>{children}</Link>
  )
}

function Column({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <FooterLink href={l.href}>{l.label}</FooterLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  // A category without its own page links straight to its single tool
  const categoryLinks = navCategories().map((c) => ({
    href: c.href ?? c.tools[0].href,
    label: c.href ? c.name : c.tools[0].name,
  }))

  return (
    <footer className="mt-20 border-t border-border bg-card">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">

          {/* BRAND */}
          <div className="sm:col-span-2">
            <Link href="/" className="text-lg font-bold tracking-tight text-foreground">{SITE_NAME}</Link>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
              Free, fast developer tools for working with JSON, encodings, tokens, timestamps and text. They run in
              your browser, with no sign-up.
            </p>
            <ul className="mt-4 flex gap-2" aria-label="Social media">
              {SOCIAL.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (opens in a new tab)`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-control border border-border text-muted transition-colors hover:bg-surface hover:text-foreground"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer" className="grid gap-10 sm:col-span-2 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-4">
            <Column title="Tool categories" links={[...categoryLinks, { href: "/tools", label: "All tools" }]} />
            <Column title="Resources" links={RESOURCE_LINKS} />
            <Column title="Company" links={COMPANY_LINKS} />
            <Column title="Legal" links={LEGAL_LINKS} />
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE_NAME}</p>
          <p>
            Contact: <a href="mailto:hello@devutilitieslab.com" className="hover:text-foreground">hello@devutilitieslab.com</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
