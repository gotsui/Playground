import { Edge, Node } from "@xyflow/react";

export type PfdArg = {
    name: string;
    type: "string" | "number" | "boolean" | "select" | "file" | "textarea" | "NodeId";
    label: string;
    defaultValue?: string | number | boolean;
    options?: string[];
};

export type PfdFunction = {
    id: string;
    name: string;
    args: PfdArg[];
    func: (args: Record<string, any>) => any | Promise<any>;
    nodeType: PfdNodeType;
};

export const PfdNodeTypes = ["start", "end", "process", "condition", "loopStart", "loopEnd"] as const;
export type PfdNodeType = typeof PfdNodeTypes[number];

export type PfdNodeData = {
    label: string;
    functionId: string;
    args: Record<string, string | number | boolean | null>;
    returnValueName: string;
};

export type PfdNode = Node<PfdNodeData, PfdNodeType>;

export type Flow = {
    nodes: PfdNode[];
    edges: Edge[];
};

export enum Operator {
    GREATER_THAN = ">",
}

export type Condition = {
    operator: Operator;
    target: string;
    value: string;
    label: string;
};

export type BaseNodeData = {
    label: string;
    params: Record<string, any>;
};

export type ConditionNodeData = BaseNodeData & {
    type: "condition";
    conditions: Condition[];
};

export type ProcessNodeData = BaseNodeData & {
    type: "process";
};

export type FlowchartNodeData = ConditionNodeData | ProcessNodeData;

export type FlowchartNode = Node & {
    data: FlowchartNodeData;
};


const n1: FlowchartNode = { id: "1", position: { x: 0, y: 0 }, data: { label: "", params: [], type: "condition", conditions: [] } };