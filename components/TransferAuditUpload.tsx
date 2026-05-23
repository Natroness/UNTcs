"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { TransferAuditApiResult } from "@/types/course";
import {
  saveCompletedCodes,
  saveCompletedDetailed,
} from "@/lib/completedCoursesStore";

const PLACEHOLDER = `Paste your UNT degree audit text here. Example:

CSCE 1030  COMPUTER SCIENCE I            COMPLETE
CSCE 1040  COMPUTER SCIENCE II           NEEDS:  3.0 Hours
   STILL NEEDED:  CSCE 1040
MATH 1710  CALCULUS I                    SATISFIED BY  HCC MATH 2413  TR
CSCE 2110  FOUNDATIONS OF DATA STRUCT    NOT SATISFIED`;

export function TransferAuditUpload() {
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
      const data = (await res.json()) as TransferAuditApiResult;
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [text]);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("text/") && !file.name.endsWith(".txt")) {
      setError("Only plain text (.txt) files are supported in this MVP. PDF support is coming.");
      return;
    }
    setError(null);
    try {
      const content = await file.text();
      setText(content);
    } catch {
      setError("Could not read the file.");
    }
  }, []);

  const sendToDashboard = useCallback(() => {
    if (!result) return;
    saveCompletedCodes(result.matchedCatalogCourses);
    saveCompletedDetailed(result.completed);
    router.push("/dashboard?source=transfer");
  }, [result, router]);

  return (
    <div className="flex flex-col gap-6">
      <section className="card card-pad">
        <header className="mb-3">
          <h2 className="text-lg font-semibold tracking-tight text-white">Paste UNT degree audit</h2>
          <p className="text-sm text-white/50">
            Transfer students: paste the full text of your UNT degree audit. The parser only marks
            a UNT course completed when the audit says{" "}
            <span className="font-mono text-white/70">COMPLETE</span>,{" "}
            <span className="font-mono text-white/70">SATISFIED</span>,{" "}
            <span className="font-mono text-white/70">TAKEN</span>, or{" "}
            <span className="font-mono text-white/70">TRANSFER / TR</span>.
          </p>
        </header>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={PLACEHOLDER}
          rows={12}
          className="w-full resize-y rounded-xl border border-white/10 bg-[#1a1a1a] p-3 font-mono text-sm leading-6 text-white outline-none placeholder:text-white/25 transition focus:border-landing-teal/50 focus:ring-2 focus:ring-landing-teal/20"
        />

        {error ? (
          <p className="mt-3 rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-300">
            {error}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-white/40">
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
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Upload .txt
            </button>
            <span>PDF parsing arrives in a later phase.</span>
          </div>
          <button
            type="button"
            disabled={loading || text.trim().length === 0}
            onClick={handleSubmit}
            className="inline-flex items-center justify-center rounded-lg bg-landing-teal px-4 py-2 text-sm font-semibold text-black shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Parsing…" : "Parse audit"}
          </button>
        </div>
      </section>

      {result ? <Results result={result} onSend={sendToDashboard} /> : null}
    </div>
  );
}

function Results({
  result,
  onSend,
}: {
  result: TransferAuditApiResult;
  onSend: () => void;
}) {
  const detailByCode = new Map(result.completed.map((c) => [c.untEquivalentCode, c]));

  return (
    <section className="card card-pad">
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-white">Parsed audit results</h2>
          <p className="text-sm text-white/50">
            UNT audit is treated as truth for transfer equivalents. Review, then send to the
            dashboard.
          </p>
        </div>
        <button
          type="button"
          onClick={onSend}
          disabled={result.matchedCatalogCourses.length === 0}
          className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Send to dashboard
        </button>
      </header>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Completed" value={result.summary.completedCount} tone="green" />
        <Stat label="Remaining" value={result.summary.remainingCount} tone="amber" />
        <Stat label="Catalog matches" value={result.summary.matchedCount} tone="blue" />
        <Stat label="Transfer" value={result.summary.transferCount} tone="violet" />
      </dl>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Group title="Completed (catalog match)" tone="green">
          {result.matchedCatalogCourses.length === 0 ? (
            <Empty>No catalog matches yet.</Empty>
          ) : (
            <ul className="space-y-1.5">
              {result.matchedCatalogCourses.map((code) => {
                const detail = detailByCode.get(code);
                return (
                  <li key={code} className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="chip chip-green font-mono">{code}</span>
                    {detail?.source === "TRANSFER" ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-violet-400/30 bg-violet-400/10 px-2.5 py-1 text-xs font-medium text-violet-300">
                        TRANSFER
                      </span>
                    ) : null}
                    {detail?.originalTransferCode ? (
                      <span className="text-xs text-white/40">
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
                <li key={code} className="chip chip-amber font-mono">
                  {code}
                </li>
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
                  <li key={code} className="chip font-mono">
                    {code}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-white/40">
                These were marked completed in the audit but are not part of the tracked UNT CS
                catalog. They may already be applied via UNT-equivalent rows above.
              </p>
            </>
          )}
        </Group>

        <Group title="Manual correction" tone="slate">
          <p className="text-sm text-white/60">
            If the parser missed or mis-classified a course, you can adjust your completed list
            directly on the dashboard. Click{" "}
            <span className="font-semibold text-white">Send to dashboard</span> to pre-fill it.
          </p>
        </Group>
      </div>
    </section>
  );
}

function Group({
  title,
  tone,
  children,
}: {
  title: string;
  tone: "green" | "amber" | "blue" | "slate";
  children: React.ReactNode;
}) {
  const toneRing: Record<typeof tone, string> = {
    green: "border-emerald-400/20",
    amber: "border-amber-400/20",
    blue: "border-sky-400/20",
    slate: "border-white/10",
  };
  return (
    <div className={`rounded-xl border bg-white/5 p-4 ${toneRing[tone]}`}>
      <h3 className="mb-2 text-sm font-semibold text-white">{title}</h3>
      {children}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-white/40">{children}</p>;
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "green" | "amber" | "blue" | "violet";
}) {
  const toneClasses: Record<typeof tone, string> = {
    green: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
    amber: "text-amber-300 bg-amber-400/10 border-amber-400/20",
    blue: "text-sky-300 bg-sky-400/10 border-sky-400/20",
    violet: "text-violet-300 bg-violet-400/10 border-violet-400/20",
  };
  return (
    <div className={`rounded-xl border px-3 py-2.5 ${toneClasses[tone]}`}>
      <div className="text-xs font-medium uppercase tracking-wide opacity-70">{label}</div>
      <div className="text-xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}
