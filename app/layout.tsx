import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "SaaN Digital — Enterprise AI & Platform Engineering",
    template: "%s | SaaN Digital",
  },
  description: "Building intelligent infrastructure for the modern enterprise. We consult and engineer next-generation platforms, SRE systems, and AI strategies.",
  metadataBase: new URL("https://saantechnology.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} font-sans antialiased bg-[#0a0a0f] text-[#f1f5f9]`}
      >
        {children}
      </body>
    </html>
  );
}
