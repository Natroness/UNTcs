import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Nav identical to landing page hero nav */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#121212]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-landing-teal text-sm font-bold text-black">
              U
            </span>
            <span className="text-lg font-semibold tracking-tight text-white">UNT CS Tracker</span>
          </Link>

          <div className="hidden items-center gap-10 text-[13px] font-semibold text-white/60 md:flex">
            <Link href="/dashboard" className="transition hover:text-white">
              Dashboard
            </Link>
            <Link href="/transfer-audit" className="transition hover:text-white">
              Transfer Audit
            </Link>
            <Link href="/dag" className="transition hover:text-white">
              Prereq DAG
            </Link>
          </div>

          <Link
            href="/dashboard"
            className="rounded-[10px] border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Start audit
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">{children}</main>

      {/* Footer identical to landing page footer */}
      <footer className="bg-[#121212] px-4 py-14 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 border-t border-white/10 pt-10 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white/30">Product</p>
            <ul className="mt-4 space-y-2 text-sm text-white/60">
              <li><Link href="/" className="transition hover:text-white">Home</Link></li>
              <li><Link href="/dashboard" className="transition hover:text-white">Dashboard</Link></li>
              <li><Link href="/dag" className="transition hover:text-white">Prereq DAG</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white/30">Resources</p>
            <ul className="mt-4 space-y-2 text-sm text-white/60">
              <li><Link href="/transfer-audit" className="transition hover:text-white">Transfer Audit</Link></li>
              <li>
                <a href="https://catalog.unt.edu/" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                  UNT Catalog
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-6xl text-center text-xs text-white/25">
          MVP audit only. Verify all requirements with the official UNT catalog and advisor.
        </p>
      </footer>
    </div>
  );
}
