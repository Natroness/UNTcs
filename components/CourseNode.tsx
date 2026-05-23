"use client";

import { memo } from "react";
import { Handle, Position } from "reactflow";
import type { CourseNodeData } from "@/types/course";

const statusStyles: Record<
  CourseNodeData["status"],
  { card: string; badge: string; label: string }
> = {
  completed: {
    card: "bg-emerald-400/10 border-emerald-400/40",
    badge: "bg-emerald-400 text-black",
    label: "Completed",
  },
  available: {
    card: "bg-sky-400/10 border-sky-400/40",
    badge: "bg-sky-400 text-black",
    label: "Available",
  },
  locked: {
    card: "bg-white/5 border-white/15",
    badge: "bg-white/20 text-white/70",
    label: "Locked",
  },
};

interface Props {
  data: CourseNodeData;
}

function CourseNode({ data }: Props) {
  const s = statusStyles[data.status];

  return (
    <>
      <Handle type="target" position={Position.Top} className="!border-0 !bg-white/30" />

      <div
        className={`rounded-xl border-2 p-3 ${s.card}`}
        style={{ width: 230 }}
      >
        <div className="flex items-start justify-between gap-1">
          <span className="font-mono text-sm font-bold leading-tight text-white">
            {data.code}
          </span>
          <span
            className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none ${s.badge}`}
          >
            {data.credits}cr
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-white/60">
          {data.title}
        </p>
      </div>

      <Handle type="source" position={Position.Bottom} className="!border-0 !bg-white/30" />
    </>
  );
}

export default memo(CourseNode);
