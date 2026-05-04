import Navbar from "@/components/Navbar";

export default function TelegramPage() {
  const commands = [
    { cmd: "/start", desc: "Welcome message and quick overview", icon: "👋" },
    { cmd: "/login email password", desc: "Sign in to your LinkPearl account", icon: "🔐" },
    { cmd: "/register name email password", desc: "Create a new account instantly", icon: "✨" },
    { cmd: "/profile", desc: "View your account details and stats", icon: "👤" },
    { cmd: "/wallet", desc: "Check your balance, earnings, and payout info", icon: "💰" },
    { cmd: "/earnings", desc: "See your recent earnings breakdown", icon: "📈" },
    { cmd: "/stats", desc: "Total clicks, links, and revenue overview", icon: "📊" },
    { cmd: "/links", desc: "View your 10 most recent shortened links", icon: "🔗" },
    { cmd: "/payout", desc: "Request a payout from your wallet", icon: "💸" },
    { cmd: "/help", desc: "Show all available commands", icon: "❓" },
    { cmd: "/logout", desc: "Sign out of your account", icon: "👋" },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 rounded-2xl bg-[#3B82F6]/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-[#3B82F6]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141a.506.506 0 01.171.325c.016.093.036.306.02.472z"/>
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              LinkPearl Telegram Bot
            </h1>
            <p className="text-[#999999] text-lg max-w-xl mx-auto mb-8">
              Shorten URLs, check earnings, and manage your account — all from Telegram. No browser needed.
            </p>
            <a
              href="https://t.me/linkmint_url_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141a.506.506 0 01.171.325c.016.093.036.306.02.472z"/>
              </svg>
              Open in Telegram
            </a>
          </div>

          {/* How it works */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white text-center mb-10">How it works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { step: "1", title: "Open the bot", desc: "Click the button above or search @linkmint_url_bot on Telegram" },
                { step: "2", title: "Login or register", desc: "Use /login or /register to connect your LinkPearl account" },
                { step: "3", title: "Paste any URL", desc: "Just send a URL — the bot instantly returns your short link" },
              ].map((s) => (
                <div key={s.step} className="bg-[#111111] border border-[#1A1A1A] rounded-2xl p-6 text-center hover:border-[#2A2A2A] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-[#3B82F6] font-bold">{s.step}</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">{s.title}</h3>
                  <p className="text-[#666666] text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Commands */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white text-center mb-10">All Commands</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {commands.map((c) => (
                <div key={c.cmd} className="flex items-start gap-3 bg-[#111111] border border-[#1A1A1A] rounded-xl p-4 hover:border-[#2A2A2A] transition-colors">
                  <span className="text-xl mt-0.5">{c.icon}</span>
                  <div>
                    <code className="text-[#3B82F6] text-sm font-mono font-medium">{c.cmd}</code>
                    <p className="text-[#999999] text-xs mt-1">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demo conversation */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white text-center mb-10">See it in action</h2>
            <div className="max-w-md mx-auto bg-[#111111] border border-[#1A1A1A] rounded-2xl p-6 space-y-4">
              {/* User message */}
              <div className="flex justify-end">
                <div className="bg-[#3B82F6] text-white text-sm px-4 py-2 rounded-2xl rounded-br-md max-w-[80%]">
                  https://www.example.com/very/long/url/that/nobody/wants/to/type
                </div>
              </div>
              {/* Bot response */}
              <div className="flex justify-start">
                <div className="bg-[#1A1A1A] text-white text-sm px-4 py-3 rounded-2xl rounded-bl-md max-w-[80%]">
                  <p className="font-medium mb-1">✅ Link shortened!</p>
                  <p className="text-[#3B82F6] font-mono">linkpearl.vercel.app/xK9mR2</p>
                  <p className="text-[#666666] text-xs mt-2">Original: example.com/very/long/url...</p>
                </div>
              </div>
              {/* User message */}
              <div className="flex justify-end">
                <div className="bg-[#3B82F6] text-white text-sm px-4 py-2 rounded-2xl rounded-br-md">/wallet</div>
              </div>
              {/* Bot response */}
              <div className="flex justify-start">
                <div className="bg-[#1A1A1A] text-white text-sm px-4 py-3 rounded-2xl rounded-bl-md max-w-[80%]">
                  <p className="font-medium mb-2">💰 Your Wallet</p>
                  <p className="text-xs text-[#999999]">Balance: <span className="text-[#3B82F6] font-bold">$12.50</span></p>
                  <p className="text-xs text-[#999999]">Total Earned: <span className="text-emerald-400 font-bold">$48.75</span></p>
                  <p className="text-xs text-[#999999]">Min Payout: <span className="text-white">$5.00</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href="https://t.me/linkmint_url_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200"
            >
              Start Using the Bot
            </a>
            <p className="text-[#555555] text-sm mt-4">Free forever. No limits.</p>
          </div>
        </div>
      </main>
    </>
  );
}
