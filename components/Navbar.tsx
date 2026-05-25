"use client";

import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0f0f0f]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-[#2fffd0] text-sm font-bold text-black">
            U
          </span>
          <span className="text-base font-semibold tracking-tight text-white">UNT CS Tracker</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 text-sm font-semibold text-white/60 md:flex">
          <a href="#dashboard" className="transition hover:text-white">Dashboard</a>
          <a href="#transfer-audit" className="transition hover:text-white">Transfer Audit</a>
          <a href="#prereq-dag" className="transition hover:text-white">Prereq DAG</a>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a href="#dashboard" className="btn-primary hidden py-2 md:inline-flex">
            Start audit
          </a>
          {/* Mobile hamburger */}
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-white/70 transition hover:bg-white/5 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 2l12 12M14 2L2 14" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 4h12M2 8h12M2 12h12" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="border-t border-white/10 bg-[#0f0f0f] px-6 pb-5 pt-4 md:hidden">
          <ul className="flex flex-col gap-4 text-sm font-semibold text-white/70">
            <li><a href="#dashboard" onClick={() => setOpen(false)} className="hover:text-white">Dashboard</a></li>
            <li><a href="#transfer-audit" onClick={() => setOpen(false)} className="hover:text-white">Transfer Audit</a></li>
            <li><a href="#prereq-dag" onClick={() => setOpen(false)} className="hover:text-white">Prereq DAG</a></li>
            <li><a href="#dashboard" onClick={() => setOpen(false)} className="btn-primary mt-1 py-2 text-center">Start audit</a></li>
          </ul>
        </nav>
      )}
    </header>
  );
}
