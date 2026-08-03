import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Mag-login | Cabanatuan City Ordinance Hub",
  description: "Mag-login sa Cabanatuan City Ordinance Hub at LGU Portal",
};

/**
 * Premium Login Page — ultra-sleek winauth.net-inspired split layout.
 * Left: Dramatic emerald aurora mesh, bold typography, civic branding.
 * Right: Floating dark glassmorphic card with quick-fill test accounts.
 */
export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050a08] text-white selection:bg-emerald-500 selection:text-black">
      {/* Aurora Emerald & Gold Ambient Background Gradients */}
      <div
        className="pointer-events-none absolute -left-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-emerald-600/20 blur-[130px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/3 top-0 h-[450px] w-[450px] rounded-full bg-emerald-500/15 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 right-10 h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[140px]"
        aria-hidden="true"
      />

      {/* Subtle Vertical Glass Grid / Scanline overlay (inspired by winauth.net) */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"
        aria-hidden="true"
      />

      {/* Main Grid: 2-Column Split Layout on Desktop */}
      <div className="relative z-10 grid min-h-screen lg:grid-cols-12">
        {/* Left Column: Hero Branding & Tagline */}
        <div className="flex flex-col justify-between p-8 sm:p-12 lg:col-span-7 lg:p-16">
          {/* Top Brand Bar */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
                <span className="text-base" aria-hidden="true">
                  🏛️
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-sm tracking-tight">
                <span className="font-bold text-white">cabanatuan.gov.ph</span>
                <span className="text-neutral-600">/</span>
                <span className="text-neutral-400">ordinance-portal</span>
              </div>
            </Link>

            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-neutral-300 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              <span>← Bumalik sa Home</span>
            </Link>
          </div>

          {/* Center Hero Content */}
          <div className="my-12 max-w-xl lg:my-0">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold tracking-widest text-emerald-400 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Mag-login sa Portal</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.1]">
              Batas ng Lungsod. <br />
              <span className="bg-gradient-to-r from-emerald-400 via-emerald-200 to-white bg-clip-text text-transparent">
                Malinaw para sa lahat.
              </span>
            </h1>

            <p className="mt-6 text-base leading-relaxed text-neutral-400 sm:text-lg">
              Ang opisyal na digital ordinance hub at AI citizen legal assistant
              ng Lungsod ng Cabanatuan. Mag-login upang mamahala ng mga barangay
              ordinance, ulat ng mamamayan, at mga talaan ng lungsod.
            </p>

            {/* Civic Highlight Badges */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-neutral-300">
                <span className="text-emerald-400">✓</span>
                <span>75 Barangay Linked</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-neutral-300">
                <span className="text-emerald-400">✓</span>
                <span>AI Ordinance Advisor</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-neutral-300">
                <span className="text-emerald-400">✓</span>
                <span>RLS Secured</span>
              </div>
            </div>
          </div>

          {/* Bottom Footer Info */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-neutral-500">
            <div>
              &copy; {new Date().getFullYear()}{" "}
              <span className="text-neutral-400 font-medium">
                Pamahalaang Lungsod ng Cabanatuan
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <span>System Operational</span>
              </span>
              <span>•</span>
              <Link
                href="/privacy"
                className="hover:text-neutral-300 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-neutral-300 transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Floating Dark Glassmorphic Card (winauth.net style) */}
        <div className="flex items-center justify-center p-6 sm:p-12 lg:col-span-5 lg:border-l lg:border-white/10 lg:bg-black/20">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0f0d]/90 p-8 sm:p-10 shadow-2xl shadow-emerald-950/50 backdrop-blur-2xl">
            {/* Card Header */}
            <div className="mb-8">
              <div className="mb-2 font-mono text-xs font-bold tracking-widest text-emerald-400 uppercase">
                SIGN IN
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Welcome back
              </h2>
              <p className="mt-1.5 text-xs text-neutral-400">
                Manage your ordinances, citizen reports, and LGU records.
              </p>
            </div>

            {/* Login Form component with Quick-Fill buttons */}
            <LoginForm />

            <div className="mt-6 text-center">
              <span className="text-xs text-neutral-500">
                Don&apos;t have an account?{" "}
              </span>
              <Link
                href="/"
                className="text-xs font-semibold text-white hover:text-emerald-400 transition-colors underline underline-offset-4"
              >
                Request LGU Access
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
