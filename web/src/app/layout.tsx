import type { Metadata } from "next";
import { Bangers, Comic_Neue, JetBrains_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const bangers = Bangers({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const comicNeue = Comic_Neue({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Agents Assemble",
  description:
    "Opinionated agent personas and skills for Claude Code. Assemble your team.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bangers.variable} ${comicNeue.variable} ${jetbrainsMono.variable} antialiased flex min-h-screen flex-col bg-[var(--paper)] text-[var(--ink)] font-[family-name:var(--font-body)]`}
      >
        <Header />
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
