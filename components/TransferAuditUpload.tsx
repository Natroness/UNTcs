"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { TransferAuditApiResult } from "@/types/course";
import { saveCompletedCodes, saveCompletedDetailed } from "@/lib/completedCoursesStore";

const PLACEHOLDER = `Paste your UNT degree audit text here. Example:

CSCE 1030  COMPUTER SCIENCE I            COMPLETE
CSCE 1040  COMPUTER SCIENCE II           NEEDS:  3.0 Hours
   STILL NEEDED:  CSCE 1040
MATH 1710  CALCULUS I                    SATISFIED BY  HCC MATH 2413  TR
CSCE 2110  FOUNDATIONS OF DATA STRUCT    NOT SATISFIED`;

interface UploadProps {
  /** Override the default router.push behaviour (used on single-scroll homepage) */
  onSendToDashboard?: () => void;
}

export function TransferAuditUpload({ onSendToDashboard }: UploadProps = {}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [text, setText] = useState("");
  const [result, setResult] = useState<TransferAuditApiResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/transfer-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          (data && typeof data === "object" && "error" in data && typeof data.error === "string"
            ? data.error
            : null) ?? "Failed to parse audit text.",
        );
      }
      setResult((await res.json()) as TransferAuditApiResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [text]);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("text/") && !file.name.endsWith(".txt")) {
      setError("Only plain text (.txt) files are supported in this MVP.");
      return;
    }
    setError(null);
    try {
      setText(await file.text());
    } catch {
      setError("Could not read the file.");
    }
  }, []);

  const sendToDashboard = useCallback(() => {
    if (!result) return;
    saveCompletedCodes(result.matchedCatalogCourses);
    saveCompletedDetailed(result.completed);
    if (onSendToDashboard) {
      onSendToDashboard();
    } else {
      router.push("/dashboard?source=transfer");
    }
  }, [result, router, onSendToDashboard]);

  return (
    <div className="flex flex-col gap-6">
      {/* Input card */}
      <div className="card card-pad">
        <h2 className="mb-1 text-xl font-bold tracking-tight text-white">Paste UNT degree audit</h2>
        <p className="mb-5 text-sm text-[#84a5aa]">
          The parser marks a course completed only when the audit says{" "}
          <span className="font-mono text-white/60">COMPLETE</span>,{" "}
          <span className="font-mono text-white/60">SATISFIED</span>,{" "}
          <span className="font-mono text-white/60">TAKEN</span>, or{" "}
          <span className="font-mono text-white/60">TRANSFER / TR</span>.
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={PLACEHOLDER}
          rows={12}
          className="w-full resize-y rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-sm leading-6 text-white outline-none placeholder:text-white/20 transition focus:border-landing-teal/50 focus:ring-2 focus:ring-landing-teal/20"
        />

        {error ? (
          <p className="mt-3 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,text/plain"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleFile(f);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-[10px] border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Upload .txt
            </button>
            <span className="text-xs text-[#84a5aa]">PDF parsing coming later.</span>
          </div>
          <button
            type="button"
            disabled={loading || text.trim().length === 0}
            onClick={handleSubmit}
            className="rounded-[10px] bg-landing-teal px-6 py-2.5 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Parsing…" : "Parse audit"}
          </button>
        </div>
      </div>

      {result ? <Results result={result} onSend={sendToDashboard} /> : null}
    </div>
  );
}

function Results({ result, onSend }: { result: TransferAuditApiResult; onSend: () => void }) {
  const detailByCode = new Map(result.completed.map((c) => [c.untEquivalentCode, c]));

  return (
    <div className="card card-pad">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Parsed audit results</h2>
          <p className="mt-1 text-sm text-[#84a5aa]">
            UNT audit is treated as truth for transfer equivalents. Review, then send to dashboard.
          </p>
        </div>
        <button
          type="button"
          onClick={onSend}
          disabled={result.matchedCatalogCourses.length === 0}
          className="rounded-[10px] bg-landing-teal px-5 py-2.5 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Send to dashboard →
        </button>
      </div>

      {/* Stat pills */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatPill label="Completed" value={result.summary.completedCount} tone="green" />
        <StatPill label="Remaining" value={result.summary.remainingCount} tone="amber" />
        <StatPill label="Catalog matches" value={result.summary.matchedCount} tone="blue" />
        <StatPill label="Transfer" value={result.summary.transferCount} tone="violet" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Group title="Completed (catalog match)" tone="green">
          {result.matchedCatalogCourses.length === 0 ? (
            <Empty>No catalog matches yet.</Empty>
          ) : (
            <ul className="space-y-2">
              {result.matchedCatalogCourses.map((code) => {
                const detail = detailByCode.get(code);
                return (
                  <li key={code} className="flex flex-wrap items-center gap-2">
                    <span className="chip chip-green font-mono">{code}</span>
                    {detail?.source === "TRANSFER" ? (
                      <span className="inline-flex items-center rounded-full border border-violet-400/30 bg-violet-400/10 px-2.5 py-1 text-xs font-semibold text-violet-300">
                        TRANSFER
                      </span>
                    ) : null}
                    {detail?.originalTransferCode ? (
                      <span className="text-xs text-[#84a5aa]">
                        from <span className="font-mono">{detail.originalTransferCode}</span>
                      </span>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </Group>

        <Group title="Remaining (audit says needed)" tone="amber">
          {result.remainingCourses.length === 0 ? (
            <Empty>Nothing flagged as needed.</Empty>
          ) : (
            <ul className="flex flex-wrap gap-1.5">
              {result.remainingCourses.map((code) => (
                <li key={code} className="chip chip-amber font-mono">{code}</li>
              ))}
            </ul>
          )}
        </Group>

        <Group title="Unknown / not in catalog" tone="slate">
          {result.unknownCourses.length === 0 ? (
            <Empty>All completed codes are in the catalog.</Empty>
          ) : (
            <>
              <ul className="flex flex-wrap gap-1.5">
                {result.unknownCourses.map((code) => (
                  <li key={code} className="chip font-mono">{code}</li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-[#84a5aa]">
                Marked completed in the audit but not in the tracked UNT CS catalog.
              </p>
            </>
          )}
        </Group>

        <Group title="Manual correction" tone="slate">
          <p className="text-sm text-[#84a5aa]">
            If the parser missed a course, adjust it on the dashboard after sending.
          </p>
        </Group>
      </div>
    </div>
  );
}

function Group({
  title, tone, children,
}: {
  title: string;
  tone: "green" | "amber" | "blue" | "slate";
  children: React.ReactNode;
}) {
  const ring: Record<typeof tone, string> = {
    green: "border-emerald-400/20",
    amber: "border-amber-400/20",
    blue: "border-sky-400/20",
    slate: "border-white/10",
  };
  return (
    <div className={`rounded-xl border bg-white/5 p-4 ${ring[tone]}`}>
      <h3 className="mb-3 text-sm font-bold text-white">{title}</h3>
      {children}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-[#84a5aa]">{children}</p>;
}

function StatPill({
  label, value, tone,
}: {
  label: string;
  value: number;
  tone: "green" | "amber" | "blue" | "violet";
}) {
  const cls: Record<typeof tone, string> = {
    green: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    amber: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    blue: "border-sky-400/20 bg-sky-400/10 text-sky-300",
    violet: "border-violet-400/20 bg-violet-400/10 text-violet-300",
  };
  return (
    <div className={`rounded-xl border px-4 py-3 ${cls[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
    </div>
  );
}
