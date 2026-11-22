# CLAUDE.md

DevUtilities Lab (https://devutilitieslab.com): free developer tools that run in the browser.
The repo and package are still named `mockapis` from an earlier version of the project.

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack), React 19
- **Language:** TypeScript (strict). Path alias `@/*` points to the repo root.
- **Styling:** Tailwind CSS v4 via `@tailwindcss/postcss`. Design tokens (CSS variables) live in `app/globals.css`.
- **Package manager:** npm (`package-lock.json`)
- **Hosting:** Cloudflare Pages. It builds GitHub `main` and serves the static export in `out/`.
  **Pushing to `main` deploys to production.**
- **Output:** `output: "export"` by default (`next.config.ts`). There is no server runtime in production:
  no API routes, no `headers()`/`redirects()`, no request-time `searchParams`.
  Setting `STATIC_EXPORT=false` builds a normal Next.js server build. That build is only for local
  experiments and is not what production runs.

## Commands

| Task | Command | Notes |
|---|---|---|
| Dev server | `npm run dev` | http://localhost:3000 |
| Production build | `npm run build` | Static export to `out/`. Must pass before a task is done. |
| Lint | `npm run lint` | It already fails with about 92 errors, mostly `no-explicit-any`. Don't add new errors. |
| Typecheck | `npx tsc --noEmit` | There is no npm script for it. |
| Tests | `npm test` | Node's built-in test runner via `tsx`, over `tests/unit/**/*.test.ts` |
| Serve the export | `npx serve out` (or any static server) | Use this for browser checks that must match production |

`npm run generate:ai` (`scripts/generateSections.ts`) writes AI-generated articles into `content/learn/`
using the OpenAI API key in `.env.local`. It is not part of the build.

## Environment

`.env.local` (gitignored): `NEXT_PUBLIC_GA_ID` (GA4, only loaded in production builds) and `OPENAI_API_KEY`
(only used by the generation script). Never print or commit these values.

## Folder structure

```
app/                     Routes (App Router)
  layout.tsx             Root layout: site-wide metadata, AdSense + consent bootstrap, GA4, theme script, Header/Footer
  page.tsx               Homepage
  sitemap.ts, robots.ts  sitemap.xml and robots.txt (prerendered)
  tools/
    page.tsx             /tools hub metadata (server); UI in ToolsHub.tsx (client, own hard-coded category list)
    [slug]/page.tsx      Generic tool route, one static page per live tool in data/tools.ts
    category/[category]/ Category listing pages (only categories with a live tool)
    view-source/, schema-validator/   Hand-built "standalone" tools
  learn/                 Guides index + [slug] article pages (MDX from content/learn)
  http-status-codes/, about/, contact/, privacy-policy/, terms/, disclaimer/
components/
  tools/                 Tool page template: ToolPage (server), ToolWorkbench (client), ToolLayout, CodeEditor
  nav/                   navData.ts (header/footer links), ToolsMenu, SearchDialog
  ui/                    Button, Card, Badge, Alert, Field, Spinner (token-based)
  Header.tsx, Footer.tsx
data/
  tools.ts               TOOL REGISTRY: slug, name, description, category, status; standaloneTools; toolCategories
  toolPages.ts           Per-tool page content (title, H1, meta description, intro, how-to, formats, limitations,
                         worked examples, common errors, FAQ)
lib/
  tools/*.ts             Tool logic (pure functions returning ToolResult) and engine.ts (tool definitions)
  site.ts                SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, pageMetadata() helper
  analytics.ts           GA4 + consent mode + AdSense bootstrap, trackToolUsed()
  securityHeaders.ts     CSP and other security headers (source of truth)
  lastModified.ts        Git-based lastModified dates for the sitemap
content/learn/*.mdx      Guide articles (frontmatter: title, description, date, category, keywords, faqs)
public/
  _headers               Cloudflare Pages headers (CSP etc.). Must mirror lib/securityHeaders.ts.
  _redirects             Cloudflare Pages redirects (the only redirects production uses)
  ads.txt, site.webmanifest, icons
tests/unit/              Unit tests
```

### Where things live

- **Tool pages:** `app/tools/[slug]/page.tsx` renders the shared template `components/tools/ToolPage.tsx`. A page is
  built only when the tool is live, has a definition in `lib/tools/engine.ts` and has content in `data/toolPages.ts`;
  every other slug is a 404. Standalone tools live in `app/tools/<slug>/`.
- **Tool content:** `data/toolPages.ts` (per tool). `tests/unit/toolPages.test.ts` checks that every example output and
  quoted error is the engine's real output, and that no sentence appears on more than one tool page.
- **Tool logic:** `lib/tools/<name>.ts`. It is wired to the UI in `lib/tools/engine.ts` (`toolDefinitions`).
- **Metadata:** site-wide defaults are in `app/layout.tsx`. Each page sets its own through `pageMetadata()` in
  `lib/site.ts`, which adds a self-referencing canonical and complete OG/Twitter blocks. The homepage
  and the root layout share `HOME_TITLE` / `SITE_DESCRIPTION` from `lib/site.ts`. Client-component pages
  (`"use client"`) can't export metadata. Wrap them in a server `page.tsx` or a segment `layout.tsx`.
