"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  return text
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function DashboardInner() {
  const searchParams = useSearchParams();
  const fromTransfer = searchParams.get("source") === "transfer";

  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transferDetail, setTransferDetail] = useState<CompletedCourse[]>([]);
  const [initialInput, setInitialInput] = useState<string | undefined>(undefined);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const runAudit = useCallback(async (completedCourses: string[]) => {
    const auditRes = await fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completedCourses }),
    });
    if (!auditRes.ok) {
      const data = await safeJson(auditRes);
      throw new Error(data?.error ?? "Audit request failed.");
    }
    const result = (await auditRes.json()) as AuditResult;
    setAudit(result);
    saveCompletedCodes(result.normalized);
    return result;
  }, []);

  // On arrival with ?source=transfer, hydrate from localStorage and auto-run.
  useEffect(() => {
    if (!fromTransfer) return;
    const stored = loadCompletedCodes();
    const detailed = loadCompletedDetailed();
    setTransferDetail(detailed);
    if (stored.length === 0) return;

    setInitialInput(stored.join("\n"));
    setLoading(true);
    runAudit(stored)
      .catch((e) => setError(e instanceof Error ? e.message : "Audit failed."))
      .finally(() => setLoading(false));
  }, [fromTransfer, runAudit]);

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
        // Manual edits supersede the prior transfer-audit provenance.
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
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Audit dashboard</h1>
        <p className="text-sm text-white/50">
          Enter your completed courses and get an instant degree audit.
        </p>
      </div>

      {fromTransfer && !bannerDismissed && transferDetail.length > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
          <span>
            Loaded <strong>{transferDetail.length}</strong> completed course
            {transferDetail.length === 1 ? "" : "s"} from your UNT degree audit
            {transferCount > 0 ? (
              <>
                {" "}
                (<strong>{transferCount}</strong> via transfer credit)
              </>
            ) : null}
            . You can still edit the list below.
          </span>
          <button
            type="button"
            onClick={() => setBannerDismissed(true)}
            className="rounded-md px-2 py-1 text-xs font-medium text-emerald-300 hover:bg-emerald-400/10"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <CourseInput
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        initialValue={initialInput}
      />

      {audit ? (
        <>
          <ProgressSummary audit={audit} />

          <div className="grid gap-6 lg:grid-cols-2">
            <CompletedCourses
              codes={audit.completedRequired}
              unknown={audit.unknown}
              transferDetail={transferDetail}
            />
            <RemainingCourses codes={audit.remainingRequired} />
            <AvailableCourses codes={audit.available} />
            <LockedCourses locked={audit.locked} />
          </div>
        </>
      ) : (
        <section className="card card-pad text-sm text-white/50">
          <p>
            Submit your courses above to see your degree progress, available next-term courses,
            and which classes are still locked. Transfer students can start at the{" "}
            <a href="/transfer-audit" className="font-semibold text-landing-teal hover:underline">
              transfer audit page
            </a>{" "}
            instead.
          </p>
        </section>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="text-sm text-slate-500">Loading dashboard...</div>}>
      <DashboardInner />
    </Suspense>
  );
}

async function safeJson(res: Response): Promise<{ error?: string } | null> {
  try {
    return (await res.json()) as { error?: string };
  } catch {
    return null;
  }
}
