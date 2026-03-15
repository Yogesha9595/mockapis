export function runTool(slug: string, input: string): string {
  try {
    /* ---------------- JSON TOOLS ---------------- */
    const jsonPretty = ["json-formatter", "json-pretty", "json-viewer"];

    if (jsonPretty.includes(slug)) {
      return JSON.stringify(JSON.parse(input), null, 2);
    }

    if (slug === "json-minify") {
      return JSON.stringify(JSON.parse(input));
    }

    if (slug === "json-validator") {
      JSON.parse(input);
      return "Valid JSON ✅";
    }

    // Note: For actual CSV/YAML/XML conversion, you'd usually import 
    // a library like 'js-yaml' or 'xml-js'. 
    const jsonConverters = ["json-to-csv", "json-to-tsv", "json-to-xml", "json-to-yaml"];
    if (jsonConverters.includes(slug)) {
       // Placeholder: In a real app, logic for conversion goes here.
       return `Conversion for ${slug} initiated. (Library required for full output)`;
    }

    /* ---------------- ENCODING ---------------- */
    if (slug === "base64-encoder") {
      return btoa(input);
    }

    if (slug === "base64-decoder") {
      return atob(input);
    }

    if (slug === "url-encoder") {
      return encodeURIComponent(input);
    }

    if (slug === "url-decoder") {
      return decodeURIComponent(input);
    }

    /* ---------------- DEV TOOLS ---------------- */
    if (slug === "uuid-generator") {
      return crypto.randomUUID();
    }

    if (slug === "jwt-decoder") {
      const parts = input.split(".");
      if (parts.length < 2) return "Invalid JWT Structure";
      
      // Fix: Use URL-safe base64 decoding logic
      const base64Url = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = atob(base64Url);
      return JSON.stringify(JSON.parse(payload), null, 2);
    }

    if (slug === "timestamp-converter") {
      const timestamp = Number(input);
      if (isNaN(timestamp)) return "Invalid timestamp";
      // Handles both seconds and milliseconds
      const date = timestamp < 10000000000 ? new Date(timestamp * 1000) : new Date(timestamp);
      return date.toISOString() + "\nLocal: " + date.toLocaleString();
    }

    /* ---------------- TEXT TOOLS ---------------- */
    if (slug === "text-sort") {
      return input.split("\n").sort().join("\n");
    }

    if (slug === "text-case-converter") {
      return input.toUpperCase();
    }

    if (slug === "word-counter") {
      const trimmed = input.trim();
      if (!trimmed) return "Word count: 0";
      const words = trimmed.split(/\s+/);
      const chars = input.length;
      return `Words: ${words.length}\nCharacters: ${chars}`;
    }

    /* ---------------- FORMATTERS & MINIFIERS ---------------- */
    const minifiers = ["html-minify", "css-minify", "xml-minify"];
    if (minifiers.includes(slug)) {
      return input.replace(/\s+/g, " ").trim();
    }

    if (["xml-formatter", "yaml-formatter"].includes(slug)) {
      return input; // Requires external library for actual beautification
    }

    return "Tool functionality coming soon!";

  } catch (err) {
    return "Error: Invalid input or processing failure.";
  }
}