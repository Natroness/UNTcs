"use client";

import { memo } from "react";
import { Handle, Position } from "reactflow";
import type { CourseNodeData } from "@/types/course";

const statusStyles: Record<
  CourseNodeData["status"],
  { card: string; badge: string; label: string }
> = {
  completed: {
    card: "bg-green-50 border-green-500",
    badge: "bg-green-500 text-white",
    label: "Completed",
  },
  available: {
    card: "bg-blue-50 border-blue-500",
    badge: "bg-blue-500 text-white",
    label: "Available",
  },
  locked: {
    card: "bg-gray-50 border-gray-300",
    badge: "bg-gray-300 text-gray-700",
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
      <Handle type="target" position={Position.Top} className="!border-0 !bg-slate-400" />

      <div
        className={`border-2 rounded-xl p-3 shadow-sm ${s.card}`}
        style={{ width: 230 }}
      >
        <div className="flex items-start justify-between gap-1">
          <span className="font-mono text-sm font-bold leading-tight text-slate-900">
            {data.code}
          </span>
          <span
            className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none ${s.badge}`}
          >
            {data.credits}cr
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-slate-600">
          {data.title}
        </p>
      </div>

      <Handle type="source" position={Position.Bottom} className="!border-0 !bg-slate-400" />
    </>
  );
}

export default memo(CourseNode);
