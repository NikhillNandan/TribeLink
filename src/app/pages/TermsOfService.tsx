import { motion } from "framer-motion";
import { Link } from "react-router";
import { FileText, ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-300 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
              <FileText className="w-8 h-8 text-yellow-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Terms of Service</h1>
          </div>

          <div className="space-y-8 text-lg leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using TribeLink ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
              <p>
                TribeLink provides a platform for anonymous, ephemeral chat connecting users based on shared interests (e.g., sports teams, movies). The Service is provided "as is" and "as available".
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. User Conduct and User-Generated Content</h2>
              <p className="mb-4">
                You are solely responsible for all code, video, images, information, data, text, software, music, sound, photographs, graphics, messages or other materials ("Content") that you upload, post, publish or display or email or otherwise use via the Service. We reserve the right to investigate and take appropriate legal action against anyone who, in our sole discretion, violates this provision. Prohibited content includes, but is not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-400">
                <li>Content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, libelous, or invasive of another's privacy.</li>
                <li>Content that promotes racism, bigotry, hatred or physical harm of any kind against any group or individual.</li>
                <li>Content that exploits people in a sexual or violent manner.</li>
                <li>Spam, junk mail, or unsolicited mass mailing.</li>
              </ul>
              <p className="mt-4">
                We do not claim ownership of user-generated content. However, we reserve the right to monitor, review, and remove any content that violates these Terms of Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Intellectual Property</h2>
              <p>
                The Service and its original content (excluding User-Generated Content), features, and functionality are and will remain the exclusive property of TribeLink and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Disclaimer of Warranties</h2>
              <p>
                Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We expressly disclaim all warranties of any kind, whether express or implied.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Limitation of Liability</h2>
              <p>
                In no event shall TribeLink, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
