import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#121212]">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#121212]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-landing-teal font-bold text-black">
              U
            </span>
            <span className="text-sm font-semibold tracking-tight text-white sm:text-base">
              UNT CS Tracker
            </span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link
              href="/dashboard"
              className="rounded-lg px-3 py-1.5 text-white/60 transition hover:bg-white/5 hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/transfer-audit"
              className="rounded-lg px-3 py-1.5 text-white/60 transition hover:bg-white/5 hover:text-white"
            >
              Transfer Audit
            </Link>
            <Link
              href="/dag"
              className="rounded-lg px-3 py-1.5 text-white/60 transition hover:bg-white/5 hover:text-white"
            >
              Prereq DAG
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6">{children}</main>

      <footer className="mx-auto max-w-6xl border-t border-white/10 px-4 py-8 text-xs text-white/30 sm:px-6">
        MVP audit only. Verify all requirements with the official UNT catalog and advisor.
      </footer>
    </div>
  );
}
