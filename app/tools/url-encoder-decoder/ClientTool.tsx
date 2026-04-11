"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

/* 🔐 HASH FUNCTION */
async function hashText(text: string, algo: string) {
  const buffer = new TextEncoder().encode(text)
  const hash = await crypto.subtle.digest(algo, buffer)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export default function ClientTool() {
  const searchParams = useSearchParams()

  const [tool, setTool] = useState<"url" | "base64" | "hash">("url")
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [copied, setCopied] = useState(false)
  const [auto, setAuto] = useState(true)
  const [error, setError] = useState("")
  const [fileName, setFileName] = useState("")
  const [encoding, setEncoding] = useState("utf-8")
  const [hashType, setHashType] = useState("SHA-256")

  /* ✅ INIT FROM URL (FIXED deps) */
  useEffect(() => {
    const val = searchParams.get("input")
    const t = searchParams.get("tool")

    if (val) setInput(decodeURIComponent(val))
    if (t === "url" || t === "base64" || t === "hash") {
      setTool(t)
    }
  }, [searchParams]) // ✅ FIX

  /* ✅ CONVERT */
  const convert = async () => {
    try {
      if (!input) {
        setOutput("")
        return
      }

      let result = ""

      if (tool === "url") {
        const res = await fetch("/api/encode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: input,
            mode,
            encoding,
          }),
        })

        const data = await res.json()
        result = data.result
      }

      if (tool === "base64") {
        result = mode === "encode" ? btoa(input) : atob(input)
      }

      if (tool === "hash") {
        result = await hashText(input, hashType)
      }

      setOutput(result)
      setError("")
    } catch {
      setError("Invalid input")
      setOutput("")
    }
  }

  /* ✅ AUTO (FIXED deps) */
  useEffect(() => {
    if (auto) {
      convert()
    }
  }, [input, mode, tool, encoding, hashType, auto]) // ✅ FIX

  /* COPY */
  const copy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  /* SHARE */
  const share = async () => {
    const url = `${window.location.origin}/tools/url-encoder-decoder?tool=${tool}&input=${encodeURIComponent(
      input
    )}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
  }

  /* CLEAR */
  const clear = () => {
    setInput("")
    setOutput("")
    setFileName("")
    setError("")
  }

  /* FILE */
  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      setInput(reader.result as string)
      setFileName(file.name)
    }
    reader.readAsText(file)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

      {/* 🚀 UI stays EXACT SAME BELOW */}