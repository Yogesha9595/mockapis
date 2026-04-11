export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-16">

      {/* HERO */}
     <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
  <span className="text-white">Contact </span>
  <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
    DevUtilities Lab
  </span>
  <span className="text-white"> 📬</span>
</h1>
      {/* EMAIL PRIMARY CARD */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl opacity-40 group-hover:opacity-60 transition" />

        <div className="relative bg-[#0f172a] border border-gray-800 rounded-2xl p-8 text-center shadow-lg">

          <p className="text-gray-400 mb-2">
            Reach us directly via email
          </p>

          <p className="text-white text-2xl font-semibold tracking-wide">
            hello@devutilitieslab.com
          </p>

          <p className="text-gray-400 text-sm mt-3">
            Response time: <span className="text-white">24–48 hours</span>
          </p>

        </div>
      </div>

      {/* GRID CARDS */}
      <div className="grid sm:grid-cols-2 gap-6">

        {[
          {
            title: "Technical Support",
            icon: "🛠",
            desc: "Facing issues with tools or APIs? We’ll help you fix them quickly.",
          },
          {
            title: "Feature Requests",
            icon: "💡",
            desc: "Suggest new tools or features — we build based on user feedback.",
          },
          {
            title: "Collaboration",
            icon: "🤝",
            desc: "Interested in partnerships or integrations? Let’s connect.",
          },
          {
            title: "Bug Reports",
            icon: "🐞",
            desc: "Found a bug? Report it and help improve the platform.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="group bg-[#0b1220] border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all"
          >
            <h3 className="text-white font-semibold mb-2 text-lg flex items-center gap-2">
              <span className="text-xl">{item.icon}</span>
              {item.title}
            </h3>

            <p className="text-gray-400 text-sm leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}

      </div>

      {/* CTA */}
      <div className="text-center">
        <a
          href="https://t.me/devutilities_lab"
          target="_blank"
          className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition"
        >
          🚀 Join Telegram Community
        </a>
      </div>

      {/* TRUST */}
      <div className="text-center text-sm text-gray-500 border-t border-gray-800 pt-6 max-w-2xl mx-auto">
        We respect your privacy. Your information will only be used to respond to your inquiry.
      </div>

    </div>
  )
}