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
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
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
      <body className="min-h-full flex flex-col bg-[var(--bg-canvas)] text-[var(--text-ink)] selection:bg-emerald-500 selection:text-black">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--bg-card)",
                color: "var(--text-ink)",
                border: "1px solid var(--border-hairline)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
