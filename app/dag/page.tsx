"use client";

import { useEffect, useMemo, useState } from "react";
import { catalog } from "@/lib/catalog";
import { buildDAG } from "@/lib/buildDAG";
import { CourseDAG } from "@/components/CourseDAG";
import { loadCompletedCodes } from "@/lib/completedCoursesStore";

export default function DagPage() {
  const [completedCodes, setCompletedCodes] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCompletedCodes(loadCompletedCodes());
    setReady(true);
  }, []);

  const graph = useMemo(() => buildDAG(catalog, completedCodes), [completedCodes]);
  const completedCount = completedCodes.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Prerequisite DAG</h1>
          <p className="text-sm text-slate-500">
            {graph.nodes.length} courses · {graph.edges.length} prerequisite edges
            {ready && completedCount > 0 ? ` · ${completedCount} completed` : ""}. Drag, zoom, and pan.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="chip" style={{ borderColor: "#22c55e", background: "#dcfce7", color: "#166534" }}>
            <span className="h-2 w-2 rounded-full" style={{ background: "#22c55e" }} /> completed
          </span>
          <span className="chip" style={{ borderColor: "#0F172A" }}>
            <span className="h-2 w-2 rounded-full" style={{ background: "#0F172A" }} /> required
          </span>
          <span className="chip" style={{ borderColor: "#7C3AED" }}>
            <span className="h-2 w-2 rounded-full" style={{ background: "#7C3AED" }} /> choice
          </span>
          <span className="chip" style={{ borderColor: "#0EA5E9" }}>
            <span className="h-2 w-2 rounded-full" style={{ background: "#0EA5E9" }} /> elective
          </span>
        </div>
      </div>

      {ready && completedCount === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
          No completed courses loaded. Run an audit on the{" "}
          <a className="font-semibold text-unt-green hover:underline" href="/dashboard">
            dashboard
          </a>{" "}
          or paste your{" "}
          <a className="font-semibold text-unt-green hover:underline" href="/transfer-audit">
            UNT degree audit
          </a>{" "}
          to color completed nodes green.
        </div>
      ) : null}

      <CourseDAG graph={graph} />
    </div>
  );
}
