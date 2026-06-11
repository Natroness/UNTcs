"use client";

import { memo } from "react";
import { Handle, Position } from "reactflow";
import type { CourseNodeData } from "@/types/course";
import { DAG_NODE_W } from "./dagViewLayout";

/**
 * Course node for the DAG View roadmap.
 *
 * Same visual language as components/CourseNode.tsx (status colors must
 * match the section legend) plus:
 *   - left/right handles so co-requisite pairs can link side-to-side
 *   - a glow for gateway courses (data.emphasis)
 *   - an "extra prerequisite" chip (data.extraReq) used inside elective
 *     containers instead of long cross-map edges
 */
export interface DagCourseNodeData extends CourseNodeData {
  emphasis?: boolean;
  extraReq?: string;
}

const statusCard: Record<CourseNodeData["status"], string> = {
  completed: "border-emerald-400/50 bg-gradient-to-b from-emerald-400/20 to-transparent",
  available: "border-[#2fffd0]/50 bg-gradient-to-b from-[#2fffd0]/15 to-transparent",
  locked:    "border-white/12 bg-gradient-to-b from-white/5 to-transparent",
};

const electiveCard: Record<CourseNodeData["status"], string> = {
  completed: "border-emerald-400/40 bg-gradient-to-b from-emerald-400/15 to-transparent",
  available: "border-[#2fffd0]/35 bg-gradient-to-b from-[#2fffd0]/10 to-transparent",
  locked:    "border-white/8 bg-white/[0.02]",
};

const statusBadge: Record<CourseNodeData["status"], string> = {
  completed: "bg-emerald-400 text-black",
  available: "bg-[#2fffd0] text-black",
  locked:    "bg-white/15 text-white/50",
};

const hiddenHandle = { opacity: 0, width: 6, height: 6, border: 0 } as const;

function DagCourseNode({ data }: { data: DagCourseNodeData }) {
  const isElective = data.courseType === "elective";
  const cardStyle = isElective ? electiveCard[data.status] : statusCard[data.status];

  return (
    <>
      <Handle type="target" position={Position.Top} className="!border-0 !bg-white/20" />
      <Handle type="target" id="l" position={Position.Left} style={hiddenHandle} />
      <div
        className={`rounded-xl border-2 bg-[#0a0a0a] px-3 py-2.5 ${cardStyle}`}
        style={{
          width: DAG_NODE_W,
          boxShadow: data.emphasis
            ? "0 0 0 2px rgba(47,255,208,0.35), 0 0 28px rgba(47,255,208,0.18)"
            : undefined,
        }}
      >
        <div className="flex items-start justify-between gap-1">
          <span
            className={`font-mono text-[12px] font-bold leading-tight ${
              isElective && data.status === "locked" ? "text-white/50" : "text-white"
            }`}
          >
            {data.code}
          </span>
          <div className="flex shrink-0 flex-wrap items-center gap-1">
            {isElective && (
              <span className="rounded-full border border-violet-400/30 bg-violet-400/10 px-1.5 py-0.5 text-[8px] font-bold leading-none text-violet-300">
                OPT
              </span>
            )}
            {data.isTransfer && (
              <span className="rounded-full border border-violet-400/40 bg-violet-400/15 px-1.5 py-0.5 text-[8px] font-bold leading-none text-violet-300">
                TR
              </span>
            )}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold leading-none ${statusBadge[data.status]}`}
            >
              {data.credits}cr
            </span>
          </div>
        </div>
        <p
          className={`mt-1 line-clamp-2 text-[10px] leading-snug ${
            isElective && data.status === "locked" ? "text-white/30" : "text-[#84a5aa]"
          }`}
        >
          {data.title}
        </p>
        {data.extraReq && (
          <p className="mt-1 inline-block rounded border border-amber-400/25 bg-amber-400/10 px-1 py-0.5 font-mono text-[8px] font-bold leading-none text-amber-300">
            {data.extraReq}
          </p>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="!border-0 !bg-white/20" />
      <Handle type="source" id="r" position={Position.Right} style={hiddenHandle} />
    </>
  );
}

export default memo(DagCourseNode);
