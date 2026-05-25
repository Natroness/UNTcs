import type { TransferGuide, TransferGuideEntry } from "@/lib/transferEquivalency";

export type CourseRoadmapStatus = "completed" | "available" | "remaining";

export interface RoadmapEntry {
  unt: string;
  tccns: string[];
  note?: string;
  status: CourseRoadmapStatus;
}

export interface RoadmapTerm {
  label: string;        // e.g. "Year 1 · Fall"
  year: number;
  term: "fall" | "spring" | "summer";
  entries: RoadmapEntry[];
}

/**
 * Build a semester-ordered roadmap from a transfer guide, annotating each
 * course with its completion status relative to the provided completed/available
 * UNT code sets.
 *
 * Status rules:
 *   - completed  — UNT code is in completedSet
 *   - available  — UNT code is in availableSet (prereqs satisfied, not yet done)
 *   - remaining  — everything else (locked or future)
 */
export function buildRoadmap(
  guide: TransferGuide,
  completedSet: ReadonlySet<string>,
  availableSet: ReadonlySet<string>,
): RoadmapTerm[] {
  const terms: RoadmapTerm[] = [];

  const TERM_ORDER: Array<"fall" | "spring" | "summer"> = ["fall", "spring", "summer"];
  const TERM_LABEL: Record<string, string> = {
    fall: "Fall",
    spring: "Spring",
    summer: "Summer",
  };

  for (const yr of guide.years) {
    for (const termKey of TERM_ORDER) {
      const entries = yr[termKey];
      if (!entries || entries.length === 0) continue;

      terms.push({
        label: `Year ${yr.year} · ${TERM_LABEL[termKey]}`,
        year: yr.year,
        term: termKey,
        entries: entries.map((e: TransferGuideEntry): RoadmapEntry => ({
          unt: e.unt,
          tccns: e.tccns,
          note: e.note,
          status: completedSet.has(e.unt)
            ? "completed"
            : availableSet.has(e.unt)
            ? "available"
            : "remaining",
        })),
      });
    }
  }

  return terms;
}

/** Convenience: count how many roadmap entries have a given status. */
export function roadmapStats(terms: RoadmapTerm[]): {
  completed: number;
  available: number;
  remaining: number;
  total: number;
} {
  let completed = 0, available = 0, remaining = 0;
  for (const t of terms) {
    for (const e of t.entries) {
      if (e.status === "completed") completed++;
      else if (e.status === "available") available++;
      else remaining++;
    }
  }
  return { completed, available, remaining, total: completed + available + remaining };
}
