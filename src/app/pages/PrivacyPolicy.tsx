import { motion } from "framer-motion";
import { Link } from "react-router";
import { Shield, ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-300 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background styling similar to home */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <Link to="/" className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12"
        >
          <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-8">
            <div className="p-3 bg-yellow-400/10 rounded-2xl border border-yellow-400/20">
              <Shield className="w-8 h-8 text-yellow-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Privacy Policy</h1>
          </div>

          <div className="space-y-8 text-lg leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
              <p>
                Welcome to TribeLink ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. The Data We Collect</h2>
              <p className="mb-4">
                TribeLink is designed to be a frictionless, login-free platform. However, to provide our services and ensure a safe environment, we may collect:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-400">
                <li><strong>Usage Data:</strong> Information about how you use our website, pages visited, and time spent.</li>
                <li><strong>Technical Data:</strong> IP address, browser type and version, time zone setting, operating system, and platform.</li>
                <li><strong>Communication Data:</strong> Chat messages during your active session. These are temporary and are not permanently stored on our servers after the session ends.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Cookies and Tracking Technologies</h2>
              <p className="mb-4">
                We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Specifically, we use cookies for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-400">
                <li><strong>Essential functionality:</strong> To maintain your session and matching state.</li>
                <li><strong>Google AdSense:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</li>
              </ul>
              <p className="mt-4">
                Users may opt out of personalized advertising by visiting <a href="https://myadcenter.google.com/" className="text-yellow-400 hover:underline" target="_blank" rel="noopener noreferrer">Ads Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting www.aboutads.info.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. User-Generated Content</h2>
              <p>
                While using our chat feature, you generate content. We do not permanently store your chat history. However, we employ automated moderation tools to monitor text in real-time to prevent abuse, harassment, and illegal activities. We reserve the right to temporarily log messages if a session is flagged for policy violations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Third-Party Links</h2>
              <p>
                This website may include links to third-party websites, plug-ins, and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Changes to the Privacy Policy</h2>
              <p>
                We keep our privacy policy under regular review. We will post any updates on this page. This version was last updated on {new Date().toLocaleDateString()}.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our privacy practices, please contact us at privacy@tribelink.com.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
