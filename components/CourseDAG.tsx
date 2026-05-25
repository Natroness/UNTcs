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
    <div className="h-[780px] w-full overflow-hidden rounded-2xl border border-white/12 bg-[#0a0a0a]">
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
        minZoom={0.15}
        maxZoom={2}
      >
        <Background gap={28} color="rgba(255,255,255,0.04)" />
        <MiniMap
          pannable
          zoomable
          nodeColor={(n) => {
            const status = (n.data as { status?: string }).status;
            if (status === "completed") return "#34d399";
            if (status === "available") return "#2fffd0";
            return "rgba(255,255,255,0.15)";
          }}
          style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)" }}
        />
        <Controls showInteractive={false} style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }} />
      </ReactFlow>
    </div>
  );
}
