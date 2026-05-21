import type { Catalog } from "@/types/course";

export interface DAGNode {
  id: string;
  data: { label: string; title: string; type: string; completed: boolean };
  position: { x: number; y: number };
  style?: Record<string, string | number>;
}

export interface DAGEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}

export interface DAGGraph {
  nodes: DAGNode[];
  edges: DAGEdge[];
}

/**
 * Build a React Flow-compatible graph from the catalog's prerequisite
 * relationships. Nodes are laid out in topological "levels" based on the
 * longest prerequisite chain into that node, which produces a readable
 * left-to-right DAG without requiring a runtime layout engine.
 *
 * Optionally accepts the normalized codes of completed courses; matching nodes
 * are rendered with a soft "completed" green tint so transfer students and
 * returning students can see their progress on the graph.
 */
export function buildDAG(catalog: Catalog, completedCodes: string[] = []): DAGGraph {
  const courses = catalog.courses;
  const codeToCourse = new Map(courses.map((c) => [c.code, c]));
  const completedSet = new Set(completedCodes);

  const memo = new Map<string, number>();
  function depth(code: string, stack: Set<string> = new Set()): number {
    if (memo.has(code)) return memo.get(code)!;
    if (stack.has(code)) return 0;
    const course = codeToCourse.get(code);
    if (!course || course.prerequisites.length === 0) {
      memo.set(code, 0);
      return 0;
    }
    stack.add(code);
    let max = 0;
    for (const p of course.prerequisites) {
      max = Math.max(max, depth(p, stack) + 1);
    }
    stack.delete(code);
    memo.set(code, max);
    return max;
  }

  const levelBuckets = new Map<number, string[]>();
  for (const course of courses) {
    const d = depth(course.code);
    if (!levelBuckets.has(d)) levelBuckets.set(d, []);
    levelBuckets.get(d)!.push(course.code);
  }

  const xSpacing = 240;
  const ySpacing = 90;

  const typeColor: Record<string, string> = {
    required: "#0F172A",
    choice: "#7C3AED",
    elective: "#0EA5E9",
  };

  const nodes: DAGNode[] = [];
  for (const [level, codes] of Array.from(levelBuckets.entries()).sort((a, b) => a[0] - b[0])) {
    codes.sort();
    codes.forEach((code, i) => {
      const course = codeToCourse.get(code)!;
      const isCompleted = completedSet.has(course.code);
      nodes.push({
        id: code,
        data: {
          label: code,
          title: course.title,
          type: course.type,
          completed: isCompleted,
        },
        position: { x: level * xSpacing, y: i * ySpacing },
        style: {
          background: isCompleted ? "#dcfce7" : "#ffffff",
          border: isCompleted
            ? "2px solid #22c55e"
            : `1px solid ${typeColor[course.type] ?? "#d1d5db"}`,
          color: "#111827",
          padding: 8,
          borderRadius: 8,
          fontSize: 12,
          fontWeight: 600,
          width: 170,
        },
      });
    });
  }

  const edges: DAGEdge[] = [];
  for (const course of courses) {
    for (const p of course.prerequisites) {
      if (!codeToCourse.has(p)) continue;
      edges.push({
        id: `${p}->${course.code}`,
        source: p,
        target: course.code,
      });
    }
  }

  return { nodes, edges };
}
