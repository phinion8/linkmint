import Navbar from "@/components/Navbar";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-28 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Terms of Service</h1>
          <div className="space-y-6 text-[#999999] text-sm leading-relaxed">
            <p className="text-[#CCCCCC]">Last updated: May 2026</p>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">1. Acceptance of Terms</h2>
              <p>By creating an account or using LinkMint, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use our services.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">2. Description of Service</h2>
              <p>LinkMint provides a URL shortening service with ad monetization. Publishers can create shortened URLs that display advertisement pages to visitors before redirecting them to the destination URL. Publishers earn revenue based on completed ad impressions.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">3. Publisher Earnings & CPM Rates</h2>
              <p>Publishers earn revenue based on a CPM (Cost Per Mille) rate for every 1,000 completed ad impressions on their shortened links.</p>
              <div className="mt-3 p-4 bg-[#111111] border border-[#2A2A2A] rounded-xl">
                <p className="text-white font-medium mb-2">Important Notice:</p>
                <p><strong className="text-amber-400">LinkMint reserves the right to change, modify, or adjust CPM rates at any time, without prior notice.</strong> CPM rates may vary based on factors including but not limited to: advertiser demand, geographic location of traffic, traffic quality, seasonal fluctuations, and market conditions. Publishers will be notified of significant rate changes through the platform dashboard, but continued use of the service after any rate change constitutes acceptance of the new rates.</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">4. Payouts</h2>
              <p>Publishers may request payouts when their wallet balance meets the minimum payout threshold. Payouts are processed via available payment methods (PayPal, bank transfer, cryptocurrency). LinkMint reserves the right to withhold payments in cases of suspected fraud or Terms of Service violations. Payout processing times may vary.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">5. Prohibited Content</h2>
              <p>You may not use LinkMint to shorten URLs that link to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Malware, viruses, or harmful software</li>
                <li>Phishing or fraudulent websites</li>
                <li>Illegal content or activities</li>
                <li>Content that infringes on intellectual property rights</li>
                <li>Excessive violence, hate speech, or harassment</li>
                <li>Child exploitation material (zero tolerance)</li>
              </ul>
              <p className="mt-2">Violation of these rules will result in immediate account termination and forfeiture of any unpaid earnings.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">6. Traffic Quality</h2>
              <p>All traffic must be legitimate human traffic. The following are strictly prohibited:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Bot traffic or automated clicks</li>
                <li>Self-clicking or incentivized clicking</li>
                <li>Traffic from click farms or paid-to-click services</li>
                <li>Using iframes or hidden redirects to generate artificial impressions</li>
                <li>Any form of click fraud or impression manipulation</li>
              </ul>
              <p className="mt-2">LinkMint uses server-side verification and anti-fraud systems to detect fraudulent activity. Accounts found engaging in fraud will be permanently banned with all earnings forfeited.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">7. Account Termination</h2>
              <p>LinkMint may suspend or terminate your account at any time for violations of these terms, suspicious activity, or at our sole discretion. You may also delete your account at any time. Upon termination, any pending earnings below the minimum payout threshold will be forfeited.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">8. Ad Blockers</h2>
              <p>LinkMint&apos;s service relies on ad revenue. Visitors using ad blockers may be required to disable them before proceeding through shortened links. This is essential to maintaining the free service and publisher earnings.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">9. Limitation of Liability</h2>
              <p>LinkMint is provided &quot;as is&quot; without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service, including but not limited to loss of earnings, data, or business opportunities.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">10. Modifications to Terms</h2>
              <p>We reserve the right to modify these terms at any time. Continued use of the service after modifications constitutes acceptance of the updated terms. We encourage you to review these terms periodically.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">11. Contact</h2>
              <p>For questions regarding these terms, please visit our <a href="/support" className="text-[#3B82F6] hover:text-[#2563EB]">support page</a>.</p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
