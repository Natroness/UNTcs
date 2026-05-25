"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { AuditClaritySection } from "@/components/sections/AuditClaritySection";
import { DashboardSection } from "@/components/sections/DashboardSection";
import { TransferAuditSection } from "@/components/sections/TransferAuditSection";
import { PrereqDAGSection } from "@/components/sections/PrereqDAGSection";

export default function HomePage() {
  // Bumped when transfer audit sends data to dashboard
  const [transferNonce, setTransferNonce] = useState(0);

  function handleTransferSent() {
    setTransferNonce((n) => n + 1);
    // Smooth-scroll to dashboard after a short tick
    setTimeout(() => {
      document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  return (
    <div className="bg-[#0f0f0f] text-white">
      <Navbar />
      <HeroSection />
      <AuditClaritySection />
      <DashboardSection transferNonce={transferNonce} />
      <TransferAuditSection onTransferSent={handleTransferSent} />
      <PrereqDAGSection />
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0f0f0f] px-6 py-14">
      <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/30">Product</p>
          <ul className="mt-4 space-y-2 text-sm text-white/50">
            <li><a href="#" className="transition hover:text-white">Home</a></li>
            <li><a href="#dashboard" className="transition hover:text-white">Dashboard</a></li>
            <li><a href="#prereq-dag" className="transition hover:text-white">Prereq DAG</a></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/30">Resources</p>
          <ul className="mt-4 space-y-2 text-sm text-white/50">
            <li><a href="#transfer-audit" className="transition hover:text-white">Transfer Audit</a></li>
            <li>
              <a href="https://catalog.unt.edu/" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                UNT Catalog ↗
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-8 text-center text-xs text-white/25">
        MVP audit only. Verify all requirements with the official UNT catalog and advisor.
      </p>
    </footer>
  );
}
