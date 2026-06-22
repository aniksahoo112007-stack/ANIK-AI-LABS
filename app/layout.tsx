import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ANIK AI LABS — Building AI Solutions That Solve Real Problems",
  description:
    "Premium AI software studio and developer portfolio by Anik Sahoo. Custom software, AI automation, business dashboards, retail systems, and data analytics.",
  keywords: [
    "AI development",
    "automation",
    "software studio",
    "data analytics",
    "n8n",
    "Anik Sahoo",
    "freelance developer",
  ],
  authors: [{ name: "Anik Sahoo" }],
  openGraph: {
    title: "ANIK AI LABS",
    description: "Building AI Solutions That Solve Real Problems",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
