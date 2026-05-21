"use client";

import { useEffect, useMemo, useState } from "react";
import { catalog } from "@/lib/catalog";
import { checkPrerequisites } from "@/lib/prerequisiteChecker";
import { buildDAG } from "@/lib/buildDAG";
import { layoutGraph } from "@/lib/layoutGraph";
import { CourseDAG } from "@/components/CourseDAG";
import { loadCompletedCodes } from "@/lib/completedCoursesStore";

export default function DagPage() {
  const [completedCodes, setCompletedCodes] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCompletedCodes(loadCompletedCodes());
    setReady(true);
  }, []);

  const graph = useMemo(() => {
    const { available } = checkPrerequisites(catalog, completedCodes);
    const rawGraph = buildDAG(catalog, completedCodes, available);
    return layoutGraph(rawGraph.nodes, rawGraph.edges);
  }, [completedCodes]);

  const completedCount = completedCodes.length;
  const availableCount = graph.nodes.filter(
    (n) => (n.data as { status?: string }).status === "available",
  ).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Prerequisite DAG</h1>
          <p className="text-sm text-slate-500">
            {graph.nodes.length} courses · {graph.edges.length} prerequisite edges
            {ready && completedCount > 0
              ? ` · ${completedCount} completed · ${availableCount} available`
              : ""}. Drag, zoom, and pan.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <LegendChip color="#22c55e" bg="#f0fdf4" border="#22c55e" label="completed" />
          <LegendChip color="#3b82f6" bg="#eff6ff" border="#3b82f6" label="available" />
          <LegendChip color="#6b7280" bg="#f9fafb" border="#d1d5db" label="locked" />
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

function LegendChip({
  color,
  bg,
  border,
  label,
}: {
  color: string;
  bg: string;
  border: string;
  label: string;
}) {
  return (
    <span
      className="chip"
      style={{ borderColor: border, background: bg, color }}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ background: color }}
      />
      {label}
    </span>
  );
}
