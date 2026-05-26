"use client";

import { useEffect, useMemo, useState } from "react";
import { catalog } from "@/lib/catalog";
import { checkPrerequisites } from "@/lib/prerequisiteChecker";
import { buildDAG } from "@/lib/buildDAG";
import { loadCompletedCodes, loadCompletedDetailed } from "@/lib/completedCoursesStore";
import { PlannerTabs } from "@/components/PlannerTabs";

export function PrereqDAGSection() {
  const [completedCodes, setCompletedCodes] = useState<string[]>([]);
  const [transferCodes, setTransferCodes] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const codes = loadCompletedCodes();
    const detailed = loadCompletedDetailed();
    // Build the transfer set from completed courses whose source is TRANSFER
    const txSet = new Set(
      detailed.filter((c) => c.source === "TRANSFER").map((c) => c.untEquivalentCode),
    );
    setCompletedCodes(codes);
    setTransferCodes(txSet);
    setReady(true);
  }, []);

  const graph = useMemo(() => {
    const { available } = checkPrerequisites(catalog, completedCodes);
    return buildDAG(catalog, completedCodes, available, transferCodes);
  }, [completedCodes, transferCodes]);

  const completedCount = completedCodes.length;
  const availableCount = graph.nodes.filter(
    (n) => (n.data as { status?: string }).status === "available",
  ).length;

  return (
    <section id="prereq-dag" className="bg-[#0f0f0f] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="section-title">Planner</h2>
            <p className="section-sub">
              {graph.nodes.length} courses · {graph.edges.length} prereq edges
              {ready && completedCount > 0
                ? ` · ${completedCount} completed · ${availableCount} available`
                : ""}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <LegendChip color="#34d399" bg="rgba(52,211,153,0.1)"  border="rgba(52,211,153,0.4)"  label="completed" />
            <LegendChip color="#2fffd0" bg="rgba(47,255,208,0.1)"  border="rgba(47,255,208,0.4)"  label="available" />
            <LegendChip color="rgba(255,255,255,0.4)" bg="rgba(255,255,255,0.04)" border="rgba(255,255,255,0.12)" label="locked" />
            <LegendChip color="#c4b5fd" bg="rgba(196,181,253,0.08)" border="rgba(196,181,253,0.3)" label="transfer/OPT" />
          </div>
          {/* Edge color key */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#84a5aa]">
            <EdgeKey color="#2fffd0" label="CSCE edges" />
            <EdgeKey color="#60a5fa" label="MATH edges" />
            <EdgeKey color="#fbbf24" label="EENG edges" />
            <EdgeKey color="#f97316" label="ENGL/TECM edges" />
          </div>
        </div>

        {ready && completedCount === 0 && (
          <div className="mt-6 rounded-2xl border border-white/12 bg-gradient-to-b from-[rgba(47,255,208,0.06)] to-transparent px-5 py-4 text-sm text-[#84a5aa]">
            No completed courses yet. Run an audit in the{" "}
            <a href="#dashboard" className="font-semibold text-[#2fffd0] hover:underline">dashboard</a>{" "}
            or upload your{" "}
            <a href="#transfer-audit" className="font-semibold text-[#2fffd0] hover:underline">UNT degree audit</a>{" "}
            to color completed nodes green.
          </div>
        )}

        <div className="mt-8">
          <PlannerTabs graph={graph} completedCodes={completedCodes} />
        </div>
      </div>
    </section>
  );
}

function LegendChip({ color, bg, border, label }: {
  color: string; bg: string; border: string; label: string;
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

function EdgeKey({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg width="20" height="6" viewBox="0 0 20 6" aria-hidden="true">
        <line x1="0" y1="3" x2="20" y2="3" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
      {label}
    </span>
  );
}
