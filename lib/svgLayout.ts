/**
 * Handmade SVG layout — positions extracted directly from courseMap.svg
 * (drawn in Excalidraw). Each entry is the top-left corner of the ReactFlow
 * node (center of SVG label − half the node dimensions).
 *
 * Courses not present in the handmade map are placed nearby their logical
 * neighbors so the overall graph stays coherent.
 *
 * SVG viewBox: 0 0 2918.82 2352.38   (all coords below are in SVG units)
 * Node dimensions: 168 × 74
 */

export const SVG_NODE_W = 168;
export const SVG_NODE_H = 74;

/** top-left ReactFlow positions derived from the handmade map. */
const HANDMADE_POSITIONS: Record<string, { x: number; y: number }> = {
  // ── Core CS chain ──────────────────────────────────────────────
  "CSCE 1010": { x:  852, y:  -90 },   // above CSCE 1030 (not in SVG → placed above)
  "CSCE 1015": { x: 1096, y:   53 },   // co-req of CSCE 1030 → right of it
  "CSCE 1030": { x:  852, y:   53 },   // SVG center (935.5, 90.1)
  "CSCE 1040": { x:  831, y:  296 },
  "CSCE 2100": { x: 1376, y:  674 },
  "CSCE 2110": { x:  858, y:  611 },
  "CSCE 2610": { x: 1962, y:  771 },
  "CSCE 3444": { x:  731, y: 1038 },
  "CSCE 3550": { x:  134, y: 1031 },
  "CSCE 3600": { x: 1361, y:  975 },
  "CSCE 4010": { x: 1371, y: 1444 },
  "CSCE 4110": { x:  825, y: 1448 },
  "CSCE 4901": { x: 2647, y: 1373 },
  "CSCE 4902": { x: 2601, y: 1763 },

  // ── Math chain ────────────────────────────────────────────────
  "MATH 1710": { x: 1421, y:   51 },
  "MATH 1720": { x: 1790, y:  310 },
  "MATH 1780": { x: 2116, y:  310 },   // same row as MATH 1720, right of it
  "MATH 2700": { x: 2389, y:  749 },
  "MATH 3680": { x: 1516, y:  490 },   // below MATH 1710, left of MATH 1720

  // ── Hardware chain ────────────────────────────────────────────
  "EENG 2710": { x: 1962, y:  563 },   // above CSCE 2610

  // ── Writing chain ─────────────────────────────────────────────
  "ENGL 1310": { x: 2536, y:   23 },   // above ENGL 1320
  "ENGL 1320": { x: 2462, y:  163 },   // above TECM 2700
  "TECM 2700": { x: 2463, y:  317 },

  // ── Core electives (left cluster) ────────────────────────────
  "CSCE 3530": { x:  870, y: 1735 },
  "CSCE 4115": { x:  268, y: 1760 },
  "CSCE 4600": { x:  891, y: 1919 },
  "CSCE 4430": { x:  256, y: 1930 },
  "CSCE 4650": { x:  554, y: 2109 },

  // ── Breadth electives (right cluster) ────────────────────────
  "CSCE 4201": { x: 1594, y: 1769 },
  "CSCE 4210": { x: 1597, y: 1932 },
  "CSCE 4230": { x: 2008, y: 1749 },
  "CSCE 4240": { x: 2216, y: 2063 },   // not in SVG → placed near CSCE 4230
  "CSCE 4290": { x: 2011, y: 1922 },
  "CSCE 4350": { x: 1630, y: 2092 },
  "CSCE 4460": { x: 2022, y: 2070 },
};

type NodeLike = { id: string; position: { x: number; y: number } };
type EdgeLike = { id: string; source: string; target: string };

/**
 * Apply the handmade SVG positions to ReactFlow nodes.
 * Courses not found in HANDMADE_POSITIONS keep their current position
 * (the caller is responsible for giving them a reasonable fallback).
 */
export function svgPositionLayout<
  N extends NodeLike,
  E extends EdgeLike,
>(nodes: N[], edges: E[]): { nodes: N[]; edges: E[] } {
  const laid = nodes.map((n) => {
    const pos = HANDMADE_POSITIONS[n.id];
    return pos ? { ...n, position: pos } : n;
  });
  return { nodes: laid, edges };
}
