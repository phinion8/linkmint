import Navbar from "@/components/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar variant="dashboard" />
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-20">
        {children}
      </main>

      {/* Telegram Bot Floating Bar */}
      <a
        href="/telegram"
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2.5 bg-[#111111] border border-[#2A2A2A] hover:border-[#3A3A3A] px-4 py-2.5 rounded-full shadow-xl shadow-black/30 transition-all hover:scale-105 group"
      >
        <svg className="w-5 h-5 text-[#3B82F6]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141a.506.506 0 01.171.325c.016.093.036.306.02.472z"/>
        </svg>
        <span className="text-white text-sm font-medium hidden sm:inline">Telegram Bot</span>
      </a>
    </>
  );
}
