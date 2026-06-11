"use client";

import { memo } from "react";
import { Handle, Position } from "reactflow";

/**
 * Decorative (non-course) nodes for the DAG View roadmap:
 *  - GroupBoxNode: labelled container around an elective family / capstone.
 *    Carries invisible target handles on its top border so feed edges can
 *    terminate at hand-picked lane positions.
 *  - LayerLabelNode: numbered layer title in the left margin.
 * Both render behind course nodes (node zIndex set where they're created).
 */

export interface GroupBoxNodeData {
  w: number;
  h: number;
  title: string;
  subtitle: string;
  tone: "violet" | "gold";
  handles: { id: string; left: number }[];
}

const toneStyles: Record<GroupBoxNodeData["tone"], { box: string; title: string; subtitle: string }> = {
  violet: {
    box: "border-violet-400/25 bg-violet-400/[0.04]",
    title: "text-violet-300",
    subtitle: "text-violet-300/60",
  },
  gold: {
    box: "border-amber-400/35 bg-amber-400/[0.05]",
    title: "text-amber-300",
    subtitle: "text-amber-300/60",
  },
};

export const GroupBoxNode = memo(function GroupBoxNode({ data }: { data: GroupBoxNodeData }) {
  const tone = toneStyles[data.tone];
  return (
    <div
      className={`rounded-2xl border-2 border-dashed ${tone.box}`}
      style={{ width: data.w, height: data.h, pointerEvents: "none" }}
    >
      <div className="px-5 pt-3">
        <p className={`text-sm font-bold uppercase tracking-widest ${tone.title}`}>{data.title}</p>
        <p className={`text-[11px] font-semibold uppercase tracking-wider ${tone.subtitle}`}>{data.subtitle}</p>
      </div>
      {data.handles.map((h) => (
        <Handle
          key={h.id}
          id={h.id}
          type="target"
          position={Position.Top}
          style={{ left: h.left, opacity: 0, width: 6, height: 6, border: 0 }}
        />
      ))}
    </div>
  );
});

export interface LayerLabelNodeData {
  index: number;
  title: string;
}

export const LayerLabelNode = memo(function LayerLabelNode({ data }: { data: LayerLabelNodeData }) {
  return (
    <div className="flex w-[280px] items-center gap-2.5" style={{ pointerEvents: "none" }}>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] font-mono text-xs font-bold text-white/50">
        {data.index}
      </span>
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">
        {data.title}
      </span>
    </div>
  );
});
