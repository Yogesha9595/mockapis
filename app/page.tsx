"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import ApiWidget from "@/components/ApiWidget"
import ApiCodeTerminal from "@/components/ApiCodeTerminal"

export default function Home() {

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 }
    })
  }

  return (
    <main>

      {/* 🔥 HERO */}
      <section className="relative w-full py-28 overflow-hidden bg-white dark:bg-[#020617]">

        {/* GRID BG */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

          {/* glow */}
          <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-green-500/20 blur-[160px] rounded-full" />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 grid md:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <motion.div initial="hidden" animate="show">

            {/* BADGE */}
            <motion.div custom={0} variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-white/5 backdrop-blur text-sm font-medium">
              🚀 Free Developer Tools Platform
            </motion.div>

            {/* HEADING */}
            <motion.h1 custom={1} variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
              Build Faster with
              <span className="block bg-gradient-to-r from-green-500 to-emerald-400 bg-clip-text text-transparent">
                DevUtilities Lab
              </span>
            </motion.h1>

            {/* DESCRIPTION */}
            <motion.p custom={2} variants={fadeUp}
              className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl">
              Powerful mock APIs, JSON tools, compilers, converters, and developer utilities to help you build, test, and ship faster.
            </motion.p>

            {/* CTA */}
            <motion.div custom={3} variants={fadeUp}
              className="flex flex-wrap gap-4">
              <Link
                href="/playground"
                className="bg-green-600 hover:bg-green-700 transition text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-[1.03]"
              >
                🚀 Start Testing APIs
              </Link>

              <Link
                href="/tools"
                className="border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 transition px-6 py-3 rounded-lg font-medium"
              >
                Explore Tools
              </Link>
            </motion.div>

            {/* TRUST */}
            <motion.div custom={4} variants={fadeUp}
              className="flex gap-10 mt-12 text-sm text-gray-500">
              {[
                { value: "10k+", label: "Developers" },
                { value: "100+", label: "Tools" },
                { value: "99.9%", label: "Uptime" }
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-xl font-semibold text-black dark:text-white">
                    {item.value}
                  </p>
                  {item.label}
                </div>
              ))}
            </motion.div>

          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="rounded-2xl border border-white/20 bg-white/10 dark:bg-white/5 backdrop-blur-xl shadow-2xl p-4 hover:shadow-green-500/10 transition">
              <ApiCodeTerminal />
            </div>
          </motion.div>

        </div>

        {/* divider */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
      </section>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6">

        {/* API TESTER */}
        <section className="py-24">
          <ApiWidget />
        </section>

        {/* FEATURES */}
        <section className="py-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 tracking-tight">
            Built for Developers
          </h2>

          <div className="grid md:grid-cols-3 gap-10">

            {[
              {
                title: "Mock REST APIs",
                desc: "Instantly test CRUD operations with realistic API responses."
              },
              {
                title: "API Playground",
                desc: "Send API requests directly in your browser."
              },
              {
                title: "Developer Learning",
                desc: "Learn APIs, HTTP codes, and backend fundamentals."
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className="p-8 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-[#020617] hover:shadow-2xl"
              >
                <h3 className="font-semibold text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {item.desc}
                </p>
              </motion.div>
            ))}

          </div>
        </section>

        {/* SEO SECTION */}
        <section className="py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Free Developer Tools for Faster Workflow
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            DevUtilities Lab provides mock APIs, JSON tools, compilers,
            converters, and utilities to speed up development.
          </p>
        </section>

      </div>

    </main>
  )
}