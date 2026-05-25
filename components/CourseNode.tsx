"use client";

import { memo } from "react";
import { Handle, Position } from "reactflow";
import type { CourseNodeData } from "@/types/course";
import { COMPACT_NODE_W } from "@/lib/compactLayerLayout";

const statusCard: Record<CourseNodeData["status"], string> = {
  completed: "border-emerald-400/50 bg-gradient-to-b from-emerald-400/20 to-transparent",
  available: "border-[#2fffd0]/50 bg-gradient-to-b from-[#2fffd0]/15 to-transparent",
  locked:    "border-white/12 bg-gradient-to-b from-white/5 to-transparent",
};

const statusBadge: Record<CourseNodeData["status"], string> = {
  completed: "bg-emerald-400 text-black",
  available: "bg-[#2fffd0] text-black",
  locked:    "bg-white/15 text-white/50",
};

interface Props {
  data: CourseNodeData;
}

function CourseNode({ data }: Props) {
  return (
    <>
      <Handle type="target" position={Position.Top} className="!border-0 !bg-white/20" />
      <div
        className={`rounded-xl border-2 px-3 py-2.5 ${statusCard[data.status]}`}
        style={{ width: COMPACT_NODE_W }}
      >
        <div className="flex items-start justify-between gap-1">
          <span className="font-mono text-[12px] font-bold leading-tight text-white">
            {data.code}
          </span>
          <div className="flex shrink-0 items-center gap-1">
            {/* Purple transfer badge */}
            {data.isTransfer && (
              <span className="rounded-full border border-violet-400/40 bg-violet-400/15 px-1.5 py-0.5 text-[8px] font-bold leading-none text-violet-300">
                TR
              </span>
            )}
            <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold leading-none ${statusBadge[data.status]}`}>
              {data.credits}cr
            </span>
          </div>
        </div>
        <p className="mt-1 line-clamp-2 text-[10px] leading-snug text-[#84a5aa]">
          {data.title}
        </p>
      </div>
      <Handle type="source" position={Position.Bottom} className="!border-0 !bg-white/20" />
    </>
  );
}

export default memo(CourseNode);
