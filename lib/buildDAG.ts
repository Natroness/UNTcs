import type { Catalog, CourseNodeData, CourseStatus } from "@/types/course";

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
 * Build raw (un-laid-out) React Flow nodes and edges from the catalog.
 *
 * Each node uses the custom 'courseNode' type so CourseNode.tsx handles
 * rendering. Status priority: completed > available > locked.
 *
 * Do NOT call dagre here — positioning is handled by lib/layoutGraph.ts so
 * this function stays pure and testable.
 */
export function buildDAG(
  catalog: Catalog,
  completedCodes: string[] = [],
  availableCodes: string[] = [],
  /** UNT codes that were satisfied via a transfer equivalent (shown with purple badge). */
  transferCodes: ReadonlySet<string> = new Set(),
): DAGGraph {
  const completedSet = new Set(completedCodes);
  const availableSet = new Set(availableCodes);
  const catalogCodes = new Set(catalog.courses.map((c) => c.code));

  const nodes: DAGNode[] = catalog.courses.map((course) => {
    let status: CourseStatus;
    if (completedSet.has(course.code)) {
      status = "completed";
    } else if (availableSet.has(course.code)) {
      status = "available";
    } else {
      status = "locked";
    }

    return {
      id: course.code,
      type: "courseNode",
      data: {
        code: course.code,
        title: course.title,
        credits: course.credits,
        courseType: course.type,
        status,
        isTransfer: status === "completed" && transferCodes.has(course.code),
      },
      position: { x: 0, y: 0 },
    };
  });

  const edges: DAGEdge[] = [];
  for (const course of catalog.courses) {
    for (const prereq of course.prerequisites) {
      if (!catalogCodes.has(prereq)) continue;
      edges.push({
        id: `${prereq}->${course.code}`,
        source: prereq,
        target: course.code,
        type: "smoothstep",
        style: {
          stroke: deptEdgeColor(prereq),
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
    case "CSCE": return "#2fffd0"; // mint — core CS chain
    case "MATH": return "#60a5fa"; // blue — math chain
    case "EENG": return "#fbbf24"; // amber — hardware chain
    case "ENGL":
    case "TECM": return "#f97316"; // orange — writing chain
    default:     return "rgba(255,255,255,0.25)";
  }
}
