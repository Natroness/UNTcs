"use client";

import { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  MarkerType,
  type Edge,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";
import DagCourseNode, { type DagCourseNodeData } from "@/components/dag/DagCourseNode";
import { GroupBoxNode, LayerLabelNode } from "@/components/dag/DagDecorNodes";
import { OrthoEdge } from "@/components/dag/OrthoEdge";
import {
  DAG_VIEW_POSITIONS,
  DAG_EMPHASIS,
  DAG_EXTRA_REQ,
  DAG_GROUP_BOXES,
  DAG_LAYER_LABELS,
  DAG_EDGES,
  dagEdgeColor,
} from "@/components/dag/dagViewLayout";
import type { DAGGraph } from "@/lib/buildDAG";

const nodeTypes = {
  dagCourse: DagCourseNode,
  groupBox: GroupBoxNode,
  layerLabel: LayerLabelNode,
};

const edgeTypes = { ortho: OrthoEdge };

interface Props {
  graph: DAGGraph;
}

/**
 * DAG View tab — hand-designed degree roadmap.
 *
 * Course statuses (completed / available / locked) come from the graph
 * prop; positions, containers, and curated orthogonal edges come from
 * components/dag/dagViewLayout.ts. The catalog-derived graph.edges are
 * intentionally NOT drawn here — the roadmap shows a curated, crossing-free
 * subset with group-level edges into the elective containers.
 */
export function CourseDAG({ graph }: Props) {
  const nodes = useMemo<Node[]>(() => {
    // Decorative layers first (rendered behind courses via zIndex).
    const decor: Node[] = [
      ...DAG_GROUP_BOXES.map((g) => ({
        id: g.id,
        type: "groupBox",
        position: g.position,
        data: { w: g.w, h: g.h, title: g.title, subtitle: g.subtitle, tone: g.tone, handles: g.handles },
        zIndex: -1,
        draggable: false,
        selectable: false,
        focusable: false,
      })),
      ...DAG_LAYER_LABELS.map((l) => ({
        id: l.id,
        type: "layerLabel",
        position: l.position,
        data: { index: l.index, title: l.title },
        zIndex: -1,
        draggable: false,
        selectable: false,
        focusable: false,
      })),
    ];

    // Courses missing from the hand layout stack in a far-left fallback column.
    let fallbackIndex = 0;
    const courses: Node[] = graph.nodes.map((n) => {
      const pos = DAG_VIEW_POSITIONS[n.id] ?? { x: -700, y: 120 * fallbackIndex++ };
      const data: DagCourseNodeData = {
        ...n.data,
        emphasis: DAG_EMPHASIS.has(n.id),
        extraReq: DAG_EXTRA_REQ[n.id],
      };
      return { id: n.id, type: "dagCourse", position: pos, data, draggable: false };
    });

    return [...decor, ...courses];
  }, [graph.nodes]);

  const edges = useMemo<Edge[]>(
    () =>
      DAG_EDGES.map((e) => {
        const color = dagEdgeColor(e.source);
        return {
          id: `${e.source}->${e.target}${e.targetHandle ? `#${e.targetHandle}` : ""}`,
          source: e.source,
          target: e.target,
          targetHandle: e.targetHandle ?? (e.side ? "l" : undefined),
          sourceHandle: e.side ? "r" : undefined,
          type: "ortho",
          data: { shelfY: e.shelfY },
          style: {
            stroke: color,
            strokeWidth: 1.8,
            opacity: e.dashed ? 0.55 : 0.8,
            strokeDasharray: e.dashed ? "6 5" : undefined,
          },
          markerEnd: { type: MarkerType.ArrowClosed, color, width: 16, height: 16 },
        };
      }),
    [],
  );

  return (
    <div className="h-[720px] w-full overflow-hidden rounded-2xl border border-white/12 bg-[#0a0a0a]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.06 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
        minZoom={0.08}
        maxZoom={2}
      >
        <Background gap={28} color="rgba(255,255,255,0.04)" />
        <Panel
          position="top-left"
          className="!m-3 rounded-lg border border-white/10 bg-black/70 px-3 py-2 text-[10px] leading-relaxed text-[#84a5aa]"
        >
          <p><span className="font-bold text-white/70">solid →</span> prerequisite</p>
          <p><span className="font-bold text-white/70">dashed →</span> co-requisite (take together)</p>
          <p>
            <span className="rounded border border-amber-400/25 bg-amber-400/10 px-1 font-mono text-[8px] font-bold text-amber-300">+ code</span>{" "}
            additional prerequisite
          </p>
        </Panel>
        <MiniMap
          pannable
          zoomable
          nodeColor={(n) => {
            if (n.type !== "dagCourse") return "transparent";
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
