import Navbar from "@/components/Navbar";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-28 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
          <div className="space-y-6 text-[#999999] text-sm leading-relaxed">
            <p className="text-[#CCCCCC]">Last updated: May 2026</p>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">1. Information We Collect</h2>
              <p>When you create an account, we collect your name, email address, and password (stored securely hashed). When visitors click on shortened links, we collect anonymized data including IP address, user agent, device type, referrer, and approximate geographic location for analytics purposes.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">2. How We Use Your Information</h2>
              <p>We use the information collected to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Provide and maintain our URL shortening and monetization services</li>
                <li>Process earnings and payout requests</li>
                <li>Display click analytics and statistics in your dashboard</li>
                <li>Improve our platform and user experience</li>
                <li>Prevent fraud and abuse</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">3. Third-Party Advertising</h2>
              <p>We work with third-party advertising networks (including Adsterra) to display ads on interstitial pages. These networks may use cookies and similar technologies to serve ads based on user interests. We do not share your personal account information with advertisers.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">4. Cookies</h2>
              <p>We use essential cookies for authentication (JWT tokens stored in HTTP-only cookies). Third-party ad networks may set additional cookies for ad serving and analytics purposes.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">5. Data Retention</h2>
              <p>Account data is retained as long as your account is active. Click analytics data is retained for statistical purposes. You may request deletion of your account and associated data by contacting support.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">6. Data Security</h2>
              <p>We implement industry-standard security measures including password hashing (bcrypt), HTTPS encryption, and server-side verification for all transactions. However, no method of transmission over the Internet is 100% secure.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">7. Your Rights</h2>
              <p>You have the right to access, update, or delete your personal information at any time through your account settings. For data deletion requests, contact us at our support page.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">8. Changes to This Policy</h2>
              <p>We may update this privacy policy from time to time. We will notify users of any significant changes via email or through our platform.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">9. Contact</h2>
              <p>If you have questions about this privacy policy, please visit our <a href="/support" className="text-[#3B82F6] hover:text-[#2563EB]">support page</a>.</p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
