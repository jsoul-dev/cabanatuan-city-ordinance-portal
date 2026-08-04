"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/ordinances", label: "Ordinances" },
  { href: "/chatbot", label: "AI Assistant" },
  { href: "/report", label: "Report" },
  { href: "/news", label: "News" },
];

/**
 * Main navigation bar — supports both crisp Light Mode and winauth.net Dark Mode.
 * Displays official Cabanatuan City LGU Seal and "Cabanatuan City / Ordinance Portal" branding.
 * Includes interactive Light / Dark Theme Toggle button and high-contrast Portal Access CTA.
 */
export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white/80 dark:border-white/10 dark:bg-[#050a08]/80 backdrop-blur-xl transition-colors">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        {/* Logo + Brandmark */}
        <Link
          href="/"
          className="flex items-center gap-2.5 no-underline transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/95 p-1 shadow-md shadow-emerald-500/10 border border-neutral-200/60 dark:border-white/10 dark:bg-white/10">
            <Image
              src="/lgu-logo.png"
              alt="Cabanatuan City LGU Seal"
              width={28}
              height={28}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <div className="flex items-center gap-1.5 font-mono text-xs tracking-tight">
            <span className="font-bold text-neutral-900 dark:text-white">
              Cabanatuan City
            </span>
            <span className="text-neutral-400 dark:text-neutral-500">/</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              Ordinance Portal
            </span>
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
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-semibold"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-white/5 dark:hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Side: Theme Toggle + Portal Access CTA */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          <Link href="/login">
            <button
              type="button"
              className="rounded-xl bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-neutral-800 active:scale-[0.98] dark:bg-white dark:text-black dark:shadow-lg dark:shadow-white/5 dark:hover:bg-neutral-200"
            >
              Portal Access
            </button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/5 dark:hover:text-white"
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
          className="border-t border-neutral-200 bg-white px-4 pb-4 pt-2 dark:border-white/10 dark:bg-[#050a08] md:hidden"
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-white/5 dark:hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 border-t border-neutral-200 dark:border-white/10 pt-3 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center rounded-xl bg-neutral-900 py-2 text-sm font-semibold text-white shadow-md dark:bg-white dark:text-black"
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
