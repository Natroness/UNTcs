"use client";

import { memo } from "react";
import { Handle, Position } from "reactflow";
import type { CourseNodeData } from "@/types/course";

const statusStyles: Record<
  CourseNodeData["status"],
  { card: string; badge: string }
> = {
  completed: {
    card: "border-emerald-400/50 bg-gradient-to-b from-emerald-400/20 to-transparent",
    badge: "bg-emerald-400 text-black",
  },
  available: {
    card: "border-sky-400/50 bg-gradient-to-b from-sky-400/20 to-transparent",
    badge: "bg-sky-400 text-black",
  },
  locked: {
    card: "border-white/15 bg-gradient-to-b from-white/5 to-transparent",
    badge: "bg-white/20 text-white/60",
  },
};

interface Props {
  data: CourseNodeData;
}

function CourseNode({ data }: Props) {
  const s = statusStyles[data.status];

  return (
    <>
      <Handle type="target" position={Position.Top} className="!border-0 !bg-white/20" />
      <div className={`rounded-xl border-2 p-3 ${s.card}`} style={{ width: 230 }}>
        <div className="flex items-start justify-between gap-1">
          <span className="font-mono text-sm font-bold leading-tight text-white">
            {data.code}
          </span>
          <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${s.badge}`}>
            {data.credits}cr
          </span>
        </div>
        <p className="mt-1.5 line-clamp-2 text-[11px] leading-snug text-[#84a5aa]">
          {data.title}
        </p>
      </div>
      <Handle type="source" position={Position.Bottom} className="!border-0 !bg-white/20" />
    </>
  );
}

export default memo(CourseNode);
