// Updated: 2026-03-09
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "W2Jobs — Find W2 Jobs, No Corp-to-Corp",
  description:
    "The premier job portal exclusively for W2 employees. Browse thousands of direct hire and W2-only positions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-sans bg-white text-gray-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
