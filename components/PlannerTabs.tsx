"use client";

import { useState, useMemo } from "react";
import { CourseDAG } from "@/components/CourseDAG";
import { CourseRoadmapDiagram } from "@/components/CourseRoadmapDiagram";
import { TransferRoadmap } from "@/components/TransferRoadmap";
import { buildRoadmap, roadmapStats } from "@/lib/roadmapBuilder";
import { checkPrerequisites } from "@/lib/prerequisiteChecker";
import { catalog } from "@/lib/catalog";
import tccGuide from "@/data/transfer-guides/tcc-to-unt-cs.json";
import type { TransferGuide } from "@/lib/transferEquivalency";
import type { DAGGraph } from "@/lib/buildDAG";

type Tab = "dag" | "map" | "roadmap" | "transfer";

const TABS: { id: Tab; label: string }[] = [
  { id: "dag",      label: "DAG View" },
  { id: "map",      label: "Degree Map" },
  { id: "roadmap",  label: "Roadmap" },
  { id: "transfer", label: "Transfer Guide" },
];

interface Props {
  graph: DAGGraph;
  completedCodes: string[];
}

export function PlannerTabs({ graph, completedCodes }: Props) {
  const [active, setActive] = useState<Tab>("dag");

  const guide = tccGuide as TransferGuide;

  const { available } = useMemo(
    () => checkPrerequisites(catalog, completedCodes),
    [completedCodes],
  );

  const roadmap = useMemo(() => {
    const completedSet = new Set(completedCodes);
    const availableSet = new Set(available);
    return buildRoadmap(guide, completedSet, availableSet);
  }, [completedCodes, available, guide]);

  const stats = useMemo(() => roadmapStats(roadmap), [roadmap]);

  return (
    <div>
      {/* Tab bar */}
      <div className="mb-8 flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${
              active === tab.id
                ? "bg-[#2fffd0] text-black"
                : "text-white/50 hover:bg-white/5 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* DAG View */}
      {active === "dag" && <CourseDAG graph={graph} />}

      {/* Degree Map View */}
      {active === "map" && (
        <CourseRoadmapDiagram
          completedCodes={completedCodes}
          availableCodes={available}
        />
      )}

      {/* Roadmap View */}
      {active === "roadmap" && (
        <div className="flex flex-col gap-6">
          {/* Summary pills */}
          <div className="flex flex-wrap gap-3">
            <StatPill label="Completed" value={stats.completed} color="green" />
            <StatPill label="Available"  value={stats.available}  color="teal" />
            <StatPill label="Remaining"  value={stats.remaining}  color="gray" />
          </div>
          <TransferRoadmap terms={roadmap} />
        </div>
      )}

      {/* Transfer Guide View */}
      {active === "transfer" && (
        <div className="flex flex-col gap-6">
          <p className="text-sm text-[#84a5aa]">
            TCCNS equivalency table for the{" "}
            <span className="font-semibold text-white">{guide.school} → {guide.target}</span>{" "}
            pathway. Enter TCCNS codes in the dashboard and they will be mapped to their UNT
            equivalents automatically.
          </p>
          <EquivalencyTable guide={guide} />
        </div>
      )}
    </div>
  );
}

function EquivalencyTable({ guide }: { guide: TransferGuide }) {
  const rows: { tccns: string; unt: string; note?: string }[] = [];
  for (const yr of guide.years) {
    for (const term of ["fall", "spring", "summer"] as const) {
      const termEntries = yr[term] ?? [];
      for (const entry of termEntries) {
        if (entry.tccns.length > 0) {
          rows.push({ tccns: entry.tccns.join(", "), unt: entry.unt, note: entry.note });
        }
      }
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/12">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.04] text-left">
            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#84a5aa]">TCC / TCCNS</th>
            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#84a5aa]">UNT Equivalent</th>
            <th className="hidden px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#84a5aa] sm:table-cell">Note</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.tccns}
              className={`border-b border-white/10 ${i % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"}`}
            >
              <td className="px-4 py-3 font-mono font-semibold text-[#2fffd0]">{row.tccns}</td>
              <td className="px-4 py-3 font-mono font-semibold text-white">{row.unt}</td>
              <td className="hidden px-4 py-3 text-[#84a5aa] sm:table-cell">{row.note ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatPill({ label, value, color }: { label: string; value: number; color: "green" | "teal" | "gray" }) {
  const cls = {
    green: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
    teal:  "border-[#2fffd0]/25 bg-[#2fffd0]/10 text-[#2fffd0]",
    gray:  "border-white/12 bg-white/5 text-white/60",
  }[color];
  return (
    <div className={`rounded-xl border px-4 py-3 ${cls}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</p>
      <p className="mt-0.5 text-2xl font-bold tabular-nums">{value}</p>
    </div>
  );
}
