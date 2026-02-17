import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Open_Sans } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { GeoProvider } from "@/lib/geo-context";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Yapsy — Your AI Daily Companion",
  description:
    "Talk to Yapsy at the end of your day. It tracks your tasks, captures your mood, and shows you patterns you'd never notice. Join the waitlist.",
  keywords: [
    "AI companion",
    "mood tracker",
    "voice journal",
    "task management",
    "daily check-in",
  ],
  openGraph: {
    title: "Yapsy — Yap about your day. Yapsy handles the rest.",
    description:
      "Your AI-powered daily companion. Voice check-ins, mood tracking, smart tasks, and psychological insights.",
    url: "https://yapsy.app",
    siteName: "Yapsy",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yapsy — Your AI Daily Companion",
    description: "Talk to Yapsy. It handles the rest.",
    images: ["/images/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${openSans.variable}`}>
      <body className="antialiased">
        <GeoProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </GeoProvider>
      </body>
    </html>
  );
}
