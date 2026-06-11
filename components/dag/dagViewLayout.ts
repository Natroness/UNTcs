/**
 * components/dag/dagViewLayout.ts
 *
 * Hand-designed roadmap layout for the DAG View tab ONLY.
 *
 * This is an academic roadmap, not an engineering dependency graph:
 *   - 5 horizontal layers read strictly top → bottom
 *   - every edge is orthogonal (vertical → horizontal shelf → vertical)
 *   - shelf/lane y-x values are hand-picked so no edge passes through a
 *     node and no two edges cross
 *   - elective families live inside labelled containers
 *   - the capstone sequence is isolated bottom-right
 *
 * Grid: columns are 250px apart (node width 168 → 82px gutters),
 * rows are 220px apart. Lane/shelf coordinates below are derived from
 * that grid — if you move a node, re-check the shelves that pass near it.
 */

// Column x positions (node top-left). cx (edge anchor) = x + 84.
const A = 0, B = 250, C = 500, D = 750, E = 1000, F = 1250, G = 1500, H = 1750, I = 2000, J = 2250;
// Row y positions.
const R0 = 0, R1 = 220, R2 = 440, R3 = 660, R4 = 880, R5 = 1100, R6 = 1320, R7 = 1540, R8 = 1760, R9 = 1980;

export const DAG_NODE_W = 168;

export interface XY { x: number; y: number }

/** Fixed roadmap position for every catalog course. */
export const DAG_VIEW_POSITIONS: Record<string, XY> = {
  // ── Layer 1 · Foundations ────────────────────────────────────────────
  "CSCE 1010": { x: D, y: R0 },
  "MATH 1710": { x: G, y: R0 },
  "ENGL 1310": { x: J, y: R0 },

  // ── Layer 2 · Early Core ─────────────────────────────────────────────
  "CSCE 1015": { x: C, y: R1 },
  "CSCE 1030": { x: D, y: R1 },
  "MATH 1720": { x: G, y: R1 },
  "MATH 1780": { x: H, y: R1 },
  "MATH 3680": { x: I, y: R1 },
  "ENGL 1320": { x: J, y: R1 },
  "CSCE 1040": { x: D, y: R2 },
  "TECM 2700": { x: J, y: R2 },

  // ── Layer 3 · Core CS Gateway ────────────────────────────────────────
  "EENG 2710": { x: C, y: R3 },
  "CSCE 2100": { x: D, y: R3 },
  "CSCE 2110": { x: E, y: R3 },
  "MATH 2700": { x: G, y: R3 },
  "CSCE 2610": { x: C, y: R4 },

  // ── Layer 4 · Major Requirements ─────────────────────────────────────
  "CSCE 3550": { x: B, y: R5 },
  "CSCE 4110": { x: C, y: R5 },
  "CSCE 3600": { x: E, y: R5 },
  "CSCE 3444": { x: F, y: R5 },
  "CSCE 4010": { x: E, y: R6 },

  // ── Layer 5 · Systems Electives (container, bottom-left) ─────────────
  "CSCE 4115": { x: B, y: R7 },
  "CSCE 4430": { x: C, y: R7 },
  "CSCE 3530": { x: B, y: R8 },
  "CSCE 4600": { x: C, y: R8 },
  "CSCE 4650": { x: 375, y: R9 },

  // ── Layer 5 · Advanced Computing Electives (container, bottom-center) ─
  "CSCE 4201": { x: F, y: R7 },
  "CSCE 4210": { x: G, y: R7 },
  "CSCE 4230": { x: H, y: R7 },
  "CSCE 4240": { x: F, y: R8 },
  "CSCE 4290": { x: G, y: R8 },
  "CSCE 4350": { x: H, y: R8 },
  "CSCE 4460": { x: G, y: R9 },

  // ── Layer 5 · Capstone (isolated, far right) ─────────────────────────
  "CSCE 4901": { x: J, y: R6 },
  "CSCE 4902": { x: J, y: 1620 },
};

/** Gateway courses get a visual glow — they unlock most of the degree. */
export const DAG_EMPHASIS = new Set(["CSCE 2100", "CSCE 2110"]);

/**
 * Per-node "extra prerequisite" chips. Used instead of long cross-map
 * edges that would cross the elective feed lanes (readability > edge count).
 */
export const DAG_EXTRA_REQ: Record<string, string> = {
  "CSCE 3530": "+ CSCE 3600",
  "CSCE 4600": "+ CSCE 3600",
  "CSCE 4650": "+ CSCE 3600",
  "CSCE 4230": "+ MATH 2700",
};

// ── Group containers ────────────────────────────────────────────────────

export interface GroupBoxSpec {
  id: string;
  position: XY;
  w: number;
  h: number;
  title: string;
  subtitle: string;
  tone: "violet" | "gold";
  /** Invisible target handles on the top border (left offset in px). */
  handles: { id: string; left: number }[];
}

const GROUP_TOP = 1455;
const GROUP_H = 650;

