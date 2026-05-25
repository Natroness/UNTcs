import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "UNT CS Degree Tracker",
  description:
    "Plan your University of North Texas Computer Science degree. Track completed, remaining, available, and locked courses with an interactive prerequisite graph.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className="min-h-screen bg-[#0f0f0f] font-sans antialiased">{children}</body>
    </html>
  );
}
