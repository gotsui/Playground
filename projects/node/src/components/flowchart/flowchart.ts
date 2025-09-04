import { FlowchartEdge, FlowchartNode } from "@/types/flowchart";

// 初期ノード
export const initialNodes: FlowchartNode[] = [
    {
        id: "start",
        type: "start",
        data: { label: "開始" },
        position: { x: 250, y: 50 },
    },
    {
        id: "end",
        type: "end",
        data: { label: "終了" },
        position: { x: 250, y: 300 },
    },
];

// 初期エッジ
export const initialEdges: FlowchartEdge[] = [
    {
        id: "start-end",
        source: "start",
        target: "end",
        type: "button",
    },
];

// フロー実行関数
export const executeFlow = (nodes: FlowchartNode[], edges: FlowchartEdge[]): string[] => {
    let currentNode = nodes.find((n) => n.type === "start");
    const visited: string[] = [];

    while (currentNode) {
        visited.push(currentNode.data.label);

        if (currentNode.type === "condition") {
            const nextEdge = edges.find((edge) => edge.source === currentNode!.id && edge.sourceHandle === "true");

            if (nextEdge) {
                currentNode = nodes.find((node) => node.id === nextEdge.target);
            } else {
                break;
            }
        } else {
            const nextEdge = edges.find((edge) => edge.source === currentNode!.id);

            if (nextEdge) {
                currentNode = nodes.find((node) => node.id === nextEdge.target);
            } else {
                break;
            }
        }
    }

    return visited;
};