"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface NavbarProps {
  variant?: "public" | "dashboard" | "admin" | "auth";
}

export default function Navbar({ variant = "public" }: NavbarProps) {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
        else setUser(null);
      })
      .catch(() => setUser(null))
      .finally(() => setAuthChecked(true));
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function handleLogout() {
    setUser(null);
    await fetch("/api/auth/login", { method: "DELETE" });
    router.push("/login");
    router.refresh();
  }

  const publicLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#pricing", label: "Earn" },
  ];

  const adminLinks = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/links", label: "Links" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/payouts", label: "Payouts" },
    { href: "/admin/tickets", label: "Tickets" },
    { href: "/admin/settings", label: "Settings" },
  ];

  const navLinks = variant === "admin" ? adminLinks : variant === "public" ? publicLinks : [];
  const hideRightSide = variant === "auth";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center py-4">
      <nav
        className={`w-[90%] md:w-[65%] transition-all duration-500 rounded-[16px] border ${
          isScrolled
            ? "bg-black/90 backdrop-blur-xl shadow-2xl shadow-black/30 border-[#2A2A2A]"
            : "bg-white/5 backdrop-blur-md border-white/10"
        }`}
      >
        <div className="flex items-center justify-between h-14 px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#3B82F6] blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
              <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-sm leading-none">L</span>
              </div>
            </div>
            <span className="text-lg font-bold text-white">LinkPearl</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className={`hidden md:flex items-center gap-1 ${hideRightSide ? "!hidden" : ""}`}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3.5 py-2 text-sm text-[#999999] hover:text-white transition-colors group"
              >
                <span className="relative z-10">{link.label}</span>
                <span className="absolute inset-0 rounded-lg bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className={`hidden md:flex items-center gap-2.5 ${hideRightSide ? "!hidden" : ""}`}>
            {!authChecked ? (
              <div className="w-20 h-8 bg-[#111111] rounded-lg animate-pulse" />
            ) : user ? (
              <>
                {variant !== "admin" && (
                  <Link href="/dashboard" className="text-sm text-[#999999] hover:text-white transition-colors px-3 py-1.5">
                    Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="text-sm text-[#666666] hover:text-white transition-colors px-3 py-1.5">
                  Log out
                </button>
                <Link
                  href="/dashboard/profile"
                  className="w-8 h-8 rounded-lg bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 border border-[#3B82F6]/20 transition-all duration-300 flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-[#999999] hover:text-white transition-colors px-3 py-1.5">
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium text-white bg-[#3B82F6] hover:bg-[#2563EB] px-4 py-2 rounded-lg transition-all duration-200"
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          {!hideRightSide && <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden relative w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center"
          >
            <div className="w-4.5 h-3.5 flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-white rounded-full transform transition-all duration-300 origin-center ${isMenuOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
              <span className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${isMenuOpen ? "opacity-0 scale-0" : ""}`} />
              <span className={`w-full h-0.5 bg-white rounded-full transform transition-all duration-300 origin-center ${isMenuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
            </div>
          </button>}
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="px-4 pb-4 pt-2 border-t border-white/10">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-[#CCCCCC] hover:text-white hover:bg-white/5 transition-all duration-200">
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-white/10 my-2" />
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 rounded-lg text-[#CCCCCC] hover:text-white hover:bg-white/5 transition-all">
                    Dashboard
                  </Link>
                  <Link href="/dashboard/profile" onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 rounded-lg text-[#CCCCCC] hover:text-white hover:bg-white/5 transition-all">
                    Profile
                  </Link>
                  <button onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                    className="px-4 py-3 rounded-lg text-left text-[#999999] hover:text-white hover:bg-white/5 transition-all">
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 rounded-lg text-[#CCCCCC] hover:text-white hover:bg-white/5 transition-all">
                    Log in
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}
                    className="mt-1 px-4 py-3 rounded-lg bg-[#3B82F6] text-white font-medium text-center">
                    Sign Up Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
