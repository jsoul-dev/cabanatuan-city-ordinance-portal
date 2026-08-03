import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Cabanatuan City Ordinance Portal",
    template: "%s | Cabanatuan City Ordinance Portal",
  },
  description:
    "Ang opisyal na digital platform ng Lungsod ng Cabanatuan para sa mga ordinansa, AI citizen assistant, at community reporting. The official Cabanatuan City Ordinance Information Portal & AI Citizen Assistant.",
  keywords: [
    "Cabanatuan City",
    "ordinance",
    "barangay",
    "Nueva Ecija",
    "local government",
    "AI assistant",
    "community reporting",
  ],
  authors: [{ name: "Cabanatuan City LGU" }],
  openGraph: {
    title: "Cabanatuan City Ordinance Portal",
    description:
      "Making local laws transparent, accessible, and queryable in Tagalog and English.",
    type: "website",
    locale: "tl_PH",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[var(--bg-canvas)] text-[var(--text-ink)]">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* A11Y: Skip-to-content link — keyboard users can bypass nav */}
          <a href="#main-content" className="skip-link">
            Pumunta sa pangunahing nilalaman
          </a>

          {children}

          <Toaster
            position="bottom-right"
            toastOptions={{
              className:
                "!bg-[var(--bg-card)] !text-[var(--text-ink)] !border-[var(--border-hairline)]",
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
