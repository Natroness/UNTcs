import { TransferAuditUpload } from "@/components/TransferAuditUpload";

export const metadata = {
  title: "Transfer Audit · UNT CS Degree Tracker",
};

export default function TransferAuditPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <span className="chip chip-blue">Phase 7 · Transfer Student Support</span>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
          Upload your UNT degree audit
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-600">
          Transfer students should paste their official UNT degree audit, not just a community
          college transcript. The UNT audit decides which transferred courses satisfy UNT
          equivalents like <span className="font-mono">CSCE 1030</span> or{" "}
          <span className="font-mono">MATH 1710</span>. The parser only marks a UNT course
          completed when the audit explicitly says so.
        </p>
      </header>

      <TransferAuditUpload />
    </div>
  );
}
