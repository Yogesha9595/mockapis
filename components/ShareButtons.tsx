"use client"

import { useEffect, useState } from "react"

export default function ShareButtons({ title }: { title: string }) {
  const [url, setUrl] = useState("")

  useEffect(() => {
    setUrl(window.location.href)
  }, [])

  return (
    <div className="flex gap-4 mt-10">

      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
          title
        )}&url=${url}`}
        target="_blank"
        className="text-blue-500 hover:underline"
      >
        Share on Twitter
      </a>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
        target="_blank"
        className="text-blue-700 hover:underline"
      >
        Share on LinkedIn
      </a>

    </div>
  )
}