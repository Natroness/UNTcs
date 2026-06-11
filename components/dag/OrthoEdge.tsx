"use client";

import { BaseEdge, type EdgeProps } from "reactflow";

/**
 * Orthogonal roadmap edge with a hand-routed horizontal "shelf".
 *
 * Shape (top-to-bottom flow):
 *   source ↓ shelfY → targetX ↓ target
 *
 * data.shelfY picks the y of the horizontal segment so designers can
 * route every edge through a known-free lane (no node pass-throughs,
 * no crossings). Falls back to the vertical midpoint when omitted.
 * Degenerates to a straight line for pure vertical / side edges.
 */
export interface OrthoEdgeData {
  shelfY?: number;
}

const RADIUS = 14;

export function OrthoEdge({
  sourceX, sourceY, targetX, targetY,
  data, style, markerEnd,
}: EdgeProps<OrthoEdgeData>) {
  const path = buildPath(sourceX, sourceY, targetX, targetY, data?.shelfY);
  return <BaseEdge path={path} style={style} markerEnd={markerEnd} />;
}

function buildPath(sx: number, sy: number, tx: number, ty: number, shelfY?: number): string {
  // Side edge between adjacent nodes in the same row.
  if (Math.abs(sy - ty) < 8) return `M ${sx},${sy} L ${tx},${ty}`;
  // Straight vertical drop.
  if (Math.abs(sx - tx) < 8) return `M ${sx},${sy} L ${tx},${ty}`;

  const mid = shelfY ?? (sy + ty) / 2;
  const dir = tx > sx ? 1 : -1; // horizontal direction along the shelf
  const r = Math.min(RADIUS, Math.abs(tx - sx) / 2, Math.abs(mid - sy), Math.abs(ty - mid));

  return [
    `M ${sx},${sy}`,
    `L ${sx},${mid - r}`,
    `Q ${sx},${mid} ${sx + dir * r},${mid}`,
    `L ${tx - dir * r},${mid}`,
    `Q ${tx},${mid} ${tx},${mid + r}`,
    `L ${tx},${ty}`,
  ].join(" ");
}
