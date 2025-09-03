"use client";

import { Background, Edge, MarkerType, Node, ReactFlow } from "@xyflow/react";
import AddButtonEdge from "./AddButtonEdge";

const defaultNodes: Node[] = [
    { id: "ns", position: { x: 0, y: 0 }, data: { label: "開始" }, type: "input" },
    { id: "ne", position: { x: 0, y: 200 }, data: { label: "終了" }, type: "output" },
];

const defaultEdges: Edge[] = [
    { id: "ns-ne", source: "ns", target: "ne" },
];

const defaultEdgeOptions = {
    type: "button",
    markerEnd: {
        type: MarkerType.ArrowClosed,
    },
    style: {
        strokeWidth: 2,
    },
};

const edgeTypes = {
    button: AddButtonEdge,
};

const FlowchartEditor = () => {
    return (
        <div className="h-full w-full">
            <ReactFlow
                defaultNodes={defaultNodes}
                defaultEdges={defaultEdges}
                edgeTypes={edgeTypes}
                defaultEdgeOptions={defaultEdgeOptions}
                fitView
            >
                <Background />
            </ReactFlow>
        </div>
    );
};

export default FlowchartEditor;