import type { Metadata } from "next"
import Link from "next/link"
import { pageMetadata, SITE_NAME } from "@/lib/site"

/*
 * DRAFT — pending legal review. Every legal statement below is marked with a
 * TODO-REVIEW comment (not visible to visitors). Open questions for the reviewer:
 *  - TODO-REVIEW: name and postal address of the legal entity / data controller.
 *  - TODO-REVIEW: legal bases (GDPR Art. 6) and retention periods to state.
 *  - TODO-REVIEW: a consent banner (Google-certified CMP) is required before
 *    analytics/ad cookies may be enabled for EEA/UK/Swiss visitors.
 *  - TODO-REVIEW: whether CCPA/CPRA or other regional disclosures are needed.
 * Facts about how the site works were checked against the code (2026-11-16).
 */

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How DevUtilities Lab handles your data: tool input stays in your browser; Google Analytics and Google AdSense use cookies subject to your consent.",
  path: "/privacy-policy",
})

const LAST_UPDATED = "16 November 2026"
const CONTACT_EMAIL = "hello@devutilitieslab.com"

const h2 = "text-xl font-semibold tracking-tight text-foreground"
const p = "leading-relaxed text-muted"
const link = "font-medium text-primary underline underline-offset-2 hover:text-primary-hover"

function External({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={link}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}

export default function PrivacyPolicy() {
  return (
    <article className="mx-auto max-w-3xl space-y-10 py-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Privacy Policy</h1>
        <p className="text-sm text-muted">Last updated: {LAST_UPDATED}</p>
      </header>

      {/* TODO-REVIEW: controller identity (legal name, address) */}
      <p className={p}>
        This policy explains what information {SITE_NAME} (&ldquo;we&rdquo;), available at devutilitieslab.com,
        collects when you use the website, why, and the choices you have.
      </p>

      {/* ---------------- TOOL INPUT ---------------- */}
      <section className="space-y-3" aria-labelledby="tool-input">
        <h2 id="tool-input" className={h2}>Your tool input stays in your browser</h2>
        {/* TODO-REVIEW */}
        <p className={p}>
          Our tools (such as the JSON formatter, Base64 and URL encoders and the minifiers) run entirely in your
          browser. Text you type or paste and files you open in a tool are processed on your device. They are not
          sent to our servers, and we do not store them. Analytics events never include your input.
        </p>
        {/* TODO-REVIEW */}
        <p className={p}>Two things to be aware of:</p>
        <ul className="list-disc space-y-2 pl-6 text-muted">
          {/* TODO-REVIEW */}
          <li>
            The code editor used by some tools is loaded from the jsDelivr content delivery network
            (cdn.jsdelivr.net), which receives your IP address and browser details when it delivers the editor.
          </li>
          {/* TODO-REVIEW */}
          <li>
            When you preview HTML in the View Source tool, images, stylesheets and fonts referenced by that HTML are
            loaded from the websites it points to, which can see your IP address.
          </li>
        </ul>
      </section>

      {/* ---------------- AUTOMATIC DATA ---------------- */}
      <section className="space-y-3" aria-labelledby="hosting">
        <h2 id="hosting" className={h2}>Information collected when you visit</h2>
        {/* TODO-REVIEW: retention period of hosting logs */}
        <p className={p}>
          The website is delivered by Cloudflare, which processes technical information such as your IP address,
          browser type and the pages requested, to deliver the site securely and protect it from abuse.
        </p>
        {/* TODO-REVIEW */}
        <p className={p}>
          We do not offer accounts and do not ask for your name or email address. If you email us, we use your
          message only to reply.
        </p>
      </section>

      {/* ---------------- GOOGLE ANALYTICS ---------------- */}
      <section className="space-y-3" aria-labelledby="analytics">
        <h2 id="analytics" className={h2}>Google Analytics</h2>
        {/* TODO-REVIEW: legal basis for analytics */}
        <p className={p}>
          We use Google Analytics 4, a service provided by Google, to understand how the site is used: for example
          which pages are visited, the type of device and browser, approximate location (country or city), and which
          tool actions are used (only the tool name and action, such as &ldquo;json-formatter&rdquo; and
          &ldquo;format&rdquo;, never what you enter). Google Analytics uses cookies such as <code>_ga</code> and{" "}
          <code>_ga_&lt;ID&gt;</code> when your consent settings allow it.
        </p>
        {/* TODO-REVIEW */}
        <p className={p}>
          You can stop Google Analytics from collecting data in your browser with Google&apos;s{" "}
          <External href="https://tools.google.com/dlpage/gaoptout">Google Analytics opt-out browser add-on</External>.
        </p>
      </section>

      {/* ---------------- GOOGLE ADSENSE ---------------- */}
      <section className="space-y-3" aria-labelledby="adsense">
        <h2 id="adsense" className={h2}>Google AdSense</h2>
        {/* TODO-REVIEW: legal basis for advertising; personalised vs non-personalised ads */}
        <p className={p}>
          We use Google AdSense, a service provided by Google, to show advertisements. Google and its partners may use
          cookies and similar technologies to serve ads, limit how often you see them, measure their performance and,
          where permitted, show ads based on your visits to this and other websites. Google may also run checks to
          detect invalid or fraudulent ad traffic.
        </p>
        {/* TODO-REVIEW */}
        <p className={p}>
          You can manage ad personalisation in{" "}
          <External href="https://myadcenter.google.com/">Google&apos;s My Ad Center</External>, and learn more in{" "}
          <External href="https://policies.google.com/technologies/cookies">how Google uses cookies</External>.
        </p>
      </section>

      {/* ---------------- GOOGLE PARTNER SITES ---------------- */}
      <section className="space-y-3" aria-labelledby="google-data">
        <h2 id="google-data" className={h2}>How Google uses this information</h2>
        {/* TODO-REVIEW */}
        <p className={p}>
          Google processes data collected through Google Analytics and Google AdSense according to its own policies.
          See{" "}
          <External href="https://policies.google.com/technologies/partner-sites">
            How Google uses information from sites or apps that use its services
          </External>{" "}
          and the <External href="https://policies.google.com/privacy">Google Privacy Policy</External>.
        </p>
      </section>

      {/* ---------------- COOKIES AND CONSENT ---------------- */}
      <section className="space-y-3" aria-labelledby="cookies">
        <h2 id="cookies" className={h2}>Cookies and consent</h2>
        {/* TODO-REVIEW: consent mechanism; confirm wording once a consent banner (CMP) is in place */}
        <p className={p}>
          If you visit from the European Economic Area, the United Kingdom or Switzerland, analytics and advertising
          cookies are off by default. Google may still receive limited information without cookies, such as that a
          page was viewed, which it can use to estimate overall usage. Cookies are only enabled for these visitors
          once consent is given.
        </p>
        {/* TODO-REVIEW */}
        <p className={p}>
          For visitors from other regions, analytics and advertising cookies are enabled by default. You can block or
          delete cookies at any time in your browser settings, and use the opt-out options above.
        </p>
        {/* TODO-REVIEW */}
        <p className={p}>
          We store one setting in your browser&apos;s local storage: your light or dark theme choice. It never
          leaves your device.
        </p>
      </section>

      {/* ---------------- RIGHTS ---------------- */}
      <section className="space-y-3" aria-labelledby="rights">
        <h2 id="rights" className={h2}>Your rights</h2>
        {/* TODO-REVIEW: list applicable rights (GDPR/UK GDPR, CCPA/CPRA etc.) and the supervisory authority */}
        <p className={p}>
          Depending on where you live, you may have the right to access, correct or delete personal data about you,
          to object to or restrict its processing, and to withdraw consent. Because we do not keep accounts or tool
          input, most data about your visit is held by Google and Cloudflare as described above. To exercise a right
          or ask a question, contact us at <span className="font-medium text-foreground">{CONTACT_EMAIL}</span>.
        </p>
      </section>

      {/* ---------------- OTHER ---------------- */}
      <section className="space-y-3" aria-labelledby="other">
        <h2 id="other" className={h2}>Children, links and changes</h2>
        {/* TODO-REVIEW */}
        <p className={p}>
          This website is not directed at children under 13, and we do not knowingly collect their personal
          information.
        </p>
        {/* TODO-REVIEW */}
        <p className={p}>
          Links to other websites are provided for convenience; their own privacy policies apply.
        </p>
        {/* TODO-REVIEW */}
        <p className={p}>
          We may update this policy when the website or the services it uses change. The date at the top shows the
          latest version.
        </p>
      </section>

      <section className="space-y-3" aria-labelledby="contact">
        <h2 id="contact" className={h2}>Contact</h2>
        <p className={p}>
          Questions about this policy: <span className="font-medium text-foreground">{CONTACT_EMAIL}</span>, or use
          the <Link href="/contact" className={link}>contact page</Link>.
        </p>
      </section>
    </article>
  )
}
