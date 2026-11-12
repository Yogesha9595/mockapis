/**
 * Builds a safe `srcdoc` for previewing untrusted HTML.
 *
 * Defense in depth (all layers apply together):
 *  1. The iframe is sandboxed WITHOUT allow-same-origin → opaque origin, so
 *     nothing inside can read this site's cookies, storage or DOM.
 *  2. Every <script>, inline on* handler, javascript: URL and <base> tag from
 *     the untrusted HTML is removed.
 *  3. A Content-Security-Policy <meta> is injected first in <head>: only our
 *     inspector script (matching a per-render nonce) may run; no fetch/XHR/
 *     WebSocket, forms, plugins or nested frames.
 * Images, stylesheets and fonts may still load so the preview looks right.
 */

export type InspectorMessage = {
  source: "devutils-preview"
  type: "hover" | "select"
  element: {
    tag: string
    id: string
    className: string
    width: number
    height: number
    margin: Box
    padding: Box
    border: Box
  }
}

type Box = { top: number; right: number; bottom: number; left: number }

const DANGEROUS_URL = /^\s*(javascript|vbscript|data:text\/html)/i
const URL_ATTRS = ["href", "src", "action", "formaction", "xlink:href", "srcdoc"]

function randomNonce(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")
}

/** Inspector runs inside the sandbox and only posts plain measurement data. */
const INSPECTOR = `(() => {
  let overlay = null;
  const num = (v) => parseFloat(v) || 0;
  const box = (s, p) => ({ top: num(s[p + "Top"]), right: num(s[p + "Right"]), bottom: num(s[p + "Bottom"]), left: num(s[p + "Left"]) });
  const describe = (el) => {
    const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
    return { tag: el.tagName.toLowerCase(), id: String(el.id || "").slice(0, 200),
      className: typeof el.className === "string" ? el.className.slice(0, 300) : "",
      width: r.width, height: r.height, margin: box(s, "margin"), padding: box(s, "padding"),
      border: { top: num(s.borderTopWidth), right: num(s.borderRightWidth), bottom: num(s.borderBottomWidth), left: num(s.borderLeftWidth) } };
  };
  const send = (type, el) => parent.postMessage({ source: "devutils-preview", type, element: describe(el) }, "*");
  document.addEventListener("mouseover", (e) => {
    const el = e.target;
    if (!(el instanceof Element) || el === document.body || el === document.documentElement) return;
    if (!overlay) { overlay = document.createElement("div");
      overlay.style.cssText = "position:absolute;pointer-events:none;border:2px solid #3b82f6;background:rgba(59,130,246,.1);z-index:2147483647";
      document.body.appendChild(overlay); }
    const r = el.getBoundingClientRect();
    overlay.style.top = r.top + scrollY + "px"; overlay.style.left = r.left + scrollX + "px";
    overlay.style.width = r.width + "px"; overlay.style.height = r.height + "px";
    send("hover", el);
  });
  document.addEventListener("click", (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.target instanceof Element) send("select", e.target);
  }, true);
})();`

export function buildPreviewDocument(untrustedHtml: string): string {
  const doc = new DOMParser().parseFromString(untrustedHtml || "<!doctype html><html><body></body></html>", "text/html")

  // 2. Strip active content
  doc.querySelectorAll("script, base, noscript, object, embed, applet, meta[http-equiv]").forEach((el) => el.remove())
  doc.querySelectorAll("*").forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase()
      if (name.startsWith("on")) el.removeAttribute(attr.name)
      else if (URL_ATTRS.includes(name) && DANGEROUS_URL.test(attr.value)) el.removeAttribute(attr.name)
    }
  })

  // 3. CSP + nonce-gated inspector
  const nonce = randomNonce()
  const csp = doc.createElement("meta")
  csp.setAttribute("http-equiv", "Content-Security-Policy")
  csp.setAttribute(
    "content",
    [
      "default-src 'none'",
      `script-src 'nonce-${nonce}'`,
      "style-src * 'unsafe-inline' data:",
      "img-src * data: blob:",
      "font-src * data:",
      "media-src * data: blob:",
      "connect-src 'none'",
      "form-action 'none'",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'none'",
    ].join("; ")
  )
  doc.head.prepend(csp)

  const script = doc.createElement("script")
  script.setAttribute("nonce", nonce)
  script.textContent = INSPECTOR
  doc.body.appendChild(script)

  const doctype = doc.doctype ? `<!DOCTYPE ${doc.doctype.name}>` : "<!DOCTYPE html>"
  return `${doctype}\n${doc.documentElement.outerHTML}`
}

/** Type guard for messages coming from the preview iframe. */
export function isInspectorMessage(data: unknown): data is InspectorMessage {
  if (typeof data !== "object" || data === null) return false
  const d = data as Partial<InspectorMessage>
  return (
    d.source === "devutils-preview" &&
    (d.type === "hover" || d.type === "select") &&
    typeof d.element === "object" &&
    d.element !== null &&
    typeof d.element.tag === "string" &&
    typeof d.element.width === "number"
  )
}
