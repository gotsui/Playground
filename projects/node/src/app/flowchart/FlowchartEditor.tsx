"use client";

import { Background, ReactFlow } from "@xyflow/react";
import AddButtonEdge from "./AddButtonEdge";

const defaultNodes = [
    { id: "ns", position: { x: 0, y: 0 }, data: { label: "開始" }, type: "input" },
    { id: "ne", position: { x: 0, y: 200 }, data: { label: "終了" }, type: "output" },
];

const defaultEdges = [
    { id: "ns-ne", source: "ns", target: "ne", type: "button" },
];

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
                fitView
            >
                <Background />
            </ReactFlow>
        </div>
    );
};

export default FlowchartEditor;