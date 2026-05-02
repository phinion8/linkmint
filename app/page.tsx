import Navbar from "@/components/Navbar";
import ShortenForm from "@/components/ShortenForm";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 overflow-hidden">
        {/* ===== HERO ===== */}
        <section className="relative min-h-[90vh] flex items-center justify-center">
          {/* Background effects */}
          <div className="absolute inset-0 grid-pattern opacity-60" />
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#3B82F6]/[0.07] blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#60A5FA]/[0.05] blur-[100px] animate-float-delayed" />
          <div className="absolute top-[30%] right-[10%] w-[300px] h-[300px] rounded-full bg-[#3B82F6]/[0.04] blur-[80px] animate-float" />

          <div className="relative mx-auto max-w-5xl px-4 py-28 md:py-36 text-center">
            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.05]">
              <span className="text-gradient">Great links start</span>
              <br />
              <span className="text-gradient-mint">with a click</span>
            </h1>

            <p className="text-[#999999] text-lg md:text-xl max-w-2xl mx-auto mb-14 leading-relaxed">
              Shorten URLs, add monetization steps, and earn revenue from every
              visitor. Track clicks, manage links, and grow your earnings.
            </p>

            {/* Shorten Form */}
            <div className="max-w-2xl mx-auto">
              <ShortenForm />
            </div>

            <p className="text-[#555555] text-sm mt-6">
              No credit card required &bull; Start shortening in seconds
            </p>
          </div>
        </section>

        {/* ===== STATS BAR ===== */}
        <section className="relative border-y border-[#222222] py-16">
          <div className="absolute inset-0 bg-white/[0.01]" />
          <div className="relative mx-auto max-w-5xl px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {[
                { value: "10K+", label: "Links Created" },
                { value: "1M+", label: "Clicks Tracked" },
                { value: "5K+", label: "Publishers" },
                { value: "99.9%", label: "Uptime" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold tabular-nums text-gradient-mint">{stat.value}</p>
                  <p className="text-[#666666] text-sm mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className="relative py-28 md:py-36">
          <div className="absolute inset-0 mesh-gradient opacity-50" />
          <div className="relative mx-auto max-w-5xl px-4">
            <div className="text-center mb-20">
              <p className="text-[#3B82F6] text-sm font-semibold uppercase tracking-widest mb-4">How It Works</p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-5">
                Three steps to start earning
              </h2>
              <p className="text-[#999999] text-lg max-w-xl mx-auto">
                Set up your first monetized link in under a minute
              </p>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-[72px] left-[20%] right-[20%] h-[2px]">
                <div className="w-full h-full bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent" />
              </div>

              {[
                { num: "1", title: "Shorten Your URL", desc: "Paste any long URL and get a clean, short link. Add an optional title to stay organized." },
                { num: "2", title: "Visitors See Ads", desc: "Each click goes through timed ad steps with countdown timers before reaching the destination." },
                { num: "3", title: "Track & Earn", desc: "Monitor every click from your dashboard. See device types, referrers, and revenue in real time." },
              ].map((step) => (
                <div key={step.num} className="relative glass-card glass-card-hover p-8 md:p-10 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3B82F6]/20 to-[#3B82F6]/5 border border-[#3B82F6]/20 flex items-center justify-center text-2xl font-bold text-[#3B82F6] mx-auto mb-6 shadow-[0_0_30px_-8px_rgba(59,130,246,0.2)]">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-[#999999] text-[15px] leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FEATURES ===== */}
        <section className="relative py-28 md:py-36 border-t border-[#222222]">
          <div className="absolute inset-0 dot-grid opacity-40" />
          <div className="absolute bottom-0 left-[20%] w-[400px] h-[400px] rounded-full bg-[#3B82F6]/[0.04] blur-[100px]" />

          <div className="relative mx-auto max-w-5xl px-4">
            <div className="text-center mb-20">
              <p className="text-[#3B82F6] text-sm font-semibold uppercase tracking-widest mb-4">Features</p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-5">
                Everything you need to grow
              </h2>
              <p className="text-[#999999] text-lg max-w-xl mx-auto">
                Powerful tools built for publishers who want to monetize their links
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />,
                  title: "Link Shortening",
                  desc: "Generate clean, branded short URLs that are easy to share anywhere.",
                  gradient: "from-[#3B82F6]/20 to-[#3B82F6]/5",
                },
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
                  title: "Click Analytics",
                  desc: "Detailed breakdowns by device, referrer, geography, and time period.",
                  gradient: "from-[#60A5FA]/20 to-[#60A5FA]/5",
                },
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
                  title: "Ad Monetization",
                  desc: "Configurable timed ad steps generate revenue on every single visit.",
                  gradient: "from-amber-500/20 to-amber-500/5",
                },
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />,
                  title: "Custom Steps",
                  desc: "Set timer durations, button text, and ad content per step. Full control.",
                  gradient: "from-purple-500/20 to-purple-500/5",
                },
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
                  title: "Secure & Verified",
                  desc: "Server-side verification ensures every step is completed legitimately.",
                  gradient: "from-cyan-500/20 to-cyan-500/5",
                },
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />,
                  title: "Publisher Dashboard",
                  desc: "Manage all your links, view stats, and configure settings from one place.",
                  gradient: "from-rose-500/20 to-rose-500/5",
                },
              ].map((feature) => (
                <div key={feature.title} className="glass-card glass-card-hover p-7">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} border border-[#2A2A2A] flex items-center justify-center mb-5`}>
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      {feature.icon}
                    </svg>
                  </div>
                  <h3 className="text-[17px] font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-[#999999] text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="relative py-28 md:py-36 overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/[0.08] via-transparent to-[#60A5FA]/[0.05]" />
          <div className="absolute inset-0 dot-grid opacity-30" />
          {/* Corner glows */}
          <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-[#3B82F6]/[0.06] blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-[#60A5FA]/[0.05] blur-[80px]" />

          <div className="relative mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
              Ready to monetize your links?
            </h2>
            <p className="text-[#999999] text-lg mb-12 max-w-xl mx-auto leading-relaxed">
              Join publishers who are turning every shared link into a revenue stream. Free to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="group inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#3B82F6]/25 hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Started for Free
                <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </a>
              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-2xl border border-[#2A2A2A] bg-white/[0.04] px-8 py-4 text-base font-medium text-white transition-all duration-300 hover:bg-[#1A1A1A] hover:border-[#3A3A3A]"
              >
                Sign In
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-[#666666] text-sm">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Free forever plan
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                No credit card needed
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Setup in 30 seconds
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-[#222222] pt-16 pb-10">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-8 mb-16">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <span className="text-gradient-mint font-bold text-xl">LinkMint</span>
              <p className="text-[#666666] text-sm mt-3 leading-relaxed">
                The modern platform for link monetization.
              </p>
            </div>

            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Product</h4>
              <ul className="space-y-2.5">
                <li><a href="/#" className="text-[#666666] text-sm hover:text-[#CCCCCC] transition-colors">URL Shortener</a></li>
                <li><a href="/#" className="text-[#666666] text-sm hover:text-[#CCCCCC] transition-colors">Analytics</a></li>
                <li><a href="/#" className="text-[#666666] text-sm hover:text-[#CCCCCC] transition-colors">Ad Steps</a></li>
                <li><a href="/#" className="text-[#666666] text-sm hover:text-[#CCCCCC] transition-colors">Dashboard</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Resources</h4>
              <ul className="space-y-2.5">
                <li><a href="/#" className="text-[#666666] text-sm hover:text-[#CCCCCC] transition-colors">Documentation</a></li>
                <li><a href="/#" className="text-[#666666] text-sm hover:text-[#CCCCCC] transition-colors">API Reference</a></li>
                <li><a href="/#" className="text-[#666666] text-sm hover:text-[#CCCCCC] transition-colors">Blog</a></li>
                <li><a href="/#" className="text-[#666666] text-sm hover:text-[#CCCCCC] transition-colors">Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-2.5">
                <li><a href="/#" className="text-[#666666] text-sm hover:text-[#CCCCCC] transition-colors">About</a></li>
                <li><a href="/#" className="text-[#666666] text-sm hover:text-[#CCCCCC] transition-colors">Careers</a></li>
                <li><a href="/#" className="text-[#666666] text-sm hover:text-[#CCCCCC] transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Legal</h4>
              <ul className="space-y-2.5">
                <li><a href="/#" className="text-[#666666] text-sm hover:text-[#CCCCCC] transition-colors">Privacy</a></li>
                <li><a href="/#" className="text-[#666666] text-sm hover:text-[#CCCCCC] transition-colors">Terms</a></li>
                <li><a href="/#" className="text-[#666666] text-sm hover:text-[#CCCCCC] transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-[#222222]">
            <p className="text-[#555555] text-sm">&copy; {new Date().getFullYear()} LinkMint. All rights reserved.</p>
            <div className="flex items-center gap-5">
              <a href="/#" className="text-[#555555] hover:text-[#999999] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
              </a>
              <a href="/#" className="text-[#555555] hover:text-[#999999] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
