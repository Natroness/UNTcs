import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "UNT CS Degree Tracker",
  description:
    "Plan your University of North Texas Computer Science degree. Track completed, remaining, available, and locked courses with an interactive prerequisite graph.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-unt-green text-white font-bold">
                U
              </span>
              <span className="text-sm font-semibold tracking-tight sm:text-base">
                UNT CS Degree Tracker
              </span>
            </Link>
            <nav className="flex items-center gap-1 text-sm">
              <Link
                href="/dashboard"
                className="rounded-lg px-3 py-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Dashboard
              </Link>
              <Link
                href="/transfer-audit"
                className="rounded-lg px-3 py-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Transfer Audit
              </Link>
              <Link
                href="/dag"
                className="rounded-lg px-3 py-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Prereq DAG
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6">{children}</main>
        <footer className="mx-auto max-w-6xl px-4 py-8 text-xs text-slate-500 sm:px-6">
          MVP audit only. Verify all requirements with the official UNT catalog and advisor.
        </footer>
      </body>
    </html>
  );
}
