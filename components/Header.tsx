"use client"

import Link from "next/link"
import { useState } from "react"
import ThemeToggle from "./ThemeToggle"
import SupportButton from "./SupportButton"

export default function Header() {

  const [menuOpen,setMenuOpen] = useState(false)

  return (

<header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur dark:bg-black/80">

<div className="max-w-7xl mx-auto px-6">

<div className="flex items-center justify-between py-4">

{/* Logo */}

<Link
href="/"
className="font-bold text-lg tracking-tight hover:opacity-80"
>
Mock<span className="text-green-600">APIs</span>
</Link>


{/* Desktop Navigation */}

<nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700 dark:text-gray-300">

<Link
href="/"
className="hover:text-black dark:hover:text-white transition"
>
Home
</Link>

<Link
href="/apis"
className="hover:text-black dark:hover:text-white transition"
>
APIs
</Link>

<Link
href="/docs"
className="hover:text-black dark:hover:text-white transition"
>
Docs
</Link>

<Link
href="/playground"
className="hover:text-black dark:hover:text-white transition"
>
Playground
</Link>

<Link
href="/tools"
className="hover:text-black dark:hover:text-white transition"
>
Tools
</Link>

<Link
href="/learn"
className="hover:text-black dark:hover:text-white transition"
>
Learn
</Link>

<Link
href="/http-status-codes"
className="hover:text-black dark:hover:text-white transition"
>
HTTP Codes
</Link>

</nav>


{/* Right Side */}

<div className="flex items-center gap-3">

{/* Language */}

<select
className="hidden md:block border rounded-md px-2 py-1 text-sm bg-transparent dark:border-gray-700"
defaultValue="en"
>
<option value="en">EN</option>
<option value="hi">HI</option>
<option value="fr">FR</option>
<option value="de">DE</option>
<option value="es">ES</option>
</select>


{/* Theme Toggle */}

<ThemeToggle/>


{/* Support */}

<SupportButton/>


{/* Mobile Menu Button */}

<button
onClick={()=>setMenuOpen(!menuOpen)}
className="md:hidden text-xl text-gray-600 dark:text-gray-300"
>
☰
</button>

</div>

</div>


{/* Mobile Navigation */}

{menuOpen && (

<div className="md:hidden pb-4 border-t border-gray-200 dark:border-gray-800 pt-4 space-y-3 text-sm">

<Link href="/" className="block">
Home
</Link>

<Link href="/apis" className="block">
APIs
</Link>

<Link href="/docs" className="block">
Docs
</Link>

<Link href="/playground" className="block">
Playground
</Link>

<Link href="/tools" className="block">
Tools
</Link>

<Link href="/learn" className="block">
Learn
</Link>

<Link href="/http-status-codes" className="block">
HTTP Status Codes
</Link>

</div>

)}

</div>

</header>

  )

}