- **Sitemap:** `app/sitemap.ts`. It includes only live tools, their categories, static pages and learn articles.
- **Security headers / CSP:** `lib/securityHeaders.ts`, mirrored by hand in `public/_headers`
  (`tests/unit/securityHeaders.test.ts` fails if they differ). In production only `public/_headers` is used.
- **Analytics and ads:** `lib/analytics.ts` and `app/layout.tsx`. The AdSense client ID is in `app/layout.tsx`
  and `public/ads.txt`. GA4 only loads in production builds with `NEXT_PUBLIC_GA_ID` set. Per-tool events are
  enabled with `trackUsage: true` in `data/toolPages.ts` and send only the slug and action, never input.
- **Navigation:** `components/nav/navData.ts`. Header, footer, homepage and search are all built from
  `liveToolLinks()` in `data/tools.ts`, so only `status: "live"` tools are ever linked.

## How a new tool is added today (generic /tools/[slug] route)

1. **Logic:** write a pure function in `lib/tools/<name>.ts` that takes the input string and returns a
   `ToolResult` (`ok(...)` / `fail(...)` from `lib/tools/types.ts`). It must not throw on bad input,
   must not use the network and must not use Node-only APIs.
2. **Tests:** add `tests/unit/<name>.test.ts`, covering Unicode/emoji and invalid input.
3. **Definition:** add an entry to `toolDefinitions` in `lib/tools/engine.ts` with the primary action, any
   extra actions, input/output labels, editor languages, placeholder, `sample` and optional `accept`
   (file types for upload). The sample must produce a successful result (tested).
4. **Registry:** add or update the entry in `data/tools.ts` (`slug`, `name`, `description`, `category`,
   `status`). Use `"planned"` or `"partial"` until the tool works. Those tools get no page (404) and are not
   listed anywhere. Setting `"live"` automatically adds the tool to the header menu,
   footer, homepage, /tools hub, search, related tools and the sitemap. A new category also needs an entry in
   `toolCategories` (in `data/tools.ts`) and in the hard-coded `categories` map in `app/tools/ToolsHub.tsx`.
5. **Page content:** add an entry to `data/toolPages.ts` (`title`, `h1`, `metaDescription`, `intro`, 3 to 5 `howTo`
   steps, `formats`, `limitations`, 2 `examples`, `errors`, 4 `faq` entries, optional `related`). Describe only
   what the code really does, run every example through the engine, state the limitations and mark unsure facts
   with TODO. A live tool without this entry has no page (the tests fail).
6. **Verify:** typecheck, tests, production build, then check the page in a browser
   (input, every action, upload, copy, download, error message, light and dark theme, phone width).

Standalone tools with a custom UI go in `app/tools/<slug>/page.tsx` (server component exporting
`metadata` via `pageMetadata()`, with the interactive part in a client component). Register them in
`standaloneTools` in `data/tools.ts` with an `href`.

## Project rules

1. **Every tool runs fully in the browser.** User input is never sent to a server. No `fetch` of user
   input, no server routes, no third-party processing APIs. Analytics events must never contain input.
2. **No new dependency without asking me first.** This includes devDependencies and CDN scripts.
3. **Keep each change small and focused on what I asked.** Don't refactor, rename, reformat or "clean up"
   unrelated code, even when it looks broken. Mention it instead.
4. **Run typecheck (`npx tsc --noEmit`), tests (`npm test`) and the production build (`npm run build`)
   before saying a task is done.** Report failures as they are.
5. **Never commit or push unless I say so.** Pushing to `main` deploys to production.
6. **Any change that adds a third-party script must also update the security policy (CSP)** in
   `lib/securityHeaders.ts` and `public/_headers`, and be checked in a browser against the static export
   for CSP violations in the console.

## Gotchas

- Static export: anything that needs a server (API routes, `searchParams` at request time, `headers()`,
  `redirects()`) silently does nothing in production. Dynamic routes need `generateStaticParams` and
  `dynamicParams = false`.
- `pageMetadata()` must be used for every page, because Next.js replaces (not merges) the OG/Twitter objects.
  Don't put `alternates.canonical` in the root layout.
- The homepage title opts out of the `%s | DevUtilities Lab` template with `title: { absolute }`.
- The theme is class-based (`.dark`), light by default. The inline script in `app/layout.tsx` and
  `components/ThemeToggle.tsx` must stay in sync.
- `robots.ts` allows crawling only when built by Cloudflare Pages for the `main` branch
  (`CF_PAGES=1`, `CF_PAGES_BRANCH=main`). Preview, local and other builds disallow everything.
- Unfinished routes use `pageMetadata({ ..., noindex: true, nofollow: true })`. A client-component page
  gets its robots rule from a segment `layout.tsx`.
- Redirects go in `public/_redirects` only. Removed routes (`/calculators*`, `/convert/*`, `/converters/*`)
  301 to `/tools`. `/apis`, `/docs`, `/playground`, `/online-compiler` and `/compiler` were removed
  without redirects (never indexed).
- The homepage title and site description are defined once, in `lib/site.ts` (`HOME_TITLE`, `SITE_DESCRIPTION`).
