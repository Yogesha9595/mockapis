"use client"

import Link from "next/link"
import { Send, Globe } from "lucide-react"
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa"
import { motion } from "framer-motion"

export default function Footer() {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 }
    })
  }

  return (
    <footer className="bg-gradient-to-b from-[#0b0f19] to-black text-gray-400 mt-20 border-t border-gray-800">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">

        {/* GRID */}
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">

          {/* BRAND */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={0}>
            <h3 className="text-white text-xl font-bold mb-3">
              DevUtilities Lab 🚀
            </h3>

            <p className="text-sm leading-relaxed">
              Free developer tools to build faster ⚡  
              Mock APIs • JSON Tools • Converters • Compilers  
            </p>

            {/* SOCIAL */}
            <div className="flex gap-3 mt-5">

              {[{
                icon: <Globe size={18} />,
                href: "https://devutilitieslab.com"
              },{
                icon: <Send size={18} />,
                href: "https://t.me/devutilities_lab",
                extra: "hover:bg-[#229ED9]/20"
              },{
                icon: <FaGithub size={16} />,
                href: "https://github.com/devutilitieslab"
              },{
                icon: <FaLinkedin size={16} />,
                href: "https://linkedin.com/company/devutilitieslab",
                extra: "hover:bg-[#0A66C2]/20"
              },{
                icon: <FaFacebook size={16} />,
                href: "https://facebook.com/devutilitieslab",
                extra: "hover:bg-[#1877F2]/20"
              }].map((item, i) => (
                <motion.a
                  key={i}
                  href={item.href}
                  target="_blank"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`icon transition-all duration-300 ${item.extra || ""}`}
                >
                  {item.icon}
                </motion.a>
              ))}

            </div>
          </motion.div>

          {/* LINKS */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}>
            <h3 className="text-white font-semibold mb-3">Tools</h3>
            <ul className="space-y-2 text-sm">
              <li><Link className="hover:text-white transition" href="/tools">All Tools</Link></li>
              <li><Link className="hover:text-white transition" href="/mock-api">Mock APIs</Link></li>
              <li><Link className="hover:text-white transition" href="/json-tools">JSON Tools</Link></li>
            </ul>
          </motion.div>

          {/* RESOURCES */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={2}>
            <h3 className="text-white text-sm font-semibold mb-3 uppercase">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link className="hover:text-white transition" href="/blog">Blog</Link></li>
              <li><Link className="hover:text-white transition" href="/docs">Documentation</Link></li>
              <li><Link className="hover:text-white transition" href="/learn">Learn</Link></li>
            </ul>
          </motion.div>

          {/* LEGAL */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={3}>
            <h3 className="text-white text-sm font-semibold mb-3 uppercase">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link className="hover:text-white transition" href="/about">About</Link></li>
              <li><Link className="hover:text-white transition" href="/contact">Contact</Link></li>
              <li><Link className="hover:text-white transition" href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link className="hover:text-white transition" href="/terms">Terms & Conditions</Link></li>
              <li><Link className="hover:text-white transition" href="/disclaimer">Disclaimer</Link></li>
              <li><Link className="hover:text-white transition" href="/cookie-policy">Cookie Policy</Link></li>
            </ul>
          </motion.div>

        </div>

        {/* CTA */}
        <motion.div
          className="mt-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="relative bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-gray-800 rounded-xl p-6 text-center backdrop-blur overflow-hidden">

            {/* subtle glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-2xl opacity-40" />

            <h4 className="relative text-white text-lg font-semibold mb-2">
              🚀 Build Faster with DevUtilities
            </h4>

            <p className="relative text-sm text-gray-400 mb-4">
              Free tools. No login. Built for developers.
            </p>

            <div className="relative flex flex-col sm:flex-row justify-center gap-3">

              <motion.a
                href="/"
                whileHover={{ scale: 1.05 }}
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm shadow"
              >
                Explore Tools
              </motion.a>

              <motion.a
                href="https://t.me/devutilities_lab"
                target="_blank"
                whileHover={{ scale: 1.05 }}
                className="border border-gray-600 hover:border-white px-5 py-2 rounded-lg text-sm"
              >
                Join Telegram
              </motion.a>

            </div>
          </div>
        </motion.div>

        {/* EMAIL */}
        <div className="text-center text-sm text-gray-500 mt-10">
          hello@devutilitieslab.com
        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} DevUtilities Lab 🚀
        </div>

      </div>
    </footer>
  )
}