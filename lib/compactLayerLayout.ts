/**
 * Compact top-to-bottom layer layout using BFS prerequisite depth.
 *
 * Unlike the dagre-based layoutGraph.ts, this computes layers purely from the
 * prerequisite graph structure:
 *   - depth 0 = nodes with no incoming edges (root courses)
 *   - depth N = max(depth of parents) + 1
 *
 * Wide layers (> MAX_PER_ROW nodes) are wrapped into centered sub-rows so the
 * graph never explodes horizontally. The result is deterministic and works well
 * for the typical 30–40 node UNT CS curriculum graph.
 */

export const COMPACT_NODE_W = 168;
export const COMPACT_NODE_H = 74;

const MAX_PER_ROW = 4;
const H_GAP = 22;          // horizontal gap between sibling nodes
const RANK_GAP = 60;       // extra vertical gap between dagre ranks (on top of sub-row height)
const SUB_ROW_H = COMPACT_NODE_H + 16;  // height step within a rank's sub-rows
const MARGIN_X = 32;
const MARGIN_Y = 32;

type NodeLike = { id: string; position: { x: number; y: number } };
type EdgeLike = { id: string; source: string; target: string };

/** BFS depth — max depth of any predecessor, plus 1. */
function computeDepths(
  nodeIds: string[],
  edges: EdgeLike[],
): Map<string, number> {
  const children = new Map<string, string[]>(); // source → targets
  const parents  = new Map<string, string[]>(); // target → sources

  for (const id of nodeIds) {
    if (!children.has(id)) children.set(id, []);
    if (!parents.has(id))  parents.set(id, []);
  }
  for (const e of edges) {
    if (!children.has(e.source) || !children.has(e.target)) continue; // skip external refs
    children.get(e.source)!.push(e.target);
    parents.get(e.target)!.push(e.source);
  }

  const depth = new Map<string, number>();

  function getDepth(id: string, visited = new Set<string>()): number {
    if (depth.has(id)) return depth.get(id)!;
    if (visited.has(id)) return 0; // cycle guard
    visited.add(id);
    const ps = parents.get(id) ?? [];
    const d = ps.length === 0
      ? 0
      : Math.max(...ps.map((p) => getDepth(p, visited))) + 1;
    depth.set(id, d);
    return d;
  }

  for (const id of nodeIds) getDepth(id);
  return depth;
}

/**
 * Lay out nodes compactly. Nodes at the same depth land in the same rank;
 * ranks wider than MAX_PER_ROW are wrapped into centered sub-rows.
 * Returns updated node objects with new positions; edges are unchanged.
 */
export function compactLayerLayout<
  N extends NodeLike,
  E extends EdgeLike,
>(nodes: N[], edges: E[]): { nodes: N[]; edges: E[] } {
  if (nodes.length === 0) return { nodes, edges };

  const nodeIds = nodes.map((n) => n.id);
  const depths = computeDepths(nodeIds, edges);

  // Group nodes by depth
  const layers = new Map<number, string[]>();
  for (const id of nodeIds) {
    const d = depths.get(id) ?? 0;
    if (!layers.has(d)) layers.set(d, []);
    layers.get(d)!.push(id);
  }

  // Stable ordering within each layer: sort by id for determinism
  for (const arr of layers.values()) arr.sort();

  const sortedDepths = [...layers.keys()].sort((a, b) => a - b);
  let currentY = MARGIN_Y;
  const posMap = new Map<string, { x: number; y: number }>();

  for (const depth of sortedDepths) {
    const group = layers.get(depth)!;

    // Chunk into sub-rows of MAX_PER_ROW
    const subRows: string[][] = [];
    for (let i = 0; i < group.length; i += MAX_PER_ROW) {
      subRows.push(group.slice(i, i + MAX_PER_ROW));
    }

    for (const row of subRows) {
      const rowW = row.length * COMPACT_NODE_W + (row.length - 1) * H_GAP;
      const startX = MARGIN_X - rowW / 2;
      row.forEach((id, i) => {
        posMap.set(id, {
          x: startX + i * (COMPACT_NODE_W + H_GAP),
          y: currentY,
        });
      });
      currentY += SUB_ROW_H;
    }

    currentY += RANK_GAP;
  }

  const laid = nodes.map((n) => ({
    ...n,
    position: posMap.get(n.id) ?? n.position,
  }));

  return { nodes: laid, edges };
}
