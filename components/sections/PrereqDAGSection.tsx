"use client";

import { useEffect, useMemo, useState } from "react";
import { catalog } from "@/lib/catalog";
import { checkPrerequisites } from "@/lib/prerequisiteChecker";
import { buildDAG } from "@/lib/buildDAG";
import { layoutGraph } from "@/lib/layoutGraph";
import { CourseDAG } from "@/components/CourseDAG";
import { loadCompletedCodes } from "@/lib/completedCoursesStore";

export function PrereqDAGSection() {
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
    <section id="prereq-dag" className="bg-[#0f0f0f] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="section-title">Prerequisite DAG</h2>
            <p className="section-sub">
              {graph.nodes.length} courses · {graph.edges.length} prerequisite edges
              {ready && completedCount > 0
                ? ` · ${completedCount} completed · ${availableCount} available`
                : ""}
              . Drag, zoom, and pan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <LegendChip color="#34d399" bg="rgba(52,211,153,0.1)" border="rgba(52,211,153,0.4)" label="completed" />
            <LegendChip color="#2fffd0" bg="rgba(47,255,208,0.1)" border="rgba(47,255,208,0.4)" label="available" />
            <LegendChip color="rgba(255,255,255,0.4)" bg="rgba(255,255,255,0.04)" border="rgba(255,255,255,0.12)" label="locked" />
          </div>
        </div>

        {ready && completedCount === 0 ? (
          <div className="mt-6 rounded-2xl border border-white/12 bg-gradient-to-b from-[rgba(47,255,208,0.06)] to-transparent px-5 py-4 text-sm text-[#84a5aa]">
            No completed courses loaded yet. Run an audit in the{" "}
            <a href="#dashboard" className="font-semibold text-[#2fffd0] hover:underline">dashboard</a>{" "}
            or upload your{" "}
            <a href="#transfer-audit" className="font-semibold text-[#2fffd0] hover:underline">UNT degree audit</a>{" "}
            to color completed nodes green.
          </div>
        ) : null}

        <div className="mt-8">
          <CourseDAG graph={graph} />
        </div>
      </div>
    </section>
  );
}

function LegendChip({ color, bg, border, label }: { color: string; bg: string; border: string; label: string }) {
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
