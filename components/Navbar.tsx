"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface NavbarProps {
  variant?: "public" | "dashboard" | "admin";
}

export default function Navbar({ variant = "public" }: NavbarProps) {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/login", { method: "DELETE" });
    router.push("/login");
    router.refresh();
  }

  const navLinks =
    variant === "admin"
      ? [
          { href: "/admin", label: "Dashboard" },
          { href: "/admin/links", label: "Links" },
          { href: "/admin/users", label: "Users" },
          { href: "/admin/payouts", label: "Payouts" },
          { href: "/admin/settings", label: "Settings" },
        ]
      : [];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <nav
        className={`max-w-5xl mx-auto transition-all duration-500 ${
          isScrolled
            ? "bg-black/90 backdrop-blur-xl shadow-2xl shadow-black/20 border-[#3B82F6]/20"
            : "bg-white/5 backdrop-blur-md border-white/10"
        } rounded-2xl border`}
      >
        <div className="flex items-center justify-between h-14 px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
            </div>
            <span className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#3B82F6] group-hover:to-[#60A5FA] transition-all duration-300">
              LinkMint
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm text-[#CCCCCC] hover:text-white transition-colors group"
              >
                <span className="relative z-10">{link.label}</span>
                <span className="absolute inset-0 rounded-lg bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                <span className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] group-hover:w-1/2 group-hover:left-1/4 transition-all duration-300 rounded-full" />
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-[#999999] hover:text-white text-sm transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-[#666666] hover:text-white text-sm transition-colors"
                >
                  Log out
                </button>
                <Link
                  href="/dashboard/profile"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 text-[#CCCCCC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-[#CCCCCC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden relative w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span
                className={`w-full h-0.5 bg-white rounded-full transform transition-all duration-300 origin-center ${
                  isMenuOpen ? "rotate-45 translate-y-[7px]" : ""
                }`}
              />
              <span
                className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${
                  isMenuOpen ? "opacity-0 scale-0" : ""
                }`}
              />
              <span
                className={`w-full h-0.5 bg-white rounded-full transform transition-all duration-300 origin-center ${
                  isMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pb-4 pt-2 border-t border-white/10">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-[#CCCCCC] hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-[#CCCCCC] hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center gap-3"
                  >
                    <svg className="w-5 h-5 text-[#999999]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-[#CCCCCC] hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                    className="px-4 py-3 rounded-xl text-left text-[#999999] hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white font-medium text-center"
                >
                  Sign In / Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
