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
    <div className="flex flex-col gap-10">
      {/* Page header — Figma section title style */}
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="section-title">Prerequisite DAG</h1>
          <p className="section-sub">
            {graph.nodes.length} courses · {graph.edges.length} prerequisite edges
            {ready && completedCount > 0
              ? ` · ${completedCount} completed · ${availableCount} available`
              : ""}
            . Drag, zoom, and pan.
          </p>
        </div>

        {/* Legend chips — Figma badge style */}
        <div className="flex flex-wrap items-center gap-2">
          <LegendChip
            color="#34d399"
            bg="rgba(52,211,153,0.1)"
            border="rgba(52,211,153,0.4)"
            label="completed"
          />
          <LegendChip
            color="#38bdf8"
            bg="rgba(56,189,248,0.1)"
            border="rgba(56,189,248,0.4)"
            label="available"
          />
          <LegendChip
            color="rgba(255,255,255,0.5)"
            bg="rgba(255,255,255,0.05)"
            border="rgba(255,255,255,0.15)"
            label="locked"
          />
        </div>
      </div>

      {ready && completedCount === 0 ? (
        <div className="rounded-2xl border border-white/15 bg-gradient-to-b from-[rgba(28,232,171,0.06)] to-transparent px-5 py-4 text-sm text-[#84a5aa]">
          No completed courses loaded. Run an audit on the{" "}
          <a className="font-semibold text-landing-teal hover:underline" href="/dashboard">
            dashboard
          </a>{" "}
          or paste your{" "}
          <a className="font-semibold text-landing-teal hover:underline" href="/transfer-audit">
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
  color, bg, border, label,
}: {
  color: string;
  bg: string;
  border: string;
  label: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold"
      style={{ borderColor: border, background: bg, color }}
    >
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}
