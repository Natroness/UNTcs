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
import { compactLayerLayout } from "@/lib/compactLayerLayout";
import { useMemo } from "react";

const nodeTypes = { courseNode: CourseNode };

interface Props {
  graph: DAGGraph;
}

export function CourseDAG({ graph }: Props) {
  // Apply compact layout at render time so the section component stays simple
  const { nodes, edges } = useMemo(
    () => compactLayerLayout(graph.nodes, graph.edges),
    [graph],
  );

  return (
    <div className="h-[720px] w-full overflow-hidden rounded-2xl border border-white/12 bg-[#0a0a0a]">
      <ReactFlow
        nodes={nodes as Node[]}
        edges={edges as Edge[]}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.12 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
        minZoom={0.12}
        maxZoom={2}
      >
        <Background gap={28} color="rgba(255,255,255,0.04)" />
        <MiniMap
          pannable
          zoomable
          nodeColor={(n) => {
            const d = n.data as { status?: string };
            if (d.status === "completed") return "#34d399";
            if (d.status === "available") return "#2fffd0";
            return "rgba(255,255,255,0.12)";
          }}
          style={{
            background: "rgba(255,255,255,0.04)",
            borderColor: "rgba(255,255,255,0.1)",
          }}
        />
        <Controls
          showInteractive={false}
          style={{
            background: "rgba(255,255,255,0.05)",
            borderColor: "rgba(255,255,255,0.1)",
          }}
        />
      </ReactFlow>
    </div>
  );
}
