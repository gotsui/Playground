import { Edge, Node } from "@xyflow/react";

// ノードタイプの型定義
export const TerminalNodeTypes = ["start", "end"] as const;
export const ActivityNodeTypes = ["process", "condition"] as const;
export const FlowchartNodeTypes = [...TerminalNodeTypes, ...ActivityNodeTypes] as const;

export type TerminalNodeType = typeof TerminalNodeTypes[number];
export type ActivityNodeType = typeof ActivityNodeTypes[number];
export type FlowchartNodeType = typeof FlowchartNodeTypes[number];

// ノードデータの型定義
export type FlowchartNodeData = {
    label: string;
    onExecute?: (node: Node<FlowchartNodeData>) => void;
};

// ノードの型定義
export type FlowchartNode = Node<FlowchartNodeData, FlowchartNodeType>;

// エッジデータの型定義
export type FlowchartEdgeData = {
    onInsert?: (edge: FlowchartEdge, nodeType: ActivityNodeType) => void;
};

// エッジの型定義
export type FlowchartEdge = Edge<FlowchartEdgeData, "button">;
