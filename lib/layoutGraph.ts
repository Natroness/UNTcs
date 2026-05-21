import dagre from "dagre";

const NODE_WIDTH = 230;
const NODE_HEIGHT = 85;

/**
 * Apply dagre automatic top-to-bottom layout to a set of React Flow nodes and
 * edges. Returns new node objects with updated x/y positions (centered around
 * the dagre anchor) plus the original edges unchanged.
 *
 * The generic <N, E> pass-through preserves the full node/edge types so
 * callers don't lose data field types after layout.
 *
 * All graph-layout logic lives here; React components stay rendering-focused.
 */
export function layoutGraph<
  N extends { id: string; position: { x: number; y: number } },
  E extends { id: string; source: string; target: string },
>(nodes: N[], edges: E[]): { nodes: N[]; edges: E[] } {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: "TB",
    nodesep: 70,
    ranksep: 110,
    marginx: 40,
    marginy: 40,
  });

  for (const node of nodes) {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }

  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }

  dagre.layout(g);

  const laidOut = nodes.map((node) => {
    const pos = g.node(node.id);
    return {
      ...node,
      position: {
        x: pos.x - NODE_WIDTH / 2,
        y: pos.y - NODE_HEIGHT / 2,
      },
    };
  });

  return { nodes: laidOut, edges };
}
