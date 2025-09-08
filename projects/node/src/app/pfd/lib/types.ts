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
    func: (args: Record<string, any>) => any;
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
}
