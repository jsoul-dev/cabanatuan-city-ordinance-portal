"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/ordinances", label: "Mga Ordinansa" },
  { href: "/chatbot", label: "AI Assistant" },
  { href: "/report", label: "Mag-report" },
  { href: "/news", label: "Balita" },
];

/**
 * Main navigation bar — winauth.net-inspired obsidian/emerald glassmorphic design.
 * Includes interactive Light / Dark Theme Toggle button and high-contrast auth CTA.
 *
 * A11Y: <nav aria-label="Main navigation">, keyboard-operable, responsive mobile menu.
 */
export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    const current = resolvedTheme || theme;
    setTheme(current === "dark" ? "light" : "dark");
  };

  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#050a08]/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#050a08]/80 transition-colors">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        {/* Logo + Brandmark (winauth.net style) */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-white no-underline transition-opacity hover:opacity-80"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
            <span className="text-sm" aria-hidden="true">
              🏛️
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-xs tracking-tight">
            <span className="font-bold text-white">cabanatuan.gov.ph</span>
            <span className="text-neutral-500">/</span>
            <span className="text-emerald-400 font-semibold">portal</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-400 font-semibold"
                    : "text-neutral-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Side: Theme Toggle + Auth CTAs */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Theme Toggle Button */}
          {mounted && (
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle light or dark theme"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-neutral-300 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              <span>{isDark ? "☀️ Light" : "🌙 Dark"}</span>
            </button>
          )}

          <Link
            href="/login"
            className="text-xs font-medium text-neutral-300 hover:text-emerald-400 transition-colors"
          >
            Sign In
          </Link>

          <Link href="/login">
            <button
              type="button"
              className="rounded-xl bg-white px-3.5 py-1.5 text-xs font-semibold text-black shadow-lg shadow-white/5 transition-all hover:bg-neutral-200 active:scale-[0.98]"
            >
              Portal Access
            </button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          {mounted && (
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-full border border-white/10 bg-white/5 p-1.5 text-xs text-neutral-300"
            >
              {isDark ? "☀️" : "🌙"}
            </button>
          )}

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-neutral-400 hover:bg-white/5 hover:text-white"
            aria-controls="mobile-menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <span aria-hidden="true" className="text-xl">
                ✕
              </span>
            ) : (
              <span aria-hidden="true" className="text-xl">
                ☰
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-white/10 bg-[#050a08] px-4 pb-4 pt-2 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-300 hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 border-t border-white/10 pt-3 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center rounded-xl border border-white/10 bg-white/5 py-2 text-sm font-medium text-white"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center rounded-xl bg-white py-2 text-sm font-semibold text-black shadow-lg"
              >
                Portal Access
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
