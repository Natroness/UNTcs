"use client";

import { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Position,
  type Edge,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";
import type { DAGGraph } from "@/lib/buildDAG";

interface Props {
  graph: DAGGraph;
}

export function CourseDAG({ graph }: Props) {
  const nodes = useMemo<Node[]>(
    () =>
      graph.nodes.map((n) => ({
        id: n.id,
        position: n.position,
        data: { label: `${n.data.label}\n${n.data.title}` },
        style: n.style,
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      })),
    [graph.nodes],
  );

  const edges = useMemo<Edge[]>(
    () =>
      graph.edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        animated: false,
        style: { stroke: "#94a3b8" },
      })),
    [graph.edges],
  );

  return (
    <div className="h-[70vh] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
      >
        <Background gap={24} color="#e2e8f0" />
        <MiniMap pannable zoomable className="!bg-white" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
