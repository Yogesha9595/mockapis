export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-10 bg-black text-white">

      {/* HEADER */}
      <div className="space-y-4 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          Privacy Policy 🔐
        </h1>
        <p className="text-gray-400 text-sm">
          Last updated: {new Date().getFullYear()}
        </p>
      </div>

      {/* INTRO */}
      <p className="text-gray-300 leading-relaxed">
        At <span className="text-white font-medium">DevUtilities Lab</span>, 
        accessible from devutilitieslab.com, protecting the privacy of our 
        visitors is one of our main priorities. This Privacy Policy document 
        outlines the types of information that are collected and how we use it.
      </p>

      {/* INFO COLLECTED */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          📊 Information We Collect
        </h2>
        <p className="text-gray-300">
          We may collect personal information such as your name and email address 
          only when you voluntarily provide it (e.g., through contact forms).
        </p>
      </section>

      {/* LOG FILES */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          📁 Log Files
        </h2>
        <p className="text-gray-300">
          DevUtilities Lab follows a standard procedure of using log files. 
          These files log visitors when they visit websites. Information collected 
          may include IP address, browser type, ISP, date/time stamp, referring pages, 
          and number of clicks. This data is used for analytics and improving user experience.
        </p>
      </section>

      {/* COOKIES */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          🍪 Cookies & Web Beacons
        </h2>
        <p className="text-gray-300">
          We use cookies to store visitor preferences and optimize user experience 
          by customizing our web page content based on browser type or other information.
        </p>
      </section>

      {/* ADSENSE */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          💰 Google AdSense & Advertising
        </h2>
        <p className="text-gray-300">
          We may use Google AdSense to display ads. Google uses cookies (such as DART cookies) 
          to serve ads to users based on their visit to this website and other sites on the internet.
        </p>

        <p className="text-gray-300">
          Users may opt out of personalized advertising by visiting{" "}
          <a
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            className="text-green-400 underline"
          >
            Google Ads Settings
          </a>.
        </p>
      </section>

      {/* THIRD PARTY */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          🔗 Third-Party Privacy Policies
        </h2>
        <p className="text-gray-300">
          DevUtilities Lab's Privacy Policy does not apply to other advertisers or websites. 
          We advise you to consult the respective Privacy Policies of third-party services 
          for more detailed information.
        </p>
      </section>

      {/* DATA SECURITY */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          🔒 Data Security
        </h2>
        <p className="text-gray-300">
          We implement appropriate security measures to protect your information. 
          However, no method of transmission over the Internet is 100% secure.
        </p>
      </section>

      {/* CHILDREN */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          👶 Children's Information
        </h2>
        <p className="text-gray-300">
          We do not knowingly collect any Personal Identifiable Information from children 
          under the age of 13. If you believe that your child has provided such information, 
          please contact us and we will promptly remove it.
        </p>
      </section>

      {/* CONSENT */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          ✅ Consent
        </h2>
        <p className="text-gray-300">
          By using our website, you hereby consent to our Privacy Policy 
          and agree to its terms.
        </p>
      </section>

      {/* CONTACT */}
      <section className="space-y-3 border-t border-gray-800 pt-6">
        <h2 className="text-xl font-semibold text-white">
          📬 Contact Us
        </h2>
        <p className="text-gray-300">
          If you have any questions about this Privacy Policy, you can contact us at:
        </p>

        <p className="text-white font-medium">
          hello@devutilitieslab.com
        </p>
      </section>

    </div>
  )
}