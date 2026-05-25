"use client";

import { useCallback, useEffect, useState } from "react";
import { CourseInput } from "@/components/CourseInput";
import { CompletedCourses } from "@/components/CompletedCourses";
import { RemainingCourses } from "@/components/RemainingCourses";
import { AvailableCourses } from "@/components/AvailableCourses";
import { LockedCourses } from "@/components/LockedCourses";
import { ProgressSummary } from "@/components/ProgressSummary";
import type { AuditResult, CompletedCourse } from "@/types/course";
import {
  loadCompletedCodes,
  loadCompletedDetailed,
  saveCompletedCodes,
  saveCompletedDetailed,
} from "@/lib/completedCoursesStore";

function splitManual(text: string): string[] {
  return text.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean);
}

interface Props {
  /** Bumped by parent when transfer data is saved to localStorage */
  transferNonce: number;
}

export function DashboardSection({ transferNonce }: Props) {
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transferDetail, setTransferDetail] = useState<CompletedCourse[]>([]);
  const [initialInput, setInitialInput] = useState<string | undefined>(undefined);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const runAudit = useCallback(async (completedCourses: string[]) => {
    const res = await fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completedCourses }),
    });
    if (!res.ok) {
      const data = await safeJson(res);
      throw new Error(data?.error ?? "Audit request failed.");
    }
    const result = (await res.json()) as AuditResult;
    setAudit(result);
    saveCompletedCodes(result.normalized);
    return result;
  }, []);

  // When transfer data arrives (nonce bumped), hydrate and auto-run
  useEffect(() => {
    if (transferNonce === 0) return;
    const stored = loadCompletedCodes();
    const detailed = loadCompletedDetailed();
    setTransferDetail(detailed);
    setBannerDismissed(false);
    if (stored.length === 0) return;
    setInitialInput(stored.join("\n"));
    setLoading(true);
    runAudit(stored)
      .catch((e) => setError(e instanceof Error ? e.message : "Audit failed."))
      .finally(() => setLoading(false));
  }, [transferNonce, runAudit]);

  const handleSubmit = useCallback(
    async ({ mode, value }: { mode: "manual" | "transcript"; value: string }) => {
      setLoading(true);
      setError(null);
      try {
        let completedCourses: string[] = [];
        if (mode === "manual") {
          completedCourses = splitManual(value);
        } else {
          const res = await fetch("/api/transcript", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: value }),
          });
          if (!res.ok) {
            const data = await safeJson(res);
            throw new Error(data?.error ?? "Failed to parse transcript.");
          }
          const data = (await res.json()) as { courses: string[] };
          completedCourses = data.courses;
        }
        await runAudit(completedCourses);
        setTransferDetail([]);
        saveCompletedDetailed([]);
        setBannerDismissed(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
        setAudit(null);
      } finally {
        setLoading(false);
      }
    },
    [runAudit],
  );

  const transferCount = transferDetail.filter((c) => c.source === "TRANSFER").length;

  return (
    <section id="dashboard" className="bg-[#0f0f0f] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="section-title">Audit dashboard</h2>
        <p className="section-sub">
          Enter your completed courses and get an instant prerequisite-aware degree audit.
        </p>

        <div className="mt-14 flex flex-col gap-8">
          {/* Transfer banner */}
          {transferNonce > 0 && !bannerDismissed && transferDetail.length > 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-200">
              <span>
                Loaded <strong>{transferDetail.length}</strong> course
                {transferDetail.length === 1 ? "" : "s"} from your UNT degree audit
                {transferCount > 0 ? <> (<strong>{transferCount}</strong> via transfer credit)</> : null}.
                You can still edit the list below.
              </span>
              <button type="button" onClick={() => setBannerDismissed(true)}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-400/10">
                Dismiss
              </button>
            </div>
          ) : null}

          <CourseInput onSubmit={handleSubmit} loading={loading} error={error} initialValue={initialInput} />

          {audit ? (
            <div className="flex flex-col gap-8">
              <ProgressSummary audit={audit} />
              <div className="grid gap-5 lg:grid-cols-2">
                <CompletedCourses codes={audit.completedRequired} unknown={audit.unknown} transferDetail={transferDetail} />
                <RemainingCourses codes={audit.remainingRequired} />
                <AvailableCourses codes={audit.available} />
                <LockedCourses locked={audit.locked} />
              </div>
            </div>
          ) : (
            <div className="card card-pad text-sm text-[#84a5aa]">
              Submit your courses above to see degree progress, available next-term courses, and which
              classes are still locked. Transfer students can use the{" "}
              <a href="#transfer-audit" className="font-semibold text-[#2fffd0] hover:underline">
                Transfer Audit
              </a>{" "}
              section below.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

async function safeJson(res: Response): Promise<{ error?: string } | null> {
  try { return (await res.json()) as { error?: string }; }
  catch { return null; }
}
