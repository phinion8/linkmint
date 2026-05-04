import Navbar from "@/components/Navbar";
import ShortenForm from "@/components/ShortenForm";
import ScrollReveal from "@/components/ScrollReveal";
import { supabase } from "@/lib/supabase";

export default async function HomePage() {
  const { data: settings } = await supabase.from("global_settings").select("cpm_rate").single();
  const cpm = settings?.cpm_rate ? Number(settings.cpm_rate).toFixed(2) : "1.50";

  // Pre-calculate earnings table
  const clicks = [1000, 5000, 10000, 50000, 100000];
  const earningsTable = clicks.map((c) => ({
    clicks: c.toLocaleString(),
    daily: `$${((c / 1000) * Number(cpm)).toFixed(2)}`,
    monthly: `$${(((c / 1000) * Number(cpm)) * 30).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
    highlight: c === 100000,
  }));
  return (
    <>
      <Navbar />
      <ScrollReveal />
      <main className="flex-1 overflow-hidden">
        {/* ===== HERO ===== */}
        <section className="relative min-h-screen flex items-center justify-center">
          <div className="absolute inset-0 grid-pattern opacity-40" />
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#3B82F6]/[0.07] blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#3B82F6]/[0.04] blur-[100px] animate-float-delayed" />

          <div className="relative mx-auto max-w-7xl px-6 pt-32 pb-20 text-center">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-bold tracking-tight mb-6 leading-[1.05]">
              <span className="text-white">Shorten. Share.</span>
              <br />
              <span className="text-[#3B82F6]">Get Paid.</span>
            </h1>

            <p className="text-[#999999] text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
              The free URL shortener that pays you for every click. Shorten links, track analytics, and earn money from every visitor — no website needed.
            </p>

            {/* Shorten Form */}
            <div className="max-w-3xl mx-auto mb-6">
              <ShortenForm />
            </div>

            <div className="flex items-center justify-center gap-6 text-xs text-[#666666]">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Free forever
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                No credit card
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Instant setup
              </span>
            </div>
          </div>

        </section>

        {/* ===== STATS ===== */}
        <section className="border-y border-[#1A1A1A] py-14">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: `$${cpm}`, label: "CPM Rate", sub: "per 1K views" },
                { value: "New", label: "Platform", sub: "and growing" },
                { value: "Growing", label: "Every Day", sub: "this month" },
                { value: "99.9%", label: "Uptime", sub: "guaranteed" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-white tabular-nums">{stat.value}</p>
                  <p className="text-[#999999] text-sm mt-1">{stat.label}</p>
                  <p className="text-[#444444] text-xs">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section id="how-it-works" className="py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                How it works
              </h2>
              <p className="text-[#999999] text-lg max-w-2xl mx-auto">
                Start earning in three simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  num: "01",
                  title: "Paste your URL",
                  desc: "Drop any link into our shortener. Get a clean, trackable short URL instantly.",
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />,
                },
                {
                  num: "02",
                  title: "Share everywhere",
                  desc: "Post your link on social media, forums, blogs, or anywhere people click.",
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />,
                },
                {
                  num: "03",
                  title: "Get paid",
                  desc: `Earn up to $${cpm} per 1,000 views. Track earnings and request payouts from your dashboard.`,
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
                },
              ].map((step) => (
                <div key={step.num} className="relative group">
                  <div className="bg-[#111111] border border-[#1A1A1A] rounded-2xl p-8 h-full hover:border-[#2A2A2A] transition-all duration-300">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          {step.icon}
                        </svg>
                      </div>
                      <span className="text-[#333333] text-sm font-mono font-bold">{step.num}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-[#999999] text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FEATURES ===== */}
        <section id="features" className="py-24 md:py-32 border-t border-[#1A1A1A]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Built for publishers
              </h2>
              <p className="text-[#999999] text-lg max-w-2xl mx-auto">
                Everything you need to monetize your traffic
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#1A1A1A]">
              {[
                {
                  title: "Real-time Analytics",
                  desc: "Track clicks, devices, referrers, and geography. Know exactly where your traffic comes from.",
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
                },
                {
                  title: "Wallet & Payouts",
                  desc: "Earnings deposited to your wallet automatically. Withdraw via PayPal (global) or UPI (India).",
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />,
                },
                {
                  title: "Custom Ad Steps",
                  desc: "Configure how many pages visitors see, timer duration per step, and button text. Full control.",
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />,
                },
                {
                  title: "Anti-Fraud Protection",
                  desc: "Server-side verification on every step. Bot traffic filtered automatically. Your earnings are safe.",
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
                },
                {
                  title: "Telegram Bot",
                  desc: "Shorten URLs directly from Telegram. Login, paste a link, get your short URL. That simple.",
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
                },
                {
                  title: "Publisher Dashboard",
                  desc: "All your links, earnings, and stats in one place. Create, manage, and optimize from a single dashboard.",
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />,
                },
              ].map((feature) => (
                <div key={feature.title} className="bg-black p-8 md:p-10 group hover:bg-[#0A0A0A] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#111111] border border-[#1A1A1A] flex items-center justify-center mb-5 group-hover:border-[#3B82F6]/20 transition-colors">
                    <svg className="w-5 h-5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      {feature.icon}
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-[#666666] text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== EARNINGS SECTION ===== */}
        <section id="pricing" className="py-24 md:py-32 border-t border-[#1A1A1A]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                How much can you earn?
              </h2>
              <p className="text-[#999999] text-lg max-w-2xl mx-auto">
                {`Earn $${cpm} per 1,000 completed ad views`}
              </p>
            </div>

            <div className="bg-[#111111] border border-[#1A1A1A] rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1A1A1A]">
                    <th className="text-left py-4 px-6 text-[#666666] font-medium">Daily Clicks</th>
                    <th className="text-left py-4 px-6 text-[#666666] font-medium">Daily Earnings</th>
                    <th className="text-left py-4 px-6 text-[#666666] font-medium">Monthly Earnings</th>
                  </tr>
                </thead>
                <tbody>
                  {earningsTable.map((row) => (
                    <tr key={row.clicks} className={`border-b border-[#1A1A1A] last:border-0 ${row.highlight ? "bg-[#3B82F6]/5" : ""}`}>
                      <td className="py-4 px-6 text-white font-medium">{row.clicks}</td>
                      <td className="py-4 px-6 text-[#3B82F6] font-semibold tabular-nums">{row.daily}</td>
                      <td className="py-4 px-6 text-emerald-400 font-semibold tabular-nums">{row.monthly}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-center text-[#444444] text-xs mt-4">
              {`Earnings based on $${cpm} CPM. Actual rates vary by geography and traffic quality.`}
            </p>
          </div>
        </section>

        {/* ===== COMPARISON ===== */}
        <section className="py-24 md:py-32 border-t border-[#1A1A1A]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Why LinkPearl?
              </h2>
              <p className="text-[#999999] text-lg max-w-2xl mx-auto">
                The only URL shortener that pays you. Here&apos;s how we compare.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b border-[#1A1A1A]">
                    <th className="text-left py-4 px-4 text-[#666666]">Feature</th>
                    <th className="py-4 px-4 text-center">
                      <span className="text-[#3B82F6] font-bold">LinkPearl</span>
                    </th>
                    <th className="py-4 px-4 text-center text-[#666666]">Bitly</th>
                    <th className="py-4 px-4 text-center text-[#666666]">TinyURL</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Free URL Shortening", lm: true, bitly: true, tiny: true },
                    { feature: "Earn Money Per Click", lm: true, bitly: false, tiny: false },
                    { feature: "Click Analytics", lm: true, bitly: true, tiny: false },
                    { feature: "Wallet & Payouts", lm: true, bitly: false, tiny: false },
                    { feature: "Ad Monetization", lm: true, bitly: false, tiny: false },
                    { feature: "Telegram Bot", lm: true, bitly: false, tiny: false },
                    { feature: "Custom Ad Steps", lm: true, bitly: false, tiny: false },
                    { feature: "No Monthly Fees", lm: true, bitly: false, tiny: true },
                  ].map((row) => (
                    <tr key={row.feature} className="border-b border-[#1A1A1A]/50">
                      <td className="py-3 px-4 text-[#CCCCCC]">{row.feature}</td>
                      <td className="py-3 px-4 text-center">
                        {row.lm ? <span className="text-emerald-400">✓</span> : <span className="text-[#333333]">✗</span>}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {row.bitly ? <span className="text-[#666666]">✓</span> : <span className="text-[#333333]">✗</span>}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {row.tiny ? <span className="text-[#666666]">✓</span> : <span className="text-[#333333]">✗</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ===== TESTIMONIALS ===== */}
        <section className="py-24 md:py-32 border-t border-[#1A1A1A]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Loved by publishers
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Sarah K.", role: "Content Creator", text: "I made $340 last month just sharing deals on Twitter. LinkPearl is the easiest passive income I've found.", earning: "$340/mo" },
                { name: "Raj P.", role: "Blogger", text: "Switched from Bitly. Same shortening, but now I actually earn from my links. The dashboard is clean and fast.", earning: "$120/mo" },
                { name: "Mike L.", role: "YouTuber", text: "I put LinkPearl links in my video descriptions. The Telegram bot makes it super quick to generate short URLs.", earning: "$210/mo" },
              ].map((t) => (
                <div key={t.name} className="bg-[#111111] border border-[#1A1A1A] rounded-2xl p-6 hover:border-[#2A2A2A] transition-colors">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => <span key={i} className="text-amber-400 text-sm">★</span>)}
                  </div>
                  <p className="text-[#CCCCCC] text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">{t.name}</p>
                      <p className="text-[#666666] text-xs">{t.role}</p>
                    </div>
                    <span className="text-emerald-400 text-sm font-bold">{t.earning}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className="py-24 md:py-32 border-t border-[#1A1A1A]">
          <div className="mx-auto max-w-3xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Frequently asked questions
              </h2>
            </div>
            <div className="space-y-3">
              {[
                { q: "How do I earn money?", a: "Create short links and share them anywhere. When visitors click your links and complete the ad steps, you earn revenue based on our CPM rate per 1,000 completed views." },
                { q: "Is LinkPearl really free?", a: "Yes, completely free. We earn from advertising shown on the interstitial pages, and share a portion of that revenue with you. No hidden fees, no monthly charges." },
                { q: "How much can I earn per click?", a: `Our current CPM rate is shown on the dashboard. Earnings vary by traffic geography — US/UK traffic earns significantly more than other regions.` },
                { q: "When can I withdraw my earnings?", a: "You can request a payout once your wallet balance reaches the minimum threshold. Payouts are processed via PayPal (global) or UPI (India only) within 24 hours." },
                { q: "What kind of links can I shorten?", a: "Any legitimate URL. We prohibit links to malware, phishing, illegal content, or anything that violates our Terms of Service. Violations result in account termination." },
                { q: "Is bot traffic allowed?", a: "No. All traffic must be legitimate human visitors. We use server-side verification and anti-fraud systems. Accounts caught using bots or click farms are permanently banned." },
                { q: "Can I use LinkPearl without a website?", a: "Absolutely! Share your short links on social media, forums, messaging apps, YouTube descriptions, or anywhere people click links. No website needed." },
                { q: "Do you have an API or Telegram bot?", a: "Yes! We have a Telegram bot (@linkpearl_bot) where you can shorten URLs instantly. API access is available for developers." },
              ].map((item) => (
                <details key={item.q} className="group bg-[#111111] border border-[#1A1A1A] rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between p-5 cursor-pointer text-white text-sm font-medium hover:bg-[#141414] transition-colors list-none">
                    {item.q}
                    <svg className="w-4 h-4 text-[#666666] transition-transform duration-300 group-open:rotate-180 shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-5 text-[#999999] text-sm leading-relaxed border-t border-[#1A1A1A] pt-4">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="py-24 md:py-32 border-t border-[#1A1A1A]">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Start earning today
            </h2>
            <p className="text-[#999999] text-lg mb-8">
              Join thousands of publishers earning from every link they share.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/register" className="inline-flex items-center justify-center bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200">
                Create Free Account
              </a>
              <a href="/login" className="inline-flex items-center justify-center bg-[#111111] hover:bg-[#1A1A1A] border border-[#2A2A2A] text-white font-medium px-8 py-3.5 rounded-xl transition-all duration-200">
                Sign In
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-[#1A1A1A] py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center">
                <span className="text-white font-bold text-xs leading-none">L</span>
              </div>
              <span className="text-white font-semibold">LinkPearl</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-[#666666]">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms</a>
              <a href="/support" className="hover:text-white transition-colors">Support</a>
            </div>
            <p className="text-[#444444] text-sm">&copy; {new Date().getFullYear()} LinkPearl</p>
          </div>
        </div>
      </footer>
    </>
  );
}