export const DAG_GROUP_BOXES: GroupBoxSpec[] = [
  {
    id: "grp-systems",
    position: { x: 210, y: GROUP_TOP },
    w: 480,
    h: GROUP_H,
    title: "Systems Electives",
    subtitle: "choose any two",
    tone: "violet",
    handles: [
      { id: "in-duo", left: 249 },  // lane x = 459
      { id: "in-3600", left: 350 }, // lane x = 560
    ],
  },
  {
    id: "grp-breadth",
    position: { x: 1170, y: GROUP_TOP },
    w: 790,
    h: GROUP_H,
    title: "Advanced Computing Electives",
    subtitle: "choose any two",
    tone: "violet",
    handles: [
      { id: "in-duo", left: 50 },   // lane x = 1220
    ],
  },
  {
    id: "grp-capstone",
    position: { x: 2210, y: 1255 },
    w: 250,
    h: 520,
    title: "Capstone Sequence",
    subtitle: "final year",
    tone: "gold",
    handles: [],
  },
];

// ── Layer band labels (left margin) ─────────────────────────────────────

export interface LayerLabelSpec {
  id: string;
  position: XY;
  index: number;
  title: string;
}

export const DAG_LAYER_LABELS: LayerLabelSpec[] = [
  { id: "lbl-1", position: { x: -340, y: R0 + 14 },  index: 1, title: "Foundations" },
  { id: "lbl-2", position: { x: -340, y: 330 },      index: 2, title: "Early Core" },
  { id: "lbl-3", position: { x: -340, y: R3 + 14 },  index: 3, title: "Core Gateway" },
  { id: "lbl-4", position: { x: -340, y: R5 + 14 },  index: 4, title: "Major Requirements" },
  { id: "lbl-5", position: { x: -340, y: GROUP_TOP + 14 }, index: 5, title: "Electives & Capstone" },
];

// ── Edges ───────────────────────────────────────────────────────────────

export interface DagEdgeSpec {
  source: string;
  target: string;
  /** y of the horizontal shelf segment (omit for straight drops). */
  shelfY?: number;
  /** dashed = co-requisite (taken together), solid = hard prerequisite. */
  dashed?: boolean;
  /** side-to-side edge between adjacent nodes in the same row. */
  side?: boolean;
  /** target handle id when the target is a group container. */
  targetHandle?: string;
}

/**
 * Curated display edges. Shelf y values are hand-routed lanes:
 *   150  – MATH 1710 fan-out shelf
 *   590  – CSCE 1040 → 2110 jog
 *   810  – CSCE 2100 → 2610 jog        850 – CSCE 2100 → 3600 join
 *   990  – co-req shelf (2110 ⇢ 3550)  1020 – CSCE 2110 main fan shelf
 *   1245 – CSCE 3444 → capstone corridor
 *   1255 – CSCE 3600 → systems-electives branch
 */
export const DAG_EDGES: DagEdgeSpec[] = [
  // Foundations → Early Core
  { source: "CSCE 1010", target: "CSCE 1030" },
  { source: "MATH 1710", target: "CSCE 1030", shelfY: 150 },
  { source: "CSCE 1015", target: "CSCE 1030", dashed: true, side: true },
  { source: "CSCE 1030", target: "CSCE 1040" },
  { source: "MATH 1710", target: "MATH 1720", shelfY: 150 },
  { source: "MATH 1710", target: "MATH 1780", shelfY: 150 },
  { source: "MATH 1710", target: "MATH 3680", shelfY: 150 },
  { source: "ENGL 1310", target: "ENGL 1320" },
  { source: "ENGL 1320", target: "TECM 2700" },

  // Early Core → Core Gateway
  { source: "CSCE 1040", target: "CSCE 2100" },
  { source: "CSCE 1040", target: "CSCE 2110", shelfY: 590 },
  { source: "MATH 1720", target: "MATH 2700" },
  { source: "CSCE 2100", target: "CSCE 2110", dashed: true, side: true },

  // Core Gateway → sidecar + Major Requirements
  { source: "CSCE 2100", target: "CSCE 2610", shelfY: 810 },
  { source: "EENG 2710", target: "CSCE 2610", dashed: true },
  { source: "CSCE 2110", target: "CSCE 3600" },
  { source: "CSCE 2100", target: "CSCE 3600", shelfY: 850 },
  { source: "CSCE 2110", target: "CSCE 4110", shelfY: 1020 },
  { source: "CSCE 2110", target: "CSCE 3444", shelfY: 1020 },
  { source: "CSCE 2110", target: "CSCE 3550", shelfY: 990, dashed: true },
  { source: "CSCE 3600", target: "CSCE 4010" },

  // Core Gateway / 3600 → elective containers
  { source: "CSCE 2110", target: "grp-systems", targetHandle: "in-duo", shelfY: 1020 },
  { source: "CSCE 3600", target: "grp-systems", targetHandle: "in-3600", shelfY: 1255 },
  { source: "CSCE 2110", target: "grp-breadth", targetHandle: "in-duo", shelfY: 1020 },

  // Capstone path
  { source: "CSCE 3444", target: "CSCE 4901", shelfY: 1245 },
  { source: "TECM 2700", target: "CSCE 4901" },
  { source: "CSCE 4901", target: "CSCE 4902" },
];

/** Edge color by source department — matches the legend in the section header. */
export function dagEdgeColor(sourceCode: string): string {
  const dept = sourceCode.split(" ")[0];
  switch (dept) {
    case "CSCE": return "#2fffd0"; // mint   — core CS chain
    case "MATH": return "#60a5fa"; // blue   — math chain
    case "EENG": return "#fbbf24"; // amber  — hardware chain
    case "ENGL":
    case "TECM": return "#f97316"; // orange — writing chain
    default:     return "rgba(255,255,255,0.25)";
  }
}
