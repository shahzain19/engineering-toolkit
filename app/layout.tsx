import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Engineering Toolkit — Professional Calculator Suite",
  description:
    "A professional engineering calculator suite for electrical, mechanical, and conversion workflows. Ohm's Law, Gear Ratios, Unit Conversion, Beam Analysis and more.",
  keywords: [
    "engineering calculator",
    "ohms law",
    "voltage divider",
    "gear ratio",
    "unit converter",
    "resistor color code",
    "torque calculator",
    "beam calculator",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
