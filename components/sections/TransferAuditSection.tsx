"use client";

import { TransferAuditUpload } from "@/components/TransferAuditUpload";

interface Props {
  onTransferSent: () => void;
}

export function TransferAuditSection({ onTransferSent }: Props) {
  return (
    <section id="transfer-audit" className="bg-[#0f0f0f] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <span className="badge mb-5 inline-flex">Transfer Student Support</span>
        <h2 className="section-title">Upload your UNT degree audit</h2>
        <p className="section-sub max-w-3xl">
          Transfer students should paste their official UNT degree audit, not just a community
          college transcript. The audit decides which transferred courses satisfy UNT equivalents
          like <span className="font-mono text-white/60">CSCE 1030</span> or{" "}
          <span className="font-mono text-white/60">MATH 1710</span>.
        </p>

        <div className="mt-14">
          <TransferAuditUpload onSendToDashboard={onTransferSent} />
        </div>
      </div>
    </section>
  );
}
