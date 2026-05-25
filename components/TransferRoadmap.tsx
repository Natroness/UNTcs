"use client";

import type { RoadmapTerm, CourseRoadmapStatus } from "@/lib/roadmapBuilder";

interface Props {
  terms: RoadmapTerm[];
}

export function TransferRoadmap({ terms }: Props) {
  if (terms.length === 0) {
    return (
      <p className="text-sm text-[#84a5aa]">No roadmap data available.</p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {terms.map((term) => (
        <div
          key={term.label}
          className="rounded-2xl border border-white/12 bg-gradient-to-b from-white/[0.04] to-transparent p-5"
        >
          {/* Term header */}
          <div className="mb-4 flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-white">{term.label}</h3>
            <TermBadge entries={term.entries} />
          </div>

          {/* Course cards */}
          <ul className="flex flex-col gap-2">
            {term.entries.map((entry) => (
              <li
                key={entry.unt}
                className={`rounded-xl border px-4 py-3 text-sm ${cardStyle(entry.status)}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="font-mono font-bold">{entry.unt}</span>
                    {entry.note && (
                      <span className="ml-2 text-xs opacity-60">{entry.note}</span>
                    )}
                  </div>
                  <StatusPill status={entry.status} />
                </div>
                {entry.tccns.length > 0 && (
                  <p className="mt-1.5 text-xs text-[#84a5aa]">
                    TCC equiv:{" "}
                    {entry.tccns.map((t) => (
                      <span key={t} className="mr-1.5 font-mono text-[#2fffd0]">{t}</span>
                    ))}
                  </p>
                )}
                {entry.tccns.length === 0 && (
                  <p className="mt-1.5 text-xs text-[#84a5aa]">Take at UNT</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function cardStyle(status: CourseRoadmapStatus): string {
  switch (status) {
    case "completed": return "border-emerald-400/30 bg-emerald-400/8 text-emerald-200";
    case "available":  return "border-[#2fffd0]/30 bg-[#2fffd0]/8 text-[#2fffd0]";
    case "remaining":  return "border-white/10 bg-white/[0.03] text-white/70";
  }
}

function StatusPill({ status }: { status: CourseRoadmapStatus }) {
  const styles: Record<CourseRoadmapStatus, string> = {
    completed: "border-emerald-400/40 bg-emerald-400/15 text-emerald-300",
    available:  "border-[#2fffd0]/40 bg-[#2fffd0]/10 text-[#2fffd0]",
    remaining:  "border-white/15 bg-white/5 text-white/50",
  };
  const label: Record<CourseRoadmapStatus, string> = {
    completed: "Completed",
    available:  "Available",
    remaining:  "Remaining",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${styles[status]}`}>
      {label[status]}
    </span>
  );
}

function TermBadge({ entries }: { entries: RoadmapTerm["entries"] }) {
  const done = entries.filter((e) => e.status === "completed").length;
  return (
    <span className="text-xs text-[#84a5aa]">
      {done}/{entries.length} done
    </span>
  );
}
