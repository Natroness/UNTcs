"use client";

import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Edge,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";
import CourseNode from "@/components/CourseNode";
import type { DAGGraph } from "@/lib/buildDAG";

const nodeTypes = { courseNode: CourseNode };

interface Props {
  graph: DAGGraph;
}

export function CourseDAG({ graph }: Props) {
  return (
    <div className="h-[750px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-card">
      <ReactFlow
        nodes={graph.nodes as Node[]}
        edges={graph.edges as Edge[]}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
        minZoom={0.2}
        maxZoom={2}
      >
        <Background gap={28} color="#e2e8f0" />
        <MiniMap
          pannable
          zoomable
          nodeColor={(n) => {
            const status = (n.data as { status?: string }).status;
            if (status === "completed") return "#22c55e";
            if (status === "available") return "#3b82f6";
            return "#d1d5db";
          }}
          className="!bg-white"
        />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
