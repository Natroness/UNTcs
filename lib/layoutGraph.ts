import dagre from "dagre";

export const NODE_WIDTH = 168;
export const NODE_HEIGHT = 74;

const MAX_PER_ROW = 4;      // nodes per visual row within a rank
const NODE_SEP = 24;        // horizontal gap between sibling nodes
const RANK_SEP = 72;        // vertical gap between dagre ranks
const SUB_ROW_H = NODE_HEIGHT + 18; // height step for sub-rows within a rank
const MARGIN = 40;

/**
 * Apply dagre top-to-bottom layout, then post-process:
 * any rank that ends up with more than MAX_PER_ROW nodes is wrapped into
 * multiple sub-rows so the graph stays narrow and readable without zooming.
 *
 * The generic <N, E> pass-through preserves full node/edge types so callers
 * don't lose data field types after layout.
 */
export function layoutGraph<
  N extends { id: string; position: { x: number; y: number } },
  E extends { id: string; source: string; target: string },
>(nodes: N[], edges: E[]): { nodes: N[]; edges: E[] } {
  if (nodes.length === 0) return { nodes, edges };

  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: "TB",
    nodesep: NODE_SEP,
    ranksep: RANK_SEP,
    marginx: MARGIN,
    marginy: MARGIN,
  });

  for (const node of nodes) {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }
  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }

  dagre.layout(g);

  // --- Step 1: group nodes by dagre rank (same y = same rank) ---------------
  const rankGroups = new Map<number, { id: string; dagreX: number }[]>();
  for (const node of nodes) {
    const dn = g.node(node.id);
    const yKey = Math.round(dn.y); // nodes in the same rank share the same y
    if (!rankGroups.has(yKey)) rankGroups.set(yKey, []);
    rankGroups.get(yKey)!.push({ id: node.id, dagreX: dn.x });
  }

  // --- Step 2: sort ranks top-to-bottom, wrap wide ranks into sub-rows ------
  const sortedRanks = [...rankGroups.keys()].sort((a, b) => a - b);
  let currentY = MARGIN;
  const posMap = new Map<string, { x: number; y: number }>();

  for (const rankY of sortedRanks) {
    const group = rankGroups.get(rankY)!;
    // Preserve dagre's left-to-right order within the rank
    group.sort((a, b) => a.dagreX - b.dagreX);

    // Chunk into sub-rows of MAX_PER_ROW
    const subRows: string[][] = [];
    for (let i = 0; i < group.length; i += MAX_PER_ROW) {
      subRows.push(group.slice(i, i + MAX_PER_ROW).map((n) => n.id));
    }

    for (const row of subRows) {
      // Center each sub-row horizontally
      const rowW = row.length * NODE_WIDTH + (row.length - 1) * NODE_SEP;
      const startX = -rowW / 2;
      row.forEach((id, i) => {
        posMap.set(id, {
          x: startX + i * (NODE_WIDTH + NODE_SEP),
          y: currentY,
        });
      });
      currentY += SUB_ROW_H;
    }

    // Extra breathing room between ranks (on top of sub-row height already added)
    currentY += RANK_SEP;
  }

  const laidOut = nodes.map((node) => ({
    ...node,
    position: posMap.get(node.id) ?? node.position,
  }));

  return { nodes: laidOut, edges };
}
