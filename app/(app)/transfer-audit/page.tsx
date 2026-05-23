import { TransferAuditUpload } from "@/components/TransferAuditUpload";

export const metadata = {
  title: "Transfer Audit · UNT CS Degree Tracker",
};

export default function TransferAuditPage() {
  return (
    <div className="flex flex-col gap-14">
      {/* Page header — Figma section title style */}
      <div>
        <span className="chip chip-blue mb-4 inline-flex">Phase 7 · Transfer Student Support</span>
        <h1 className="section-title">Upload your UNT degree audit</h1>
        <p className="section-sub max-w-3xl">
          Transfer students should paste their official UNT degree audit, not just a community
          college transcript. The UNT audit decides which transferred courses satisfy UNT
          equivalents like{" "}
          <span className="font-mono text-white/60">CSCE 1030</span> or{" "}
          <span className="font-mono text-white/60">MATH 1710</span>.
        </p>
      </div>

      <TransferAuditUpload />
    </div>
  );
}
