"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { clsx } from "clsx";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/ordinances", label: "Mga Ordinansa" },
  { href: "/chatbot", label: "AI Assistant" },
  { href: "/report", label: "Mag-report" },
  { href: "/news", label: "Balita" },
];

/**
 * Main navigation bar — Geist nav-bar spec.
 * Canvas background, bottom hairline, body text.
 *
 * A11Y: <nav aria-label="Main navigation">, keyboard-operable,
 * responsive hamburger menu with focus trap considerations.
 */
export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Avoid hydration mismatch for theme toggle
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border-hairline)] bg-[var(--bg-canvas)]/95 backdrop-blur-sm">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        {/* Logo + Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-3 text-[var(--text-ink)] no-underline"
        >
          <Image
            src="/lgu-logo.png"
            alt="Sagisag ng Lungsod ng Kabanatuan"
            width={36}
            height={36}
            className="rounded-full"
          />
          <span className="hidden text-sm font-semibold tracking-tight sm:inline-block">
            Cabanatuan City
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "rounded-[var(--radius-full)] px-3 py-2 text-sm transition-colors",
                pathname === link.href
                  ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-medium"
                  : "text-[var(--text-body)] hover:bg-[var(--bg-card)] hover:text-[var(--text-ink)]"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={
                theme === "dark"
                  ? "Lumipat sa light mode"
                  : "Lumipat sa dark mode"
              }
            >
              {theme === "dark" ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
            </Button>
          )}

          {/* Login Button */}
          <Link href="/login">
            <Button variant="primary" size="sm">
              Mag-login
            </Button>
          </Link>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? "Isara ang menu" : "Buksan ang menu"}
          >
            {mobileMenuOpen ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-4 pb-4 md:hidden"
        >
          <div className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={clsx(
                  "rounded-[var(--radius-sm)] px-3 py-3 text-sm transition-colors",
                  "min-h-[44px] flex items-center", // A11Y: 44px touch target
                  pathname === link.href
                    ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-medium"
                    : "text-[var(--text-body)] hover:bg-[var(--bg-card)]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
