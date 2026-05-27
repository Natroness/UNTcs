import type { Catalog, CourseNodeData, CourseStatus } from "@/types/course";
import { getSvgCoursePosition } from "@/lib/svgLayout";

export interface DAGNode {
  id: string;
  type: "courseNode";
  data: CourseNodeData;
  position: { x: number; y: number };
}

export interface DAGEdge {
  id: string;
  source: string;
  target: string;
  type: "smoothstep";
  style?: Record<string, string | number>;
}

export interface DAGGraph {
  nodes: DAGNode[];
  edges: DAGEdge[];
}

/**
 * Build React Flow nodes and edges from the catalog.
 *
 * Node positions come exclusively from lib/svgLayout.ts (which reads the
 * auto-generated lib/generatedCoursePositions.ts). Courses absent from the
 * handmade SVG get a deterministic fallback position so the graph never
 * crashes.
 *
 * Prerequisite edges are sourced solely from unt-cs-catalog.json —
 * SVG arrows are ignored entirely.
 *
 * Do NOT call dagre, compactLayerLayout, or any other auto-layout here.
 */
export function buildDAG(
  catalog: Catalog,
  completedCodes: string[] = [],
  availableCodes: string[] = [],
  /** UNT codes satisfied via a transfer equivalent (shown with TR badge). */
  transferCodes: ReadonlySet<string> = new Set(),
): DAGGraph {
  const completedSet = new Set(completedCodes);
  const availableSet = new Set(availableCodes);
  const catalogCodes = new Set(catalog.courses.map((c) => c.code));

  // Courses without an SVG position stack vertically in a fallback column
  // far-left so they are clearly visible but don't clutter the main layout.
  const FALLBACK_X = -300;
  const FALLBACK_Y_STEP = 120;
  let fallbackIndex = 0;

  const nodes: DAGNode[] = catalog.courses.map((course) => {
    let status: CourseStatus;
    if (completedSet.has(course.code))       status = "completed";
    else if (availableSet.has(course.code))  status = "available";
    else                                      status = "locked";

    const svgPos = getSvgCoursePosition(course.code);
    const position = svgPos ?? {
      x: FALLBACK_X,
      y: FALLBACK_Y_STEP * fallbackIndex++,
    };
    const layoutSource: "svg" | "fallback" = svgPos ? "svg" : "fallback";

    return {
      id: course.code,
      type: "courseNode",
      data: {
        code:         course.code,
        title:        course.title,
        credits:      course.credits,
        courseType:   course.type,
        status,
        isTransfer:   status === "completed" && transferCodes.has(course.code),
        layoutSource,
      },
      position,
    };
  });

  const edges: DAGEdge[] = [];
  for (const course of catalog.courses) {
    for (const prereq of course.prerequisites) {
      if (!catalogCodes.has(prereq)) continue;
      edges.push({
        id:     `${prereq}->${course.code}`,
        source: prereq,
        target: course.code,
        type:   "smoothstep",
        style: {
          stroke:  deptEdgeColor(prereq),
          strokeWidth: 1.8,
          opacity: 0.75,
        },
      });
    }
  }

  return { nodes, edges };
}

/** Color edges by the source node's department for easy path tracing. */
function deptEdgeColor(sourceCode: string): string {
  const dept = sourceCode.split(" ")[0];
  switch (dept) {
    case "CSCE": return "#2fffd0"; // mint  — core CS chain
    case "MATH": return "#60a5fa"; // blue  — math chain
    case "EENG": return "#fbbf24"; // amber — hardware chain
    case "ENGL":
    case "TECM": return "#f97316"; // orange — writing chain
    default:     return "rgba(255,255,255,0.25)";
  }
}